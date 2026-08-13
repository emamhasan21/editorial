import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

async function seed() {
  const [{ eq }, { nanoid }, { db }, schema, { auth }, { renderDocument }] = await Promise.all([
    import("drizzle-orm"),
    import("nanoid"),
    import("../src/db/index"),
    import("../src/db/schema"),
    import("../src/lib/auth"),
    import("../src/lib/content-renderer"),
  ]);

  const email = process.env.SEED_OWNER_EMAIL ?? "owner@editorial.local";
  const password = process.env.SEED_OWNER_PASSWORD ?? "ChangeMe-Editorial-2026";
  let [owner] = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);

  if (!owner) {
    await auth.api.signUpEmail({ body: { name: "Editorial Owner", email, password } });
    [owner] = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
  }
  if (!owner) throw new Error("Could not create the seed owner account");
  await db.update(schema.users).set({ role: "owner", username: "editorial-owner", bio: "Founder and editor." }).where(eq(schema.users.id, owner.id));

  const ownerAuthorId = "author_owner";
  await db.insert(schema.authors).values({
    id: ownerAuthorId, accountId: owner.id, slug: "editorial-owner", name: "সম্পাদকীয় লেখক",
    englishName: "Editorial Writer", kind: "current", bio: "এই প্রকাশনার প্রতিষ্ঠাতা ও সম্পাদক।",
    genres: ["প্রবন্ধ", "গল্প"], verified: true, featured: true,
  }).onDuplicateKeyUpdate({ set: { accountId: owner.id, verified: true } });

  await db.insert(schema.authors).values({
    id: "author_rokeya", slug: "begum-rokeya", name: "বেগম রোকেয়া", englishName: "Begum Rokeya",
    kind: "classic", bio: "বাংলার সমাজসংস্কার, শিক্ষা ও সাহিত্যের ইতিহাসে এক অগ্রণী কণ্ঠ।",
    literaryPeriod: "ঊনবিংশ–বিংশ শতাব্দী", genres: ["প্রবন্ধ", "উপন্যাস", "ব্যঙ্গ"],
    copyrightNote: "Any archival text should be rights-checked for the publication territory before release.", featured: true,
  }).onDuplicateKeyUpdate({ set: { featured: true } });

  const categoryValues = [
    { id: "cat_writing", name: "Writing", slug: "writing", description: "Craft, voice, and the shape of ideas." },
    { id: "cat_design", name: "Design", slug: "design", description: "Typography, interfaces, and systems." },
    { id: "cat_publishing", name: "Publishing", slug: "publishing", description: "Ownership, tools, and workflow." },
  ];
  for (const category of categoryValues) {
    await db.insert(schema.categories).values(category).onDuplicateKeyUpdate({ set: { name: category.name, description: category.description } });
  }

  const postSlug = "welcome-to-editorial";
  const [existingPost] = await db.select({ id: schema.posts.id }).from(schema.posts).where(eq(schema.posts.slug, postSlug)).limit(1);
  const document = {
    type: "doc",
    content: [
      { type: "paragraph", content: [{ type: "text", text: "This post came from the local MariaDB seed and is ready to edit from the studio." }] },
      { type: "heading", attrs: { textAlign: null, level: 2 }, content: [{ type: "text", text: "A durable publishing foundation" }] },
      { type: "paragraph", content: [{ type: "text", text: "Your content, sessions, revisions, comments, reactions, and media stay on infrastructure you control." }] },
      { type: "blockquote", content: [{ type: "paragraph", content: [{ type: "text", text: "Own the words. Keep the experience beautiful." }] }] },
    ],
  };
  const rendered = renderDocument(document);
  let releaseId = existingPost?.id;
  if (!existingPost) {
    const id = nanoid(); releaseId = id;
    await db.transaction(async (tx) => {
      await tx.insert(schema.posts).values({ id, slug: postSlug, title: "Welcome to Editorial", subtitle: "A small release with a durable structure", kicker: "From the studio", releaseType: "note", excerpt: "The first database-backed story in your self-hosted publication.", document, renderedHtml: rendered.html, plainText: rendered.plainText, tableOfContents: rendered.tableOfContents, status: "published", visibility: "public", authorId: owner.id, publishedAt: new Date() });
      await tx.insert(schema.postAuthors).values({ postId: id, userId: owner.id, bylineOrder: 0 });
      await tx.insert(schema.revisions).values({ id: nanoid(), postId: id, authorId: owner.id, title: "Welcome to Editorial", document, renderedHtml: rendered.html, changeNote: "Seeded first version" });
    });
  } else {
    await db.update(schema.posts).set({ subtitle: "A small release with a durable structure", kicker: "From the studio", releaseType: "note", document, renderedHtml: rendered.html, plainText: rendered.plainText, tableOfContents: rendered.tableOfContents }).where(eq(schema.posts.id, existingPost.id));
  }

  if (releaseId) await db.insert(schema.contributions).values({ id: "credit_release_owner", entityType: "release", entityId: releaseId, authorId: ownerAuthorId, role: "author", displayOrder: 0 }).onDuplicateKeyUpdate({ set: { displayOrder: 0 } });

  const seriesId = "series_pother_khata";
  await db.insert(schema.series).values({ id: seriesId, slug: "pother-khata", title: "পথের খাতা", subtitle: "নদী, শহর ও মানুষের গল্প", description: "একটি নমুনা ধারাবাহিক—যেখানে প্রতিটি বই ও অধ্যায় আলাদাভাবে প্রকাশ ও সম্পাদনা করা যায়।", accentColor: "#d9ffb8", status: "ongoing", visibility: "public", language: "bn", contentWarnings: [], createdById: owner.id, publishedAt: new Date() }).onDuplicateKeyUpdate({ set: { status: "ongoing", visibility: "public" } });

  const workId = "work_nodir_opare";
  await db.insert(schema.works).values({ id: workId, slug: "nodir-opare-work", title: "নদীর ওপারে", type: "novel", description: "একটি কাল্পনিক বাংলা উপন্যাসের নমুনা।", originalLanguage: "bn", createdById: owner.id }).onDuplicateKeyUpdate({ set: { title: "নদীর ওপারে" } });
  const bookId = "book_nodir_opare";
  await db.insert(schema.books).values({ id: bookId, workId, seriesId, slug: "nodir-opare", title: "নদীর ওপারে", subtitle: "পথের খাতা · প্রথম খণ্ড", description: "একটি ছোট্ট যাত্রা, যা দেখায় দীর্ঘ বই কীভাবে অধ্যায় ধরে দ্রুত ও নির্ভরযোগ্যভাবে প্রকাশ করা যায়।", language: "bn", volumeOrder: 1, status: "ongoing", visibility: "public", createdById: owner.id, publishedAt: new Date() }).onDuplicateKeyUpdate({ set: { status: "ongoing", visibility: "public" } });

  const chapterDocument = { type: "doc", content: [
    { type: "paragraph", content: [{ type: "text", text: "সন্ধ্যার আগে নদীর ঘাটে এসে নীলা দেখল, শেষ নৌকাটি এখনও বাঁধা আছে।" }] },
    { type: "verse", content: [{ type: "text", text: "জলের ভিতর আলো নড়ে\nপথের ভিতর পথ।" }] },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "যাত্রার শুরু" }] },
    { type: "paragraph", content: [{ type: "text", text: "ওপারের গ্রামটি মানচিত্রে ছোট, কিন্তু তার গল্পের পরিধি ছিল অনেক বড়।" }] },
    { type: "authorNote", content: [{ type: "text", text: "এটি সম্পাদক ও পাঠককে নতুন সাহিত্যিক ব্লকগুলোর নমুনা দেখানোর জন্য লেখা কাল্পনিক পাঠ্য।" }] },
  ] };
  const chapterRendered = renderDocument(chapterDocument);
  const chapterId = "chapter_prothom_jatra";
  await db.insert(schema.chapters).values({ id: chapterId, bookId, slug: "prothom-jatra", chapterNumber: "১", position: 1, type: "chapter", title: "প্রথম যাত্রা", excerpt: "শেষ নৌকার আগে শুরু হওয়া এক যাত্রা।", document: chapterDocument, renderedHtml: chapterRendered.html, plainText: chapterRendered.plainText, tableOfContents: chapterRendered.tableOfContents, wordCount: chapterRendered.plainText.split(/\s+/u).length, status: "published", visibility: "public", createdById: owner.id, publishedAt: new Date() }).onDuplicateKeyUpdate({ set: { document: chapterDocument, renderedHtml: chapterRendered.html, plainText: chapterRendered.plainText, tableOfContents: chapterRendered.tableOfContents } });

  const credits = [
    { id: "credit_series_owner", entityType: "series" as const, entityId: seriesId },
    { id: "credit_work_owner", entityType: "work" as const, entityId: workId },
    { id: "credit_book_owner", entityType: "book" as const, entityId: bookId },
    { id: "credit_chapter_owner", entityType: "chapter" as const, entityId: chapterId },
  ];
  for (const credit of credits) await db.insert(schema.contributions).values({ ...credit, authorId: ownerAuthorId, role: "author", displayOrder: 0 }).onDuplicateKeyUpdate({ set: { displayOrder: 0 } });

  await db.insert(schema.chapterRevisions).values({ id: "revision_chapter_seed", chapterId, userId: owner.id, title: "প্রথম যাত্রা", document: chapterDocument, renderedHtml: chapterRendered.html, changeNote: "Seeded first version" }).onDuplicateKeyUpdate({ set: { renderedHtml: chapterRendered.html } });

  await db.insert(schema.settings).values({ key: "publication", value: { name: "Editorial", description: "Own your words. Publish beautifully.", locale: "bn" } }).onDuplicateKeyUpdate({ set: { value: { name: "Editorial", description: "Own your words. Publish beautifully.", locale: "bn" } } });

  console.log(`Seed complete. Owner: ${email}`);
  console.log(`Development password: ${password}`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
