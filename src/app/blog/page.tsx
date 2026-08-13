import type { Metadata } from "next";
import { ArticleCard } from "@/components/article-card";
import { DocsShell } from "@/components/docs-shell";
import { Reveal, WordReveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { articles } from "@/lib/content";
import { getPublishedPosts } from "@/data/posts";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays on writing, design, and independent publishing.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const databasePosts = await getPublishedPosts();
  const databaseCards = databasePosts.map((post, index) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: (post.publishedAt ?? post.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    minutes: `${Math.max(1, Math.round(post.html.replace(/<[^>]+>/g, "").split(/\s+/).length / 220))} min read`,
    category: "From the studio",
    accent: ["#d9ffb8", "#c9dcff", "#ffd5e5"][index % 3],
  }));
  const cards = [...databaseCards, ...articles.filter((article) => !databaseCards.some((post) => post.slug === article.slug))];
  return (
    <DocsShell toc={[
      { title: "All writing", href: "#all" },
      { title: "Newsletter", href: "#newsletter" },
    ]}>
      <section className="pb-10 pt-4">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">Journal</p>
        </Reveal>
        <WordReveal className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
          Ideas for thoughtful publishing.
        </WordReveal>
        <Reveal delay={0.2}>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            Field notes about writing tools, durable content, reader experience, and the small details that make independent publications memorable.
          </p>
        </Reveal>
      </section>

      <section id="all" className="mt-4">
        {cards.map((article, index) => (
          <ArticleCard key={article.slug} article={article} index={index} />
        ))}
      </section>

      <Reveal id="newsletter" className="mt-10 border bg-muted/50 p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-brand">Occasional notes</p>
        <h2 className="mt-2 text-xl font-semibold">One useful idea, when it is ready.</h2>
        <form className="mt-5 flex max-w-md gap-2">
          <label className="sr-only" htmlFor="newsletter-email">Email address</label>
          <input id="newsletter-email" type="email" placeholder="you@example.com" className="min-w-0 flex-1 border bg-background px-3 text-sm outline-none focus:border-brand" />
          <button type="submit" className="h-10 bg-foreground px-4 text-sm font-medium text-background">Subscribe</button>
        </form>
      </Reveal>
      <SiteFooter />
    </DocsShell>
  );
}
