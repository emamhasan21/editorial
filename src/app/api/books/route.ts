import { asc, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "@/db";
import { books, contributions, works } from "@/db/schema";
import { apiError, getRequestUser, requireContentUser } from "@/lib/api";
import { slugify } from "@/lib/content-renderer";
import { canPublishContent } from "@/lib/permissions";

export const dynamic = "force-dynamic";

const credit = z.object({
  authorId: z.string().min(1).max(24),
  role: z.enum(["author", "co_author", "translator", "editor", "compiler", "illustrator", "introduction", "researcher", "photographer", "narrator", "rights_holder"]).default("author"),
  customByline: z.string().trim().max(200).optional(),
});

const bookInput = z.object({
  title: z.string().trim().min(1).max(300),
  originalTitle: z.string().trim().max(300).optional(),
  subtitle: z.string().trim().max(500).optional(),
  slug: z.string().trim().max(220).optional(),
  description: z.string().trim().max(5000).optional(),
  workType: z.enum(["novel", "novella", "story", "poem", "essay", "collection", "research", "other"]).default("novel"),
  workId: z.string().trim().max(24).optional(),
  seriesId: z.string().trim().max(24).optional(),
  editionLabel: z.string().trim().max(160).optional(),
  isbn: z.string().trim().max(40).optional(),
  language: z.string().trim().max(32).default("bn"),
  volumeOrder: z.coerce.number().int().min(0).max(10_000).default(0),
  coverUrl: z.string().trim().url().optional().or(z.literal("")),
  status: z.enum(["planned", "ongoing", "completed", "paused", "cancelled"]).default("planned"),
  visibility: z.enum(["public", "unlisted", "private"]).default("private"),
  publicDomain: z.boolean().default(false),
  copyrightNotice: z.string().trim().max(4000).optional(),
  contributors: z.array(credit).max(30).default([]),
});

export async function GET(request: Request) {
  const user = await getRequestUser(request);
  const includePrivate = new URL(request.url).searchParams.get("scope") === "studio" && Boolean(user);
  const rows = await db.select().from(books).where(includePrivate ? undefined : eq(books.visibility, "public")).orderBy(desc(books.publishedAt), asc(books.title)).limit(200);
  return Response.json({ data: rows });
}

export async function POST(request: Request) {
  const user = await requireContentUser(request);
  if (!user) return apiError("Writer permission required", 403);
  const parsed = bookInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("Invalid book", 422, parsed.error.flatten());
  const input = parsed.data;
  if (input.visibility === "public" && !canPublishContent(user.role)) return apiError("An editor must publish this book", 403);
  const id = nanoid();
  const workId = input.workId || nanoid();
  const slug = slugify(input.slug || input.title) || id;
  try {
    await db.transaction(async (tx) => {
      if (!input.workId) {
        await tx.insert(works).values({
          id: workId,
          slug: `${slug}-work`,
          title: input.title,
          originalTitle: input.originalTitle,
          type: input.workType,
          description: input.description,
          originalLanguage: input.language,
          publicDomain: input.publicDomain,
          copyrightNotice: input.copyrightNotice,
          createdById: user.id,
        });
      }
      await tx.insert(books).values({
        id,
        workId,
        seriesId: input.seriesId || null,
        slug,
        title: input.title,
        subtitle: input.subtitle,
        description: input.description,
        editionLabel: input.editionLabel,
        isbn: input.isbn,
        language: input.language,
        volumeOrder: input.volumeOrder,
        coverUrl: input.coverUrl || null,
        status: input.status,
        visibility: input.visibility,
        copyrightNotice: input.copyrightNotice,
        createdById: user.id,
        publishedAt: input.visibility === "public" ? new Date() : null,
      });
      if (input.contributors.length) {
        const values = input.contributors.flatMap((item, displayOrder) => [
          { id: nanoid(), entityType: "book" as const, entityId: id, authorId: item.authorId, role: item.role, displayOrder, customByline: item.customByline },
          { id: nanoid(), entityType: "work" as const, entityId: workId, authorId: item.authorId, role: item.role, displayOrder, customByline: item.customByline },
        ]);
        await tx.insert(contributions).values(values);
      }
    });
  } catch (error) {
    if (error instanceof Error && /duplicate/i.test(error.message)) return apiError("That book URL is already in use", 409);
    throw error;
  }
  return Response.json({ data: { id, slug, workId } }, { status: 201 });
}
