import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";

type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  minutes: string;
  category: string;
  accent: string;
};

export function ArticleCard({ article, index = 0 }: { article: Article; index?: number }) {
  return (
    <Reveal delay={index * 0.07}>
      <Link
        href={`/blog/${article.slug}`}
        className="group grid gap-5 border-t py-8 sm:grid-cols-[130px_1fr_auto] sm:items-start"
      >
        <div
          className="relative aspect-[4/3] overflow-hidden border"
          style={{ backgroundColor: article.accent }}
        >
          <span className="absolute -bottom-3 -right-2 font-mono text-7xl font-bold tracking-tighter text-black/10 transition-transform duration-500 group-hover:-translate-x-2 group-hover:-translate-y-2">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-brand">{article.category}</span>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] transition-colors group-hover:text-brand sm:text-2xl">
            {article.title}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{article.excerpt}</p>
          <p className="mt-4 text-xs text-muted-foreground">{article.date} · {article.minutes}</p>
        </div>
        <ArrowUpRight className="hidden size-5 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 sm:block" />
      </Link>
    </Reveal>
  );
}
