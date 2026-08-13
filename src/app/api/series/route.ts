import { asc, desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";
import { db } from "@/db";
import { contributions, series } from "@/db/schema";
import { apiError, getRequestUser, requireContentUser } from "@/lib/api";
import { slugify } from "@/lib/content-renderer";
import { canPublishContent } from "@/lib/permissions";

export const dynamic = "force-dynamic";

const credit = z.object({
  authorId: z.string().min(1).max(24),
  role: z.enum(["author", "co_author", "translator", "editor", "compiler", "illustrator", "introduction", "researcher", "photographer", "narrator", "rights_holder"]).default("author"),
  customByline: z.string().trim().max(200).optional(),
});

const seriesInput = z.object({
  title: z.string().trim().min(1).max(300),
  subtitle: z.string().trim().max(500).optional(),
  slug: z.string().trim().max(220).optional(),
  description: z.string().trim().max(5000).optional(),
  coverUrl: z.string().trim().url().optional().or(z.literal("")),
  bannerUrl: z.string().trim().url().optional().or(z.literal("")),
  accentColor: z.string().trim().max(24).optional(),
  status: z.enum(["planned", "ongoing", "completed", "paused", "cancelled"]).default("planned"),
  visibility: z.enum(["public", "unlisted", "private"]).default("private"),
  language: z.string().trim().max(32).default("bn"),
  contentWarnings: z.array(z.string().trim().max(120)).max(30).default([]),
  contributors: z.array(credit).max(30).default([]),
});

export async function GET(request: Request) {
  const user = await getRequestUser(request);
  const includePrivate = new URL(request.url).searchParams.get("scope") === "studio" && Boolean(user);
  const rows = await db.select().from(series).where(includePrivate ? undefined : eq(series.visibility, "public")).orderBy(desc(series.publishedAt), asc(series.title)).limit(200);
  return Response.json({ data: rows });
}

export async function POST(request: Request) {
  const user = await requireContentUser(request);
  if (!user) return apiError("Writer permission required", 403);
  const parsed = seriesInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return apiError("Invalid series", 422, parsed.error.flatten());
  const input = parsed.data;
  if (input.visibility === "public" && !canPublishContent(user.role)) return apiError("An editor must publish this series", 403);
  const id = nanoid();
  const slug = slugify(input.slug || input.title) || id;
  try {
    await db.transaction(async (tx) => {
      await tx.insert(series).values({
        id,
        slug,
        title: input.title,
        subtitle: input.subtitle,
        description: input.description,
        coverUrl: input.coverUrl || null,
        bannerUrl: input.bannerUrl || null,
        accentColor: input.accentColor,
        status: input.status,
        visibility: input.visibility,
        language: input.language,
        contentWarnings: input.contentWarnings,
        createdById: user.id,
        publishedAt: input.visibility === "public" ? new Date() : null,
      });
      if (input.contributors.length) {
        await tx.insert(contributions).values(input.contributors.map((item, displayOrder) => ({
          id: nanoid(), entityType: "series" as const, entityId: id, authorId: item.authorId,
          role: item.role, displayOrder, customByline: item.customByline,
        })));
      }
    });
  } catch (error) {
    if (error instanceof Error && /duplicate/i.test(error.message)) return apiError("That series URL is already in use", 409);
    throw error;
  }
  return Response.json({ data: { id, slug } }, { status: 201 });
}
