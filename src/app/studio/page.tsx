import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock3, Eye, FilePenLine, Plus, TrendingUp } from "lucide-react";
import { articles } from "@/lib/content";

export const metadata: Metadata = { title: "স্টুডিও" };

const metrics = [
  { label: "প্রকাশিত", value: "২৪", change: "এই মাসে +৩", icon: FilePenLine },
  { label: "পাঠক", value: "১৮.৪ হাজার", change: "+১২.৬%", icon: Eye },
  { label: "পাঠের সময়", value: "৭মি ৪২সে", change: "+৩৪ সেকেন্ড", icon: Clock3 },
];

export default function StudioPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow text-brand">ড্যাশবোর্ড</p><h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em]">শুভ সন্ধ্যা, লেখক।</h1><p className="mt-2 text-sm text-muted-foreground">আপনার প্রকাশনায় আজ যা ঘটছে।</p></div>
        <Link href="/studio/new" className="inline-flex h-10 items-center gap-2 bg-foreground px-4 text-sm font-medium text-background"><Plus className="size-4" /> নতুন লেখা</Link>
      </div>

      <div className="mt-8 grid gap-px border bg-border sm:grid-cols-3">
        {metrics.map((metric) => <div key={metric.label} className="bg-background p-5"><div className="flex items-center justify-between text-muted-foreground"><span className="text-sm">{metric.label}</span><metric.icon className="size-4" /></div><p className="mt-5 text-2xl font-semibold tracking-tight">{metric.value}</p><p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><TrendingUp className="size-3 text-emerald-500" />{metric.change}</p></div>)}
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between"><div><h2 className="font-semibold">সাম্প্রতিক লেখা</h2><p className="mt-1 text-sm text-muted-foreground">আপনার দলের খসড়া ও প্রকাশিত কাজ।</p></div><Link href="/studio/posts" className="text-sm text-muted-foreground hover:text-foreground">সব দেখুন</Link></div>
        <div className="mt-4 border">
          {articles.map((article, index) => <div key={article.slug} className="flex flex-wrap items-center gap-4 border-b p-4 last:border-b-0"><span className="grid size-10 place-items-center border font-mono text-xs text-black" style={{ background: article.accent }}>{(index + 1).toLocaleString("bn-BD", { minimumIntegerDigits: 2 })}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{article.title}</p><p className="mt-1 text-xs text-muted-foreground">{index === 2 ? "খসড়া · ২৮ মিনিট আগে সম্পাদিত" : `প্রকাশিত · ${article.date}`}</p></div><span className={`px-2 py-1 text-xs ${index === 2 ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"}`}>{index === 2 ? "খসড়া" : "প্রকাশিত"}</span><Link href={index === 2 ? "/studio/new" : `/blog/${article.slug}`} aria-label={`${article.title} খুলুন`}><ArrowRight className="size-4 text-muted-foreground" /></Link></div>)}
        </div>
      </section>
    </div>
  );
}
