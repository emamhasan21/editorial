import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { posts, users } from "@/db/schema";
import { getContributors, type ContributorDTO } from "@/data/library";

export type PublishedPostDTO = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  kicker: string | null;
  releaseType: typeof posts.$inferSelect.releaseType;
  excerpt: string;
  html: string;
  tableOfContents: { id: string; text: string; level: number }[];
  author: string;
  publishedAt: Date | null;
  updatedAt: Date;
  contributors: ContributorDTO[];
};

export async function getPublishedPosts(): Promise<PublishedPostDTO[]> {
  try {
    const result = await db
      .select({ id: posts.id, slug: posts.slug, title: posts.title, subtitle: posts.subtitle, kicker: posts.kicker, releaseType: posts.releaseType, excerpt: posts.excerpt, html: posts.renderedHtml, tableOfContents: posts.tableOfContents, author: users.name, publishedAt: posts.publishedAt, updatedAt: posts.updatedAt })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.status, "published"))
      .orderBy(desc(posts.publishedAt));
    return await Promise.all(result.map(async (post) => ({ ...post, excerpt: post.excerpt ?? "", tableOfContents: asToc(post.tableOfContents), contributors: await getContributors("release", post.id) })));
  } catch {
    return [];
  }
}

export async function getPublishedPostBySlug(slug: string): Promise<PublishedPostDTO | null> {
  try {
    const [post] = await db
      .select({ id: posts.id, slug: posts.slug, title: posts.title, subtitle: posts.subtitle, kicker: posts.kicker, releaseType: posts.releaseType, excerpt: posts.excerpt, html: posts.renderedHtml, tableOfContents: posts.tableOfContents, author: users.name, publishedAt: posts.publishedAt, updatedAt: posts.updatedAt })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.slug, slug))
      .limit(1);
    return post ? { ...post, excerpt: post.excerpt ?? "", tableOfContents: asToc(post.tableOfContents), contributors: await getContributors("release", post.id) } : null;
  } catch {
    return null;
  }
}

function asToc(value: unknown): PublishedPostDTO["tableOfContents"] {
  let normalized = value;
  if (typeof value === "string") {
    try { normalized = JSON.parse(value); } catch { normalized = []; }
  }
  return Array.isArray(normalized)
    ? normalized.filter((entry): entry is PublishedPostDTO["tableOfContents"][number] => Boolean(entry && typeof entry === "object" && "id" in entry && "text" in entry && "level" in entry))
    : [];
}
