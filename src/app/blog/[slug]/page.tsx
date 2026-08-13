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
  const date = article?.date ?? (databasePost!.publishedAt ?? databasePost!.updatedAt).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });
  const minutes = article?.minutes ?? `${Math.max(1, Math.round(databasePost!.html.replace(/<[^>]+>/g, "").split(/\s+/).length / 180)).toLocaleString("bn-BD")} মিনিটের পাঠ`;
  const author = databasePost?.author ?? "সম্পাদকীয় দল";
  const toc = databasePost?.tableOfContents.length
    ? [...databasePost.tableOfContents.map((entry) => ({ title: entry.text, href: `#${entry.id}` })), { title: "আলাপ", href: "#comments" }]
    : [
        { title: "নিজের প্রযুক্তি", href: "#owning" },
        { title: "ব্লকে লেখা", href: "#blocks" },
        { title: "পাঠক সবার আগে", href: "#reader" },
        { title: "আলাপ", href: "#comments" },
      ];

  return (
    <DocsShell toc={toc}>
      <article>
        <header className="pb-8 pt-2">
          <Reveal><p className="eyebrow text-brand">{article?.category ?? "স্টুডিও থেকে"}</p></Reveal>
          <WordReveal className="mt-5 text-4xl font-semibold leading-[1.18] tracking-[-0.045em] sm:text-6xl">{title}</WordReveal>
          <Reveal delay={0.22}>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-muted-foreground">{excerpt}</p>
            <div className="mt-7 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="grid size-10 place-items-center rounded-full bg-foreground font-semibold text-background">স</span>
              <div><p className="font-medium text-foreground">{author}</p><p>{date} · {minutes}</p></div>
            </div>
          </Reveal>
        </header>

        <div className="relative mb-12 aspect-[16/8] overflow-hidden border" style={{ backgroundColor: article?.accent ?? "#c8ff4d" }}>
          <div className="article-grain absolute inset-0 opacity-35" />
          <div className="absolute inset-0 grid place-items-center"><span className="eyebrow text-black/60">স্বাধীন বাংলা প্রকাশনা</span></div>
        </div>

        {databasePost ? (
          <div className="reading-copy" dangerouslySetInnerHTML={{ __html: databasePost.html }} />
        ) : (
          <div className="reading-copy">
            <p>ওয়েবে প্রকাশনা সাধারণত সহজভাবে শুরু হয়, পরে অজান্তেই জটিল হয়ে ওঠে। একজন লেখক শুধু একটি ভাবনার জন্য জায়গা চান; কিছুদিন পর তাঁর কাজ ছড়িয়ে থাকে সম্পাদক, ছবির সেবা, পরিসংখ্যানের পর্দা এবং অনমনীয় থিমের মধ্যে।</p>
            <h2 id="owning">নিজের প্রকাশনা প্রযুক্তির মালিকানা</h2>
            <p>স্বনির্ভর একটি ব্যবস্থা আধুনিক হয়েও নিজের কেন্দ্রটি অন্যের হাতে তুলে দেয় না। কনটেন্ট, পরিচয়, ছবি, সংস্করণ এবং খোঁজ—সব একসঙ্গে থাকে। প্রকাশিত পাতা সার্ভারে তৈরি হয়, অথচ পাতার মধ্যে চলাচল হয় অ্যাপের মতো মসৃণ।</p>
            <blockquote>মালিকানা শুধু সার্ভারের প্রশ্ন নয়। লেখাটির উপযোগী পাঠের অভিজ্ঞতা গড়ার স্বাধীনতাও এর অংশ।</blockquote>
            <h2 id="blocks">বাক্সবন্দী না হয়েও ব্লকে লেখা</h2>
            <p>ব্লক সম্পাদক তখনই কাজে লাগে, যখন লেখার সময় তার কাঠামো অদৃশ্য থাকে। অনুচ্ছেদকে অনুচ্ছেদের মতোই লাগা উচিত। লেখক স্ল্যাশ লিখলে, লেখা নির্বাচন করলে বা একটি অংশ সরাতে চাইলে তখনই উদ্ধৃতি, ছবি, টেবিল, বিভাজন এবং পুনর্ব্যবহারযোগ্য বিন্যাস সামনে আসে।</p>
            <p>সংরক্ষিত লেখা থাকে পরিচ্ছন্ন ও বহনযোগ্য JSON হিসেবে। প্রকাশের সময় সেটি নিরাপদ HTML ও সূচিতে রূপ নেয়; প্রতিটি সংস্করণ আগের সিদ্ধান্তগুলো মনে রাখে।</p>
            <h2 id="reader">পাঠক সবার আগে</h2>
            <p>গতি ধারাবাহিকতা তৈরি করবে, মনোযোগ চাইবে না। শব্দ একবার উন্মোচিত হবে, পাতা পূর্ণ রিলোড ছাড়াই বদলাবে এবং পটভূমি নিঃশব্দে নড়বে—দীর্ঘ লেখাটি থাকবে সম্পূর্ণ স্থির।</p>
          </div>
        )}

        <ReactionBar />
        <Comments />
        <SiteFooter />
      </article>
    </DocsShell>
  );
}
