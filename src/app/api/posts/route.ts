import type { JSONContent } from "@tiptap/core";
import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "@/db";
import { authors, contributions, postAuthors, posts, revisions } from "@/db/schema";
import { apiError, getRequestUser, requireContentUser } from "@/lib/api";
import { renderDocument, slugify } from "@/lib/content-renderer";
import { canPublishContent } from "@/lib/permissions";

export const dynamic = "force-dynamic";

const postInput = z.object({
  title: z.string().trim().min(1).max(300),
  subtitle: z.string().trim().max(500).optional(),
  kicker: z.string().trim().max(160).optional(),
  releaseType: z.enum(["story", "poem", "essay", "article", "review", "interview", "note", "announcement"]).default("article"),
  slug: z.string().trim().max(220).optional(),
  excerpt: z.string().trim().max(1000).optional(),
  document: z.object({ type: z.literal("doc"), content: z.array(z.unknown()).optional() }),
  status: z.enum(["draft", "review", "scheduled", "published"]).default("draft"),
  visibility: z.enum(["public", "unlisted", "private"]).default("public"),
  scheduledAt: z.coerce.date().optional(),
  contributors: z.array(z.object({
    authorId: z.string().min(1).max(24),
    role: z.enum(["author", "co_author", "translator", "editor", "compiler", "illustrator", "introduction", "researcher", "photographer", "narrator", "rights_holder"]).default("author"),
    customByline: z.string().trim().max(200).optional(),
  })).max(30).default([]),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const includeDrafts = url.searchParams.get("scope") === "studio";
  if (includeDrafts && !(await getRequestUser(request))) return apiError("Authentication required", 401);
  const result = await db
    .select({ id: posts.id, slug: posts.slug, title: posts.title, excerpt: posts.excerpt, status: posts.status, visibility: posts.visibility, publishedAt: posts.publishedAt, updatedAt: posts.updatedAt })
    .from(posts)
    .where(includeDrafts ? undefined : eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt), desc(posts.updatedAt))
    .limit(50);
  return Response.json({ data: result });
}

export async function POST(request: Request) {
  const user = await requireContentUser(request);
  if (!user) return apiError("Writer permission required", 403);
  const parsed = postInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("Invalid post", 422, parsed.error.flatten());

  const input = parsed.data;
  if (input.status === "published" && !canPublishContent(user.role)) return apiError("An editor must publish this release", 403);
  const document = input.document as JSONContent;
  const rendered = renderDocument(document);
  if (rendered.plainText.length > 500_000) return apiError("Post is too large", 413);
  const id = nanoid();
  const revisionId = nanoid();
  const slug = slugify(input.slug || input.title) || id;
  const publishedAt = input.status === "published" ? new Date() : null;

  try {
    await db.transaction(async (tx) => {
      await tx.insert(posts).values({
        id, slug, title: input.title, subtitle: input.subtitle, kicker: input.kicker,
        releaseType: input.releaseType, excerpt: input.excerpt, document,
        renderedHtml: rendered.html, plainText: rendered.plainText,
        tableOfContents: rendered.tableOfContents, status: input.status,
        visibility: input.visibility, authorId: user.id,
        scheduledAt: input.scheduledAt, publishedAt,
      });
      await tx.insert(postAuthors).values({ postId: id, userId: user.id, bylineOrder: 0 });
      let credits = input.contributors;
      if (!credits.length) {
        const [profile] = await tx.select({ id: authors.id }).from(authors).where(eq(authors.accountId, user.id)).limit(1);
        let authorId = profile?.id;
        if (!authorId) {
          authorId = nanoid();
          const authorSlug = `${slugify(user.name) || "writer"}-${authorId.slice(0, 6)}`;
          await tx.insert(authors).values({ id: authorId, accountId: user.id, slug: authorSlug, name: user.name, kind: "current" });
        }
        credits = [{ authorId, role: "author" as const }];
      }
      await tx.insert(contributions).values(credits.map((credit, displayOrder) => ({
        id: nanoid(), entityType: "release" as const, entityId: id, authorId: credit.authorId,
        role: credit.role, displayOrder, customByline: credit.customByline,
      })));
      await tx.insert(revisions).values({ id: revisionId, postId: id, authorId: user.id, title: input.title, document, renderedHtml: rendered.html, changeNote: "Initial version" });
    });
  } catch (error) {
    if (error instanceof Error && /duplicate/i.test(error.message)) return apiError("That post URL is already in use", 409);
    throw error;
  }

  return Response.json({ data: { id, slug, status: input.status, updatedAt: new Date().toISOString() } }, { status: 201 });
}
