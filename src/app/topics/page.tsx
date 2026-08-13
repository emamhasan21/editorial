import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DocsShell } from "@/components/docs-shell";
import { Reveal, WordReveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = { title: "বিষয়" };

const topics = [
  { name: "সাহিত্য", slug: "literature", count: "১৮", description: "গল্প, কবিতা, স্মৃতিকথা এবং ভাষার নতুন সম্ভাবনা।", color: "#c8ff4d" },
  { name: "নকশা", slug: "design", count: "১২", description: "পাঠের পর্দা, হরফ, গতি এবং দৃশ্যমান ব্যবস্থা।", color: "#a8b7ff" },
  { name: "প্রকাশনা", slug: "publishing", count: "৯", description: "স্বাধীন মাধ্যম, মালিকানা, সরঞ্জাম এবং কাজের প্রবাহ।", color: "#ff9fc7" },
  { name: "প্রযুক্তি", slug: "technology", count: "৭", description: "নির্ভার একটি পণ্যের পেছনের ব্যবহারিক প্রকৌশল।", color: "#ffd66b" },
];

export default function TopicsPage() {
  return (
    <DocsShell toc={[{ title: "সব বিষয়", href: "#browse" }, { title: "সংগ্রহ সম্পর্কে", href: "#about" }]}>
      <Reveal><p className="eyebrow text-brand">সংগ্রহ</p></Reveal>
      <WordReveal className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">একটি ভাবনার পথ ধরুন।</WordReveal>
      <Reveal delay={0.18}><p className="mt-6 max-w-2xl leading-8 text-muted-foreground">প্রকাশনার পুনরাবৃত্ত প্রশ্নগুলো ঘুরে দেখুন। প্রতিটি বিষয়ে আছে প্রবন্ধ, কাজের নোট এবং ব্যবহারিক নির্দেশিকা।</p></Reveal>
      <section id="browse" className="mt-10 grid gap-px border bg-border sm:grid-cols-2">
        {topics.map((topic, index) => (
          <Reveal key={topic.name} delay={index * 0.06} className="bg-background">
            <Link href={`/blog?topic=${topic.slug}`} className="group block min-h-56 bg-background p-6 transition-colors hover:bg-muted/60">
              <div className="flex items-start justify-between">
                <span className="size-3 rounded-full" style={{ backgroundColor: topic.color }} />
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
              <h2 className="mt-12 text-2xl font-semibold">{topic.name}</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{topic.description}</p>
              <p className="mt-5 text-xs text-muted-foreground">{topic.count}টি লেখা</p>
            </Link>
          </Reveal>
        ))}
      </section>
      <section id="about" className="reading-copy"><h2>পরস্পর যুক্ত কাজের ভুবন</h2><p>বিষয়গুলো নিছক ফোল্ডার নয়, এগুলো সম্পাদকীয় সংগ্রহ। একটি লেখা একাধিক বিষয়ে থাকতে পারে—ফলে মূল ঠিকানা অক্ষুণ্ণ রেখেই পাঠক আর্কাইভে নতুন নতুন পথ খুঁজে পান।</p></section>
      <SiteFooter />
    </DocsShell>
  );
}
