import type { JSONContent } from "@tiptap/core";
import { and, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "@/db";
import { posts, revisions } from "@/db/schema";
import { apiError, getRequestUser } from "@/lib/api";
import { renderDocument, slugify } from "@/lib/content-renderer";

const updateInput = z.object({
  title: z.string().trim().min(1).max(300).optional(),
  slug: z.string().trim().max(220).optional(),
  excerpt: z.string().trim().max(1000).nullable().optional(),
  document: z.object({ type: z.literal("doc"), content: z.array(z.unknown()).optional() }).optional(),
  status: z.enum(["draft", "review", "scheduled", "published", "archived"]).optional(),
  visibility: z.enum(["public", "unlisted", "private"]).optional(),
  changeNote: z.string().trim().max(300).optional(),
});

export async function GET(request: Request, context: RouteContext<"/api/posts/[id]">) {
  const { id } = await context.params;
  const user = await getRequestUser(request);
  const [post] = await db.select().from(posts).where(user ? eq(posts.id, id) : and(eq(posts.id, id), eq(posts.status, "published"), eq(posts.visibility, "public"))).limit(1);
  if (!post) return apiError("Post not found", 404);
  return Response.json({ data: post });
}

export async function PATCH(request: Request, context: RouteContext<"/api/posts/[id]">) {
  const user = await getRequestUser(request);
  if (!user) return apiError("Authentication required", 401);
  const { id } = await context.params;
  const [existing] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  if (!existing) return apiError("Post not found", 404);
  const parsed = updateInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("Invalid update", 422, parsed.error.flatten());

  const input = parsed.data;
  const document = (input.document ?? existing.document) as JSONContent;
  const rendered = renderDocument(document);
  const title = input.title ?? existing.title;
  const status = input.status ?? existing.status;
  const now = new Date();
  await db.transaction(async (tx) => {
    await tx.update(posts).set({
      title, slug: input.slug ? slugify(input.slug) : existing.slug,
      excerpt: input.excerpt === undefined ? existing.excerpt : input.excerpt,
      document, renderedHtml: rendered.html, plainText: rendered.plainText,
      tableOfContents: rendered.tableOfContents, status,
      visibility: input.visibility ?? existing.visibility,
      publishedAt: status === "published" && !existing.publishedAt ? now : existing.publishedAt,
      updatedAt: now,
    }).where(eq(posts.id, id));
    await tx.insert(revisions).values({ id: nanoid(), postId: id, authorId: user.id, title, document, renderedHtml: rendered.html, changeNote: input.changeNote ?? "Updated in studio" });
  });
  return Response.json({ data: { id, status, updatedAt: now.toISOString() } });
}
