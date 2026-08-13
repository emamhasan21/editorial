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
  if (!existingPost) {
    const id = nanoid();
    await db.transaction(async (tx) => {
      await tx.insert(schema.posts).values({ id, slug: postSlug, title: "Welcome to Editorial", excerpt: "The first database-backed story in your self-hosted publication.", document, renderedHtml: rendered.html, plainText: rendered.plainText, tableOfContents: rendered.tableOfContents, status: "published", visibility: "public", authorId: owner.id, publishedAt: new Date() });
      await tx.insert(schema.postAuthors).values({ postId: id, userId: owner.id, bylineOrder: 0 });
      await tx.insert(schema.revisions).values({ id: nanoid(), postId: id, authorId: owner.id, title: "Welcome to Editorial", document, renderedHtml: rendered.html, changeNote: "Seeded first version" });
    });
  } else {
    await db.update(schema.posts).set({ document, renderedHtml: rendered.html, plainText: rendered.plainText, tableOfContents: rendered.tableOfContents }).where(eq(schema.posts.id, existingPost.id));
  }

  await db.insert(schema.settings).values({ key: "publication", value: { name: "Editorial", description: "Own your words. Publish beautifully.", locale: "en" } }).onDuplicateKeyUpdate({ set: { value: { name: "Editorial", description: "Own your words. Publish beautifully.", locale: "en" } } });

  console.log(`Seed complete. Owner: ${email}`);
  console.log(`Development password: ${password}`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
