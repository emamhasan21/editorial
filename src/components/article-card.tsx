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
      <Link href={`/blog/${article.slug}`} className="group grid gap-5 border-t py-8 sm:grid-cols-[132px_1fr_auto] sm:items-start">
        <div className="relative aspect-[4/3] overflow-hidden border" style={{ backgroundColor: article.accent }}>
          <span className="absolute inset-x-0 top-1/2 h-px -rotate-12 bg-black/20" />
          <span className="absolute -bottom-3 -right-2 font-mono text-7xl font-bold tracking-tighter text-black/16 transition-transform duration-700 group-hover:-translate-x-2 group-hover:-translate-y-2">
            {(index + 1).toLocaleString("bn-BD", { minimumIntegerDigits: 2 })}
          </span>
        </div>
        <div>
          <span className="eyebrow text-brand">{article.category}</span>
          <h2 className="mt-3 text-2xl font-semibold leading-[1.35] tracking-[-0.025em] transition-colors group-hover:text-brand sm:text-3xl">
            {article.title}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{article.excerpt}</p>
          <p className="mt-5 text-xs text-muted-foreground">{article.date} · {article.minutes}</p>
        </div>
        <ArrowUpRight className="hidden size-5 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand sm:block" />
      </Link>
    </Reveal>
  );
}
