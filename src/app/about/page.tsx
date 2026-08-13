import type { Metadata } from "next";
import { DocsShell } from "@/components/docs-shell";
import { Reveal, WordReveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = { title: "আমাদের কথা" };

export default function AboutPage() {
  return (
    <DocsShell toc={[{ title: "সম্পাদকীয়", href: "#overview" }, { title: "আমাদের নীতি", href: "#principles" }, { title: "আগামীর পথ", href: "#start" }]}>
      <Reveal><p className="eyebrow text-brand">আমাদের কথা</p></Reveal>
      <WordReveal className="mt-4 text-4xl font-semibold leading-[1.15] tracking-[-0.045em] sm:text-6xl">মনোযোগী বাংলা লেখার নিরিবিলি ঘর।</WordReveal>
      <div id="overview" className="reading-copy mt-10">
        <p>সম্পাদকীয় ছোট কিন্তু মনোযোগী একটি দলের জন্য সম্পূর্ণ স্বনির্ভর প্রকাশনা অ্যাপ। এতে দৃশ্যমান ব্লক সম্পাদক এবং দ্রুত, যত্নে নকশা করা পাঠের সাইট একই সঙ্গে থাকে।</p>
        <h2 id="principles">দীর্ঘস্থায়ী সিদ্ধান্তে তৈরি</h2>
        <p>কনটেন্ট থাকে গুছানো ডেটা হিসেবে। ছবি, ডেটাবেস, খোঁজ, সেশন এবং প্রকাশিত লেখা থাকে আপনার নিজের সার্ভারে। কোনো তৃতীয় পক্ষের ব্যাকএন্ড অপরিহার্য নয়।</p>
        <h2 id="start">ধীরে ও সুন্দরভাবে বড় হওয়ার জন্য</h2>
        <p>প্রথম সংস্করণটি অল্প ক্ষমতার ভিপিএসেই চলে। পরে পাঠক বাড়লে ছবি, কাজের সারি এবং ক্যাশ আলাদা করে বড় করা যাবে—পুরো অ্যাপ নতুন করে না লিখেই।</p>
      </div>
      <SiteFooter />
    </DocsShell>
  );
}
