import { asc, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "@/db";
import { authors } from "@/db/schema";
import { apiError, getRequestUser, requireAuthorManager } from "@/lib/api";
import { slugify } from "@/lib/content-renderer";

export const dynamic = "force-dynamic";

const authorInput = z.object({
  name: z.string().trim().min(1).max(200),
  englishName: z.string().trim().max(200).optional(),
  slug: z.string().trim().max(220).optional(),
  kind: z.enum(["classic", "current", "translator", "editor", "organization", "anonymous"]),
  bio: z.string().trim().max(4000).optional(),
  longBio: z.string().trim().max(40_000).optional(),
  portraitUrl: z.string().trim().url().optional().or(z.literal("")),
  birthDate: z.coerce.date().optional(),
  deathDate: z.coerce.date().optional(),
  penNames: z.array(z.string().trim().max(200)).max(20).default([]),
  literaryPeriod: z.string().trim().max(160).optional(),
  genres: z.array(z.string().trim().max(100)).max(30).default([]),
  publicDomain: z.boolean().default(false),
  copyrightNote: z.string().trim().max(4000).optional(),
  verified: z.boolean().default(false),
  featured: z.boolean().default(false),
  accountId: z.string().trim().max(36).optional(),
});

export async function GET(request: Request) {
  const user = await getRequestUser(request);
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind");
  const rows = await db
    .select()
    .from(authors)
    .where(kind && ["classic", "current", "translator", "editor", "organization", "anonymous"].includes(kind) ? eq(authors.kind, kind as typeof authors.$inferSelect.kind) : undefined)
    .orderBy(desc(authors.featured), asc(authors.name))
    .limit(user ? 500 : 200);
  return Response.json({ data: rows });
}

export async function POST(request: Request) {
  const user = await requireAuthorManager(request);
  if (!user) return apiError("Editor permission required", 403);
  const parsed = authorInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("Invalid author", 422, parsed.error.flatten());
  const input = parsed.data;
  const id = nanoid();
  const slug = slugify(input.slug || input.name) || id;
  try {
    await db.insert(authors).values({
      id,
      accountId: input.accountId,
      slug,
      name: input.name,
      englishName: input.englishName,
      kind: input.kind,
      bio: input.bio,
      longBio: input.longBio,
      portraitUrl: input.portraitUrl || null,
      birthDate: input.birthDate,
      deathDate: input.deathDate,
      penNames: input.penNames,
      literaryPeriod: input.literaryPeriod,
      genres: input.genres,
      publicDomain: input.publicDomain,
      copyrightNote: input.copyrightNote,
      verified: input.verified,
      featured: input.featured,
    });
  } catch (error) {
    if (error instanceof Error && /duplicate/i.test(error.message)) return apiError("That author name, URL, or account is already in use", 409);
    throw error;
  }
  return Response.json({ data: { id, slug } }, { status: 201 });
}
