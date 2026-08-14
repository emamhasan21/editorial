import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Comments } from "@/components/comments";
import { DocsShell } from "@/components/docs-shell";
import { ReactionBar } from "@/components/reaction-bar";
import { Reveal, WordReveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { articles } from "@/lib/content";
import { getPublishedPostBySlug } from "@/data/posts";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  const databasePost = article ? null : await getPublishedPostBySlug(slug);
  return article ? { title: article.title, description: article.excerpt } : databasePost ? { title: databasePost.title, description: databasePost.excerpt } : {};
}

export default async function ArticlePage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  const databasePost = article ? null : await getPublishedPostBySlug(slug);
  if (!article && !databasePost) notFound();
  const title = article?.title ?? databasePost!.title;
  const excerpt = article?.excerpt ?? databasePost!.excerpt;
  const date = article?.date ?? (databasePost!.publishedAt ?? databasePost!.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const minutes = article?.minutes ?? `${Math.max(1, Math.round(databasePost!.html.replace(/<[^>]+>/g, "").split(/\s+/).length / 220))} min read`;
  const author = databasePost?.author ?? "হ য ব র ল সম্পাদকমণ্ডলী";
  const toc = databasePost?.tableOfContents.length
    ? [...databasePost.tableOfContents.map((entry) => ({ title: entry.text, href: `#${entry.id}` })), { title: "Conversation", href: "#comments" }]
    : [
        { title: "Owning the stack", href: "#owning" },
        { title: "Writing in blocks", href: "#blocks" },
        { title: "The reader stays first", href: "#reader" },
        { title: "Conversation", href: "#comments" },
      ];

  return (
    <DocsShell toc={toc}>
      <article>
        <header className="pb-8 pt-2">
          <Reveal><p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">{article?.category ?? "From the studio"}</p></Reveal>
          <WordReveal className="mt-4 text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-5xl">{title}</WordReveal>
          <Reveal delay={0.22}>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{excerpt}</p>
            <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="grid size-9 place-items-center bg-foreground font-semibold text-background">E</span>
              <div><p className="font-medium text-foreground">{author}</p><p>{date} · {minutes}</p></div>
            </div>
          </Reveal>
        </header>

        <div className="relative mb-10 aspect-[16/8] overflow-hidden border" style={{ backgroundColor: article?.accent ?? "#d9ffb8" }}>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.08)_1px,transparent_1px),linear-gradient(rgba(0,0,0,.08)_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="absolute inset-0 grid place-items-center"><span className="font-mono text-xs uppercase tracking-[0.35em] text-black/55">Independent publishing</span></div>
        </div>

        {databasePost ? (
          <div className="reading-copy" dangerouslySetInnerHTML={{ __html: databasePost.html }} />
        ) : (
        <div className="reading-copy">
          <p>Publishing on the web often begins simply and becomes complicated by accident. A writer wants a place for an idea; soon the work is scattered between a visual editor, a media service, an analytics dashboard, and a theme that fights every deliberate typographic choice.</p>
          <h2 id="owning">Owning the whole publishing stack</h2>
          <p>A self-hosted system can stay modern without outsourcing its centre. Content, identity, media, revisions, and search live together. The public application can render on the server, then move between pages like a client-side app.</p>
          <blockquote>Ownership is not only about infrastructure. It is the freedom to make the reading experience match the work.</blockquote>
          <h2 id="blocks">Writing in blocks without feeling boxed in</h2>
          <p>A block editor is useful when its structure disappears during writing. A paragraph should feel like a paragraph. The moment a writer types a slash, drags a handle, or selects a sentence, richer tools can arrive: callouts, galleries, tables, footnotes, code, section breaks, and reusable patterns.</p>
          <p>The saved document remains semantic, portable JSON. Publishing turns that document into sanitized HTML and a table of contents, while revisions preserve the decisions made along the way.</p>
          <h2 id="reader">The reader stays first</h2>
          <p>Motion should establish continuity, not ask for attention. Words reveal once, routes flow without a full refresh, and the background reacts gently while leaving long-form text completely still. Reduced-motion preferences are respected throughout.</p>
        </div>
        )}

        <ReactionBar />
        <Comments />
        <SiteFooter />
      </article>
    </DocsShell>
  );
}
