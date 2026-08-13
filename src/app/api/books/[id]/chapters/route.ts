import type { JSONContent } from "@tiptap/core";
import { asc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "@/db";
import { books, chapterRevisions, chapters, contributions } from "@/db/schema";
import { apiError, getRequestUser, requireContentUser } from "@/lib/api";
import { renderDocument, slugify } from "@/lib/content-renderer";
import { canPublishContent } from "@/lib/permissions";

export const dynamic = "force-dynamic";

const chapterInput = z.object({
  title: z.string().trim().min(1).max(300),
  subtitle: z.string().trim().max(500).optional(),
  slug: z.string().trim().max(220).optional(),
  chapterNumber: z.string().trim().max(32).optional(),
  position: z.coerce.number().int().min(0).max(100_000),
  type: z.enum(["chapter", "prologue", "interlude", "epilogue", "appendix"]).default("chapter"),
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

export async function GET(request: Request, context: RouteContext<"/api/books/[id]/chapters">) {
  const { id } = await context.params;
  const user = await getRequestUser(request);
  const rows = await db.select().from(chapters).where(eq(chapters.bookId, id)).orderBy(asc(chapters.position));
  return Response.json({ data: user ? rows : rows.filter((chapter) => chapter.status === "published" && chapter.visibility === "public") });
}

export async function POST(request: Request, context: RouteContext<"/api/books/[id]/chapters">) {
  const user = await requireContentUser(request);
  if (!user) return apiError("Writer permission required", 403);
  const { id: bookId } = await context.params;
  const [book] = await db.select({ id: books.id, slug: books.slug }).from(books).where(eq(books.id, bookId)).limit(1);
  if (!book) return apiError("Book not found", 404);
  const parsed = chapterInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("Invalid chapter", 422, parsed.error.flatten());
  const input = parsed.data;
  if (input.status === "published" && !canPublishContent(user.role)) return apiError("An editor must publish this chapter", 403);
  const document = input.document as JSONContent;
  const rendered = renderDocument(document);
  if (rendered.plainText.length > 300_000) return apiError("This chapter is too large; split it into smaller chapters", 413);
  const chapterId = nanoid();
  const slug = slugify(input.slug || input.title) || chapterId;
  const wordCount = rendered.plainText ? rendered.plainText.split(/\s+/u).length : 0;
  try {
    await db.transaction(async (tx) => {
      await tx.insert(chapters).values({
        id: chapterId,
        bookId,
        slug,
        chapterNumber: input.chapterNumber,
        position: input.position,
        type: input.type,
        title: input.title,
        subtitle: input.subtitle,
        excerpt: input.excerpt,
        document,
        renderedHtml: rendered.html,
        plainText: rendered.plainText,
        tableOfContents: rendered.tableOfContents,
        wordCount,
        status: input.status,
        visibility: input.visibility,
        createdById: user.id,
        scheduledAt: input.scheduledAt,
        publishedAt: input.status === "published" ? new Date() : null,
      });
      await tx.insert(chapterRevisions).values({ id: nanoid(), chapterId, userId: user.id, title: input.title, document, renderedHtml: rendered.html, changeNote: "Initial chapter version" });
      if (input.contributors.length) {
        await tx.insert(contributions).values(input.contributors.map((item, displayOrder) => ({
          id: nanoid(), entityType: "chapter" as const, entityId: chapterId, authorId: item.authorId,
          role: item.role, displayOrder, customByline: item.customByline,
        })));
      }
    });
  } catch (error) {
    if (error instanceof Error && /duplicate/i.test(error.message)) return apiError("That chapter URL or position is already in use for this book", 409);
    throw error;
  }
  return Response.json({ data: { id: chapterId, slug, bookSlug: book.slug, status: input.status } }, { status: 201 });
}
