import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { authors, books, chapters, contributions, posts, series, works } from "@/db/schema";

export type ContributorDTO = {
  id: string;
  slug: string;
  name: string;
  englishName: string | null;
  portraitUrl: string | null;
  kind: typeof authors.$inferSelect.kind;
  role: typeof contributions.$inferSelect.role;
  customByline: string | null;
  displayOrder: number;
};

export type AuthorDTO = Omit<typeof authors.$inferSelect, "penNames" | "genres"> & {
  penNames: string[];
  genres: string[];
};

function stringArray(value: unknown): string[] {
  let normalized = value;
  if (typeof normalized === "string") {
    try { normalized = JSON.parse(normalized); } catch { return []; }
  }
  return Array.isArray(normalized) ? normalized.filter((item): item is string => typeof item === "string") : [];
}

function authorDTO(author: typeof authors.$inferSelect): AuthorDTO {
  return { ...author, penNames: stringArray(author.penNames), genres: stringArray(author.genres) };
}

export async function getAuthors(options: { kind?: typeof authors.$inferSelect.kind; limit?: number } = {}): Promise<AuthorDTO[]> {
  try {
    const rows = await db
      .select()
      .from(authors)
      .where(options.kind ? eq(authors.kind, options.kind) : undefined)
      .orderBy(desc(authors.featured), asc(authors.name))
      .limit(options.limit ?? 200);
    return rows.map(authorDTO);
  } catch {
    return [];
  }
}

export async function getAuthorBySlug(slug: string) {
  try {
    const [author] = await db.select().from(authors).where(eq(authors.slug, slug)).limit(1);
    if (!author) return null;
    const credits = await db
      .select()
      .from(contributions)
      .where(eq(contributions.authorId, author.id))
      .orderBy(asc(contributions.displayOrder));
    const releaseIds = credits.filter((credit) => credit.entityType === "release").map((credit) => credit.entityId);
    const bookIds = credits.filter((credit) => credit.entityType === "book").map((credit) => credit.entityId);
    const releases = releaseIds.length
      ? await db.select({ id: posts.id, slug: posts.slug, title: posts.title, excerpt: posts.excerpt, type: posts.releaseType, publishedAt: posts.publishedAt }).from(posts).where(and(inArray(posts.id, releaseIds), eq(posts.status, "published")))
      : [];
    const creditedBooks = bookIds.length
      ? await db.select({ id: books.id, slug: books.slug, title: books.title, description: books.description, coverUrl: books.coverUrl, status: books.status }).from(books).where(inArray(books.id, bookIds))
      : [];
    return { author: authorDTO(author), releases, books: creditedBooks };
  } catch {
    return null;
  }
}

export async function getContributors(entityType: typeof contributions.$inferSelect.entityType, entityId: string): Promise<ContributorDTO[]> {
  try {
    return await db
      .select({
        id: authors.id,
        slug: authors.slug,
        name: authors.name,
        englishName: authors.englishName,
        portraitUrl: authors.portraitUrl,
        kind: authors.kind,
        role: contributions.role,
        customByline: contributions.customByline,
        displayOrder: contributions.displayOrder,
      })
      .from(contributions)
      .innerJoin(authors, eq(contributions.authorId, authors.id))
      .where(and(eq(contributions.entityType, entityType), eq(contributions.entityId, entityId)))
      .orderBy(asc(contributions.displayOrder));
  } catch {
    return [];
  }
}

export async function getSeriesList(options: { includePrivate?: boolean; limit?: number } = {}) {
  try {
    return await db
      .select()
      .from(series)
      .where(options.includePrivate ? undefined : eq(series.visibility, "public"))
      .orderBy(desc(series.publishedAt), asc(series.title))
      .limit(options.limit ?? 100);
  } catch {
    return [];
  }
}

export async function getSeriesBySlug(slug: string, includePrivate = false) {
  try {
    const [item] = await db.select().from(series).where(and(eq(series.slug, slug), includePrivate ? undefined : eq(series.visibility, "public"))).limit(1);
    if (!item) return null;
    const [seriesBooks, creditedAuthors] = await Promise.all([
      db.select().from(books).where(and(eq(books.seriesId, item.id), includePrivate ? undefined : eq(books.visibility, "public"))).orderBy(asc(books.volumeOrder), asc(books.title)),
      getContributors("series", item.id),
    ]);
    return { series: item, books: seriesBooks, contributors: creditedAuthors, contentWarnings: stringArray(item.contentWarnings) };
  } catch {
    return null;
  }
}

export async function getBooks(options: { includePrivate?: boolean; limit?: number } = {}) {
  try {
    return await db
      .select({
        id: books.id,
        slug: books.slug,
        title: books.title,
        subtitle: books.subtitle,
        description: books.description,
        coverUrl: books.coverUrl,
        status: books.status,
        language: books.language,
        volumeOrder: books.volumeOrder,
        seriesId: books.seriesId,
        seriesTitle: series.title,
        seriesSlug: series.slug,
        publishedAt: books.publishedAt,
      })
      .from(books)
      .leftJoin(series, eq(books.seriesId, series.id))
      .where(options.includePrivate ? undefined : eq(books.visibility, "public"))
      .orderBy(desc(books.publishedAt), asc(books.title))
      .limit(options.limit ?? 100);
  } catch {
    return [];
  }
}

export async function getBookBySlug(slug: string, includePrivate = false) {
  try {
    const [book] = await db
      .select({
        id: books.id,
        workId: books.workId,
        seriesId: books.seriesId,
        slug: books.slug,
        title: books.title,
        subtitle: books.subtitle,
        description: books.description,
        editionLabel: books.editionLabel,
        isbn: books.isbn,
        language: books.language,
        volumeOrder: books.volumeOrder,
        coverUrl: books.coverUrl,
        status: books.status,
        visibility: books.visibility,
        copyrightNotice: books.copyrightNotice,
        publishedAt: books.publishedAt,
        seriesTitle: series.title,
        seriesSlug: series.slug,
        workTitle: works.title,
        workType: works.type,
        publicDomain: works.publicDomain,
      })
      .from(books)
      .leftJoin(series, eq(books.seriesId, series.id))
      .leftJoin(works, eq(books.workId, works.id))
      .where(and(eq(books.slug, slug), includePrivate ? undefined : eq(books.visibility, "public")))
      .limit(1);
    if (!book) return null;
    const [bookChapters, creditedAuthors] = await Promise.all([
      db
        .select({ id: chapters.id, slug: chapters.slug, chapterNumber: chapters.chapterNumber, position: chapters.position, type: chapters.type, title: chapters.title, subtitle: chapters.subtitle, excerpt: chapters.excerpt, wordCount: chapters.wordCount, status: chapters.status, publishedAt: chapters.publishedAt })
        .from(chapters)
        .where(and(eq(chapters.bookId, book.id), includePrivate ? undefined : eq(chapters.status, "published")))
        .orderBy(asc(chapters.position)),
      getContributors("book", book.id),
    ]);
    return { book, chapters: bookChapters, contributors: creditedAuthors };
  } catch {
    return null;
  }
}

export async function getChapterBySlugs(bookSlug: string, chapterSlug: string, includePrivate = false) {
  const bookData = await getBookBySlug(bookSlug, includePrivate);
  if (!bookData) return null;
  try {
    const [chapter] = await db
      .select()
      .from(chapters)
      .where(and(eq(chapters.bookId, bookData.book.id), eq(chapters.slug, chapterSlug), includePrivate ? undefined : eq(chapters.status, "published")))
      .limit(1);
    if (!chapter) return null;
    const chapterContributors = await getContributors("chapter", chapter.id);
    const currentIndex = bookData.chapters.findIndex((item) => item.id === chapter.id);
    return {
      ...bookData,
      chapter,
      chapterContributors,
      previous: currentIndex > 0 ? bookData.chapters[currentIndex - 1] : null,
      next: currentIndex >= 0 && currentIndex < bookData.chapters.length - 1 ? bookData.chapters[currentIndex + 1] : null,
    };
  } catch {
    return null;
  }
}
