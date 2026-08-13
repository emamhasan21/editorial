import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { posts, users } from "@/db/schema";

export type PublishedPostDTO = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  html: string;
  tableOfContents: { id: string; text: string; level: number }[];
  author: string;
  publishedAt: Date | null;
  updatedAt: Date;
};

export async function getPublishedPosts(): Promise<PublishedPostDTO[]> {
  try {
    const result = await db
      .select({ id: posts.id, slug: posts.slug, title: posts.title, excerpt: posts.excerpt, html: posts.renderedHtml, tableOfContents: posts.tableOfContents, author: users.name, publishedAt: posts.publishedAt, updatedAt: posts.updatedAt })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.status, "published"))
      .orderBy(desc(posts.publishedAt));
    return result.map((post) => ({ ...post, excerpt: post.excerpt ?? "", tableOfContents: asToc(post.tableOfContents) }));
  } catch {
    return [];
  }
}

export async function getPublishedPostBySlug(slug: string): Promise<PublishedPostDTO | null> {
  try {
    const [post] = await db
      .select({ id: posts.id, slug: posts.slug, title: posts.title, excerpt: posts.excerpt, html: posts.renderedHtml, tableOfContents: posts.tableOfContents, author: users.name, publishedAt: posts.publishedAt, updatedAt: posts.updatedAt })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.slug, slug))
      .limit(1);
    return post ? { ...post, excerpt: post.excerpt ?? "", tableOfContents: asToc(post.tableOfContents) } : null;
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
