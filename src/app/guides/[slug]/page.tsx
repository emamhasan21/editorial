import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, Slash } from "lucide-react";
import { DocsShell } from "@/components/docs-shell";
import { Reveal, WordReveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";

const guides = {
  writing: { title: "লেখার নির্দেশিকা", description: "প্রথম বাক্য থেকে পরিশীলিত, প্রকাশযোগ্য লেখা পর্যন্ত।" },
  blocks: { title: "ব্লক সংগ্রহ", description: "দৃশ্যমান সম্পাদকে ব্যবহারযোগ্য প্রতিটি কনটেন্ট উপাদান।" },
  media: { title: "ছবি ও মাধ্যম", description: "আপলোড, ছোট করা, ক্যাপশন দেওয়া এবং ছবি পুনরায় ব্যবহার।" },
  revisions: { title: "সংস্করণ", description: "খসড়া তুলনা, পুরোনো সিদ্ধান্ত ফিরিয়ে আনা এবং নিশ্চিন্তে প্রকাশ।" },
};

export function generateStaticParams() { return Object.keys(guides).map((slug) => ({ slug })); }

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides[slug as keyof typeof guides];
  return guide ? { title: guide.title, description: guide.description } : {};
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const guide = guides[slug as keyof typeof guides];
  if (!guide) notFound();
  return (
    <DocsShell toc={[{ title: "এক নজরে", href: "#overview" }, { title: "যেভাবে কাজ করে", href: "#works" }, { title: "মনে রাখুন", href: "#notes" }]}>
      <Reveal><p className="eyebrow text-brand">প্রকাশনার নির্দেশিকা</p></Reveal>
      <WordReveal className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">{guide.title}</WordReveal>
      <Reveal delay={0.18}><p className="mt-6 text-lg leading-8 text-muted-foreground">{guide.description}</p></Reveal>
      <div className="reading-copy mt-10">
        <h2 id="overview">এক নজরে</h2>
        <p>স্টুডিও কনটেন্টের কাছেই নিয়ন্ত্রণগুলো রাখে। নির্বাচিত লেখার টুলবার, ব্লক মেনু এবং কমান্ড তালিকা থেকেই প্রায় সব কাজ করা যায়।</p>
        <div className="not-prose my-8 border bg-muted/50 p-5 font-sans">
          <div className="flex gap-3"><span className="grid size-8 shrink-0 place-items-center bg-foreground text-background"><Slash className="size-4" /></span><div><p className="mt-0 font-medium text-foreground">কমান্ড মেনু ব্যবহার করুন</p><p className="mb-0 mt-1 text-sm leading-7 text-muted-foreground">খালি লাইনে <code>/</code> লিখে শিরোনাম, ছবি, টেবিল, উদ্ধৃতি ও বিভাজন যোগ করুন।</p></div></div>
        </div>
        <h2 id="works">যেভাবে কাজ করে</h2>
        <p>প্রতিটি ব্লকের একটি পরিচ্ছন্ন JSON গঠন এবং অর্থবহ HTML রেন্ডারার আছে। তাই সমৃদ্ধ দৃশ্যমান নিয়ন্ত্রণ থাকলেও আপনার প্রকাশিত লেখা কোনো অস্বচ্ছ ফরম্যাটে আটকে যায় না।</p>
        <h2 id="notes">মনে রাখুন</h2>
        <ul className="my-5 space-y-3 text-base">
          {["স্বয়ংক্রিয় সংরক্ষণ কাজের হালকা স্ন্যাপশট রাখে।", "প্রকাশ করার সময় স্থায়ী সংস্করণ তৈরি হয়।", "প্রিভিউ ঠিকানার মেয়াদ ঠিক করা যায়।", "আপলোডের সময় ছবির ওয়েব-উপযোগী কপি তৈরি হয়।"].map((item) => <li key={item} className="flex gap-3"><Check className="mt-1 size-4 shrink-0 text-brand" />{item}</li>)}
        </ul>
      </div>
      <SiteFooter />
    </DocsShell>
  );
}
