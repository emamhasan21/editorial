import type { JSONContent } from "@tiptap/core";
import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "@/db";
import { postAuthors, posts, revisions } from "@/db/schema";
import { apiError, getRequestUser } from "@/lib/api";
import { renderDocument, slugify } from "@/lib/content-renderer";

export const dynamic = "force-dynamic";

const postInput = z.object({
  title: z.string().trim().min(1).max(300),
  slug: z.string().trim().max(220).optional(),
  excerpt: z.string().trim().max(1000).optional(),
  document: z.object({ type: z.literal("doc"), content: z.array(z.unknown()).optional() }),
  status: z.enum(["draft", "review", "scheduled", "published"]).default("draft"),
  visibility: z.enum(["public", "unlisted", "private"]).default("public"),
  scheduledAt: z.coerce.date().optional(),
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
  const user = await getRequestUser(request);
  if (!user) return apiError("Authentication required", 401);
  const parsed = postInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("Invalid post", 422, parsed.error.flatten());

  const input = parsed.data;
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
        id, slug, title: input.title, excerpt: input.excerpt, document,
        renderedHtml: rendered.html, plainText: rendered.plainText,
        tableOfContents: rendered.tableOfContents, status: input.status,
        visibility: input.visibility, authorId: user.id,
        scheduledAt: input.scheduledAt, publishedAt,
      });
      await tx.insert(postAuthors).values({ postId: id, userId: user.id, bylineOrder: 0 });
      await tx.insert(revisions).values({ id: revisionId, postId: id, authorId: user.id, title: input.title, document, renderedHtml: rendered.html, changeNote: "Initial version" });
    });
  } catch (error) {
    if (error instanceof Error && /duplicate/i.test(error.message)) return apiError("That post URL is already in use", 409);
    throw error;
  }

  return Response.json({ data: { id, slug, status: input.status, updatedAt: new Date().toISOString() } }, { status: 201 });
}
