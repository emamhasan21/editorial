import { sql } from "drizzle-orm";
import {
  boolean,
  datetime,
  index,
  int,
  json,
  longtext,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  role: mysqlEnum("role", ["owner", "admin", "managing_editor", "editor", "writer", "contributor", "reader"]).notNull().default("reader"),
  username: varchar("username", { length: 80 }).unique(),
  bio: text("bio"),
  createdAt: datetime("createdAt", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updatedAt", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date()),
});

export const authors = mysqlTable("authors", {
  id: varchar("id", { length: 24 }).primaryKey(),
  accountId: varchar("account_id", { length: 36 }).unique().references(() => users.id, { onDelete: "set null" }),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  englishName: varchar("english_name", { length: 200 }),
  kind: mysqlEnum("kind", ["classic", "current", "translator", "editor", "organization", "anonymous"]).notNull().default("current"),
  bio: text("bio"),
  longBio: longtext("long_bio"),
  portraitUrl: text("portrait_url"),
  birthDate: datetime("birth_date", { mode: "date" }),
  deathDate: datetime("death_date", { mode: "date" }),
  penNames: json("pen_names").notNull().default(sql`(JSON_ARRAY())`),
  literaryPeriod: varchar("literary_period", { length: 160 }),
  genres: json("genres").notNull().default(sql`(JSON_ARRAY())`),
  publicDomain: boolean("public_domain").notNull().default(false),
  copyrightNote: text("copyright_note"),
  verified: boolean("verified").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  createdAt: datetime("created_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date()),
}, (table) => [
  index("authors_kind_name_idx").on(table.kind, table.name),
  index("authors_featured_idx").on(table.featured),
]);

export const sessions = mysqlTable("session", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("userId", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: datetime("expiresAt", { mode: "date" }).notNull(),
  ipAddress: varchar("ipAddress", { length: 64 }),
  userAgent: text("userAgent"),
  createdAt: datetime("createdAt", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updatedAt", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date()),
}, (table) => [index("session_user_idx").on(table.userId)]);

export const accounts = mysqlTable("account", {
  id: varchar("id", { length: 36 }).primaryKey(),
  userId: varchar("userId", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  accountId: varchar("accountId", { length: 255 }).notNull(),
  providerId: varchar("providerId", { length: 100 }).notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  accessTokenExpiresAt: datetime("accessTokenExpiresAt", { mode: "date" }),
  refreshTokenExpiresAt: datetime("refreshTokenExpiresAt", { mode: "date" }),
  scope: text("scope"),
  idToken: text("idToken"),
  password: text("password"),
  createdAt: datetime("createdAt", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updatedAt", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date()),
}, (table) => [index("account_user_idx").on(table.userId)]);

export const verifications = mysqlTable("verification", {
  id: varchar("id", { length: 36 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: text("value").notNull(),
  expiresAt: datetime("expiresAt", { mode: "date" }).notNull(),
  createdAt: datetime("createdAt", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updatedAt", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date()),
}, (table) => [index("verification_identifier_idx").on(table.identifier)]);

export const posts = mysqlTable("posts", {
  id: varchar("id", { length: 24 }).primaryKey(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  title: varchar("title", { length: 300 }).notNull(),
  subtitle: varchar("subtitle", { length: 500 }),
  kicker: varchar("kicker", { length: 160 }),
  releaseType: mysqlEnum("release_type", ["story", "poem", "essay", "article", "review", "interview", "note", "announcement"]).notNull().default("article"),
  excerpt: text("excerpt"),
  document: json("document").notNull(),
  renderedHtml: longtext("rendered_html").notNull(),
  plainText: longtext("plain_text").notNull(),
  tableOfContents: json("table_of_contents").notNull(),
  status: mysqlEnum("status", ["draft", "review", "scheduled", "published", "archived"]).notNull().default("draft"),
  visibility: mysqlEnum("visibility", ["public", "unlisted", "private"]).notNull().default("public"),
  authorId: varchar("author_id", { length: 36 }).notNull().references(() => users.id),
  featuredMediaId: varchar("featured_media_id", { length: 24 }),
  publishedAt: datetime("published_at", { mode: "date" }),
  scheduledAt: datetime("scheduled_at", { mode: "date" }),
  createdAt: datetime("created_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date()),
}, (table) => [
  index("posts_status_date_idx").on(table.status, table.publishedAt),
  index("posts_author_idx").on(table.authorId),
  index("posts_release_type_idx").on(table.releaseType, table.publishedAt),
]);

export const works = mysqlTable("works", {
  id: varchar("id", { length: 24 }).primaryKey(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  title: varchar("title", { length: 300 }).notNull(),
  originalTitle: varchar("original_title", { length: 300 }),
  type: mysqlEnum("type", ["novel", "novella", "story", "poem", "essay", "collection", "research", "other"]).notNull().default("novel"),
  description: text("description"),
  originalLanguage: varchar("original_language", { length: 32 }).notNull().default("bn"),
  firstPublishedAt: datetime("first_published_at", { mode: "date" }),
  publicDomain: boolean("public_domain").notNull().default(false),
  copyrightNotice: text("copyright_notice"),
  createdById: varchar("created_by_id", { length: 36 }).notNull().references(() => users.id),
  createdAt: datetime("created_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date()),
});

export const series = mysqlTable("series", {
  id: varchar("id", { length: 24 }).primaryKey(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  title: varchar("title", { length: 300 }).notNull(),
  subtitle: varchar("subtitle", { length: 500 }),
  description: text("description"),
  coverUrl: text("cover_url"),
  bannerUrl: text("banner_url"),
  accentColor: varchar("accent_color", { length: 24 }),
  status: mysqlEnum("status", ["planned", "ongoing", "completed", "paused", "cancelled"]).notNull().default("planned"),
  visibility: mysqlEnum("visibility", ["public", "unlisted", "private"]).notNull().default("public"),
  language: varchar("language", { length: 32 }).notNull().default("bn"),
  contentWarnings: json("content_warnings").notNull().default(sql`(JSON_ARRAY())`),
  createdById: varchar("created_by_id", { length: 36 }).notNull().references(() => users.id),
  publishedAt: datetime("published_at", { mode: "date" }),
  createdAt: datetime("created_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date()),
}, (table) => [index("series_status_date_idx").on(table.status, table.publishedAt)]);

export const books = mysqlTable("books", {
  id: varchar("id", { length: 24 }).primaryKey(),
  workId: varchar("work_id", { length: 24 }).references(() => works.id, { onDelete: "set null" }),
  seriesId: varchar("series_id", { length: 24 }).references(() => series.id, { onDelete: "set null" }),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  title: varchar("title", { length: 300 }).notNull(),
  subtitle: varchar("subtitle", { length: 500 }),
  description: text("description"),
  editionLabel: varchar("edition_label", { length: 160 }),
  isbn: varchar("isbn", { length: 40 }),
  language: varchar("language", { length: 32 }).notNull().default("bn"),
  volumeOrder: int("volume_order").notNull().default(0),
  coverUrl: text("cover_url"),
  status: mysqlEnum("status", ["planned", "ongoing", "completed", "paused", "cancelled"]).notNull().default("planned"),
  visibility: mysqlEnum("visibility", ["public", "unlisted", "private"]).notNull().default("public"),
  copyrightNotice: text("copyright_notice"),
  createdById: varchar("created_by_id", { length: 36 }).notNull().references(() => users.id),
  publishedAt: datetime("published_at", { mode: "date" }),
  createdAt: datetime("created_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date()),
}, (table) => [
  index("books_series_order_idx").on(table.seriesId, table.volumeOrder),
  index("books_status_date_idx").on(table.status, table.publishedAt),
]);

export const chapters = mysqlTable("chapters", {
  id: varchar("id", { length: 24 }).primaryKey(),
  bookId: varchar("book_id", { length: 24 }).notNull().references(() => books.id, { onDelete: "cascade" }),
  slug: varchar("slug", { length: 220 }).notNull(),
  chapterNumber: varchar("chapter_number", { length: 32 }),
  position: int("position").notNull().default(0),
  type: mysqlEnum("type", ["chapter", "prologue", "interlude", "epilogue", "appendix"]).notNull().default("chapter"),
  title: varchar("title", { length: 300 }).notNull(),
  subtitle: varchar("subtitle", { length: 500 }),
  excerpt: text("excerpt"),
  document: json("document").notNull(),
  renderedHtml: longtext("rendered_html").notNull(),
  plainText: longtext("plain_text").notNull(),
  tableOfContents: json("table_of_contents").notNull(),
  wordCount: int("word_count").notNull().default(0),
  status: mysqlEnum("status", ["draft", "review", "scheduled", "published", "archived"]).notNull().default("draft"),
  visibility: mysqlEnum("visibility", ["public", "unlisted", "private"]).notNull().default("public"),
  createdById: varchar("created_by_id", { length: 36 }).notNull().references(() => users.id),
  publishedAt: datetime("published_at", { mode: "date" }),
  scheduledAt: datetime("scheduled_at", { mode: "date" }),
  createdAt: datetime("created_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date()),
}, (table) => [
  unique("chapters_book_slug_unique").on(table.bookId, table.slug),
  unique("chapters_book_position_unique").on(table.bookId, table.position),
  index("chapters_book_status_idx").on(table.bookId, table.status, table.position),
]);

export const contributions = mysqlTable("contributions", {
  id: varchar("id", { length: 24 }).primaryKey(),
  entityType: mysqlEnum("entity_type", ["release", "work", "series", "book", "chapter"]).notNull(),
  entityId: varchar("entity_id", { length: 24 }).notNull(),
  authorId: varchar("author_id", { length: 24 }).notNull().references(() => authors.id, { onDelete: "cascade" }),
  role: mysqlEnum("role", ["author", "co_author", "translator", "editor", "compiler", "illustrator", "introduction", "researcher", "photographer", "narrator", "rights_holder"]).notNull().default("author"),
  displayOrder: int("display_order").notNull().default(0),
  customByline: varchar("custom_byline", { length: 200 }),
  approvalStatus: mysqlEnum("approval_status", ["not_required", "pending", "approved", "changes_requested"]).notNull().default("not_required"),
  createdAt: datetime("created_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  unique("contributions_entity_author_role").on(table.entityType, table.entityId, table.authorId, table.role),
  index("contributions_entity_order_idx").on(table.entityType, table.entityId, table.displayOrder),
  index("contributions_author_idx").on(table.authorId),
]);

export const chapterRevisions = mysqlTable("chapter_revisions", {
  id: varchar("id", { length: 24 }).primaryKey(),
  chapterId: varchar("chapter_id", { length: 24 }).notNull().references(() => chapters.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
  title: varchar("title", { length: 300 }).notNull(),
  document: json("document").notNull(),
  renderedHtml: longtext("rendered_html").notNull(),
  changeNote: varchar("change_note", { length: 300 }),
  createdAt: datetime("created_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("chapter_revisions_chapter_date_idx").on(table.chapterId, table.createdAt)]);

export const readingProgress = mysqlTable("reading_progress", {
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  bookId: varchar("book_id", { length: 24 }).notNull().references(() => books.id, { onDelete: "cascade" }),
  chapterId: varchar("chapter_id", { length: 24 }).references(() => chapters.id, { onDelete: "set null" }),
  locator: varchar("locator", { length: 220 }),
  percent: int("percent").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
  updatedAt: datetime("updated_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date()),
}, (table) => [primaryKey({ columns: [table.userId, table.bookId] })]);

export const postAuthors = mysqlTable("post_authors", {
  postId: varchar("post_id", { length: 24 }).notNull().references(() => posts.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  bylineOrder: int("byline_order").notNull().default(0),
}, (table) => [primaryKey({ columns: [table.postId, table.userId] })]);

export const revisions = mysqlTable("post_revisions", {
  id: varchar("id", { length: 24 }).primaryKey(),
  postId: varchar("post_id", { length: 24 }).notNull().references(() => posts.id, { onDelete: "cascade" }),
  authorId: varchar("author_id", { length: 36 }).notNull().references(() => users.id),
  title: varchar("title", { length: 300 }).notNull(),
  document: json("document").notNull(),
  renderedHtml: longtext("rendered_html").notNull(),
  changeNote: varchar("change_note", { length: 300 }),
  createdAt: datetime("created_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("revisions_post_date_idx").on(table.postId, table.createdAt)]);

export const media = mysqlTable("media", {
  id: varchar("id", { length: 24 }).primaryKey(),
  ownerId: varchar("owner_id", { length: 36 }).notNull().references(() => users.id),
  filename: varchar("filename", { length: 255 }).notNull(),
  storagePath: varchar("storage_path", { length: 500 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  size: int("size").notNull(),
  width: int("width"),
  height: int("height"),
  alt: varchar("alt", { length: 500 }),
  caption: text("caption"),
  metadata: json("metadata"),
  createdAt: datetime("created_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const categories = mysqlTable("categories", {
  id: varchar("id", { length: 24 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  description: text("description"),
});

export const tags = mysqlTable("tags", {
  id: varchar("id", { length: 24 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
});

export const postCategories = mysqlTable("post_categories", {
  postId: varchar("post_id", { length: 24 }).notNull().references(() => posts.id, { onDelete: "cascade" }),
  categoryId: varchar("category_id", { length: 24 }).notNull().references(() => categories.id, { onDelete: "cascade" }),
}, (table) => [primaryKey({ columns: [table.postId, table.categoryId] })]);

export const postTags = mysqlTable("post_tags", {
  postId: varchar("post_id", { length: 24 }).notNull().references(() => posts.id, { onDelete: "cascade" }),
  tagId: varchar("tag_id", { length: 24 }).notNull().references(() => tags.id, { onDelete: "cascade" }),
}, (table) => [primaryKey({ columns: [table.postId, table.tagId] })]);

export const comments = mysqlTable("comments", {
  id: varchar("id", { length: 24 }).primaryKey(),
  postId: varchar("post_id", { length: 24 }).notNull().references(() => posts.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 36 }).references(() => users.id, { onDelete: "set null" }),
  parentId: varchar("parent_id", { length: 24 }),
  guestName: varchar("guest_name", { length: 120 }),
  guestEmail: varchar("guest_email", { length: 320 }),
  body: text("body").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "spam", "deleted"]).notNull().default("pending"),
  likes: int("likes").notNull().default(0),
  createdAt: datetime("created_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date()),
}, (table) => [index("comments_post_status_idx").on(table.postId, table.status)]);

export const reactions = mysqlTable("reactions", {
  id: varchar("id", { length: 24 }).primaryKey(),
  postId: varchar("post_id", { length: 24 }).notNull().references(() => posts.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  kind: mysqlEnum("kind", ["clap", "like"]).notNull().default("clap"),
  amount: int("amount").notNull().default(1),
  createdAt: datetime("created_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [unique("reactions_user_post_kind").on(table.postId, table.userId, table.kind)]);

export const bookmarks = mysqlTable("bookmarks", {
  postId: varchar("post_id", { length: 24 }).notNull().references(() => posts.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: datetime("created_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [primaryKey({ columns: [table.postId, table.userId] })]);

export const patterns = mysqlTable("patterns", {
  id: varchar("id", { length: 24 }).primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  description: text("description"),
  document: json("document").notNull(),
  ownerId: varchar("owner_id", { length: 36 }).notNull().references(() => users.id),
  isShared: boolean("is_shared").notNull().default(false),
  createdAt: datetime("created_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("updated_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date()),
});

export const settings = mysqlTable("settings", {
  key: varchar("key", { length: 120 }).primaryKey(),
  value: json("value").notNull(),
  updatedAt: datetime("updated_at", { mode: "date" }).notNull().default(sql`CURRENT_TIMESTAMP`).$onUpdate(() => new Date()),
});
