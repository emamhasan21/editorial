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
    await auth.api.signUpEmail({ body: { name: "সম্পাদকীয় মালিক", email, password } });
    [owner] = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
  }
  if (!owner) throw new Error("Could not create the seed owner account");
  await db.update(schema.users).set({ role: "owner", username: "editorial-owner", bio: "প্রতিষ্ঠাতা ও সম্পাদক।" }).where(eq(schema.users.id, owner.id));

  const categoryValues = [
    { id: "cat_writing", name: "সাহিত্য", slug: "literature", description: "গল্প, ভাষা এবং ভাবনার আকার।" },
    { id: "cat_design", name: "নকশা", slug: "design", description: "হরফ, পর্দা এবং দৃশ্যমান ব্যবস্থা।" },
    { id: "cat_publishing", name: "প্রকাশনা", slug: "publishing", description: "মালিকানা, সরঞ্জাম এবং কাজের প্রবাহ।" },
  ];
  for (const category of categoryValues) {
    await db.insert(schema.categories).values(category).onDuplicateKeyUpdate({ set: { name: category.name, description: category.description } });
  }

  const postSlug = "welcome-to-editorial";
  const [existingPost] = await db.select({ id: schema.posts.id }).from(schema.posts).where(eq(schema.posts.slug, postSlug)).limit(1);
  const document = {
    type: "doc",
    content: [
      { type: "paragraph", content: [{ type: "text", text: "এই লেখাটি স্থানীয় MariaDB সিড থেকে এসেছে এবং স্টুডিওতে সম্পাদনার জন্য প্রস্তুত।" }] },
      { type: "heading", attrs: { textAlign: null, level: 2 }, content: [{ type: "text", text: "দীর্ঘস্থায়ী প্রকাশনার ভিত্তি" }] },
      { type: "paragraph", content: [{ type: "text", text: "আপনার লেখা, সেশন, সংস্করণ, মন্তব্য, প্রতিক্রিয়া এবং ছবি থাকে আপনার নিয়ন্ত্রণের অবকাঠামোতেই।" }] },
      { type: "blockquote", content: [{ type: "paragraph", content: [{ type: "text", text: "শব্দ আপনার। অভিজ্ঞতাটিও সুন্দর রাখুন।" }] }] },
    ],
  };
  const rendered = renderDocument(document);
  if (!existingPost) {
    const id = nanoid();
    await db.transaction(async (tx) => {
      await tx.insert(schema.posts).values({ id, slug: postSlug, title: "সম্পাদকীয়তে স্বাগতম", excerpt: "আপনার স্বনির্ভর প্রকাশনার প্রথম ডেটাবেস-ভিত্তিক বাংলা লেখা।", document, renderedHtml: rendered.html, plainText: rendered.plainText, tableOfContents: rendered.tableOfContents, status: "published", visibility: "public", authorId: owner.id, publishedAt: new Date() });
      await tx.insert(schema.postAuthors).values({ postId: id, userId: owner.id, bylineOrder: 0 });
      await tx.insert(schema.revisions).values({ id: nanoid(), postId: id, authorId: owner.id, title: "সম্পাদকীয়তে স্বাগতম", document, renderedHtml: rendered.html, changeNote: "প্রাথমিক সংস্করণ" });
    });
  } else {
    await db.update(schema.posts).set({ title: "সম্পাদকীয়তে স্বাগতম", excerpt: "আপনার স্বনির্ভর প্রকাশনার প্রথম ডেটাবেস-ভিত্তিক বাংলা লেখা।", document, renderedHtml: rendered.html, plainText: rendered.plainText, tableOfContents: rendered.tableOfContents }).where(eq(schema.posts.id, existingPost.id));
  }

  await db.insert(schema.settings).values({ key: "publication", value: { name: "সম্পাদকীয়", description: "শব্দ আপনার। প্রকাশও আপনার।", locale: "bn-BD" } }).onDuplicateKeyUpdate({ set: { value: { name: "সম্পাদকীয়", description: "শব্দ আপনার। প্রকাশও আপনার।", locale: "bn-BD" } } });

  console.log(`Seed complete. Owner: ${email}`);
  console.log(`Development password: ${password}`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
