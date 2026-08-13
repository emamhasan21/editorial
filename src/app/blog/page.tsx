import type { Metadata } from "next";
import { ArticleCard } from "@/components/article-card";
import { DocsShell } from "@/components/docs-shell";
import { Reveal, WordReveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { articles } from "@/lib/content";
import { getPublishedPosts } from "@/data/posts";

export const metadata: Metadata = {
  title: "সাম্প্রতিক লেখা",
  description: "সাহিত্য, নকশা, প্রকাশনা ও ভাবনার বাংলা লেখা।",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const databasePosts = await getPublishedPosts();
  const databaseCards = databasePosts.map((post, index) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: (post.publishedAt ?? post.updatedAt).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" }),
    minutes: `${Math.max(1, Math.round(post.html.replace(/<[^>]+>/g, "").split(/\s+/).length / 180)).toLocaleString("bn-BD")} মিনিটের পাঠ`,
    category: "স্টুডিও থেকে",
    accent: ["#c8ff4d", "#a8b7ff", "#ff9fc7"][index % 3],
  }));
  const cards = [...databaseCards, ...articles.filter((article) => !databaseCards.some((post) => post.slug === article.slug))];

  return (
    <DocsShell toc={[{ title: "সব লেখা", href: "#all" }, { title: "চিঠি", href: "#newsletter" }]}>
      <section className="pb-10 pt-4">
        <Reveal><p className="eyebrow text-brand">পাঠের খাতা</p></Reveal>
        <WordReveal className="mt-4 text-4xl font-semibold leading-[1.12] tracking-[-0.045em] sm:text-6xl">
          ধীরে পড়ার মতো কিছু লেখা।
        </WordReveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
            সাহিত্য, ভাষা, নকশা এবং স্বাধীন প্রকাশনা নিয়ে প্রবন্ধ, গল্প ও কাজের নোট।
          </p>
        </Reveal>
      </section>

      <section id="all" className="mt-4">
        {cards.map((article, index) => <ArticleCard key={article.slug} article={article} index={index} />)}
      </section>

      <Reveal id="newsletter" className="mt-12 border bg-muted/50 p-6 sm:p-8">
        <p className="eyebrow text-brand">মাঝেমধ্যে চিঠি</p>
        <h2 className="mt-3 text-2xl font-semibold">প্রস্তুত হলেই একটি দরকারি লেখা।</h2>
        <form className="mt-6 flex max-w-md gap-2">
          <label className="sr-only" htmlFor="newsletter-email">ইমেইল ঠিকানা</label>
          <input id="newsletter-email" type="email" placeholder="আপনার ইমেইল" className="min-w-0 flex-1 border bg-background px-3 text-sm outline-none focus:border-brand" />
          <button type="submit" className="h-10 bg-foreground px-4 text-sm font-medium text-background">যুক্ত হোন</button>
        </form>
      </Reveal>
      <SiteFooter />
    </DocsShell>
  );
}
