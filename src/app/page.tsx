import Link from "next/link";
import { ArrowDown, ArrowRight, Blocks, Feather, Gauge, GitBranch } from "lucide-react";
import { AnimatedField } from "@/components/animated-field";
import { Reveal, WordReveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";

const principles = [
  {
    icon: Blocks,
    number: "০১",
    title: "লেখা থাকে লেখার মতো",
    text: "অনুচ্ছেদ, শিরোনাম, ছবি, উদ্ধৃতি, টেবিল ও বিভাজন—প্রতিটি ব্লক গুছানো, কিন্তু লেখার সময় অদৃশ্য।",
  },
  {
    icon: Gauge,
    number: "০২",
    title: "পাঠকের কাছে দ্রুত",
    text: "সার্ভার-রেন্ডার করা পাতা, মাপা অ্যানিমেশন ও স্থানীয় ছবি প্রক্রিয়াকরণ; জরুরি পথে কোনো তৃতীয় পক্ষ নেই।",
  },
  {
    icon: GitBranch,
    number: "০৩",
    title: "প্রতিটি বদল সংরক্ষিত",
    text: "খসড়া, স্বয়ংক্রিয় সংরক্ষণ, সংস্করণ, সহলেখক ও প্রকাশনার ইতিহাস—একটি ছোট সম্পাদনা দলের জন্য প্রস্তুত।",
  },
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#090909] text-[#f5f5f2]">
      <section id="overview" className="landing-hero relative isolate flex items-center justify-center px-5 py-24 sm:px-8">
        <AnimatedField />
        <div className="relative z-10 mx-auto max-w-[1240px] text-center">
          <Reveal>
            <p className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-xs text-white/75 backdrop-blur-xl">
              <Feather className="size-3.5 text-[#c8ff4d]" />
              স্বাধীন বাংলা প্রকাশনার নতুন ঘর
            </p>
          </Reveal>
          <WordReveal className="landing-display mx-auto max-w-[1160px] font-semibold">
            আপনার ভাবনা দ্রুত আসে। সম্পাদকীয় তাকে স্থায়ী করে।
          </WordReveal>
          <Reveal delay={0.34}>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
              গভীর লেখা, সুন্দর পাঠ এবং নিজের সার্ভারে সম্পূর্ণ নিয়ন্ত্রণ—বাংলা লেখক,
              সম্পাদক ও পাঠকের জন্য নির্মিত একটি আধুনিক প্রকাশনা।
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/blog" className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-black transition-transform hover:scale-[1.03]">
                পড়া শুরু করুন <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/studio/new" className="inline-flex h-12 items-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/10">
                লেখা শুরু করুন
              </Link>
            </div>
          </Reveal>
        </div>
        <a href="#principles" aria-label="নিচে যান" className="absolute bottom-8 left-1/2 z-10 grid size-10 -translate-x-1/2 place-items-center rounded-full border border-white/15 text-white/60">
          <ArrowDown className="size-4 animate-bounce" />
        </a>
      </section>

      <section id="principles" className="border-y border-white/10 bg-black px-5 py-20 sm:px-8 sm:py-28">
        <div className="site-container grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
          <Reveal>
            <p className="eyebrow text-[#c8ff4d]">কীভাবে কাজ করে</p>
            <h2 className="mt-5 max-w-md text-4xl font-semibold leading-[1.08] tracking-[-.04em] sm:text-5xl">
              প্রযুক্তি পেছনে। শব্দ সামনে।
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-2xl text-lg leading-9 text-white/62">
              সম্পাদনার শক্তিশালী সরঞ্জাম তখনই দেখা দেয়, যখন আপনার দরকার হয়। বাকি সময়
              কেবল সাদা পাতা, মনোযোগ এবং আপনার বাক্য।
            </p>
          </Reveal>
        </div>

        <div className="site-container mt-16 grid border-y border-white/10 md:grid-cols-3 md:divide-x md:divide-white/10">
          {principles.map((principle, index) => (
            <Reveal key={principle.title} delay={index * 0.09} className="h-full">
              <article className="group flex h-full flex-col border-b border-white/10 py-8 md:border-b-0 md:px-8 md:first:pl-0 md:last:pr-0">
                <div className="flex items-center justify-between text-white/45">
                  <principle.icon className="size-5 transition-colors group-hover:text-[#c8ff4d]" />
                  <span className="font-mono text-xs">{principle.number}</span>
                </div>
                <h3 className="mt-16 text-xl font-semibold">{principle.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/55">{principle.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="start" className="bg-[#f1f1ed] px-5 py-20 text-[#10100f] sm:px-8 sm:py-28">
        <div className="site-container">
          <Reveal>
            <p className="eyebrow text-[#537b00]">লেখক থেকে পাঠক</p>
            <h2 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-.045em] sm:text-6xl">
              একটি ভাবনা। যত খুশি ব্লক। প্রকাশে মাত্র একটি মুহূর্ত।
            </h2>
          </Reveal>
          <div className="mt-14 grid border-y border-black/15 lg:grid-cols-[1fr_1.35fr] lg:divide-x lg:divide-black/15">
            <Reveal className="py-10 lg:pr-12">
              <span className="font-mono text-xs text-black/45">সম্পাদক / ২০২৬</span>
              <p className="font-reading mt-8 text-2xl leading-[1.65] text-black/78">
                “ভালো প্রকাশনার নকশা পাঠককে নিজের উপস্থিতি জানান দেয় না; সে শুধু লেখাটিকে আরও স্পষ্ট করে তোলে।”
              </p>
            </Reveal>
            <Reveal delay={0.1} className="border-t border-black/15 py-10 lg:border-t-0 lg:pl-12">
              <p className="max-w-xl text-base leading-8 text-black/62">
                স্ল্যাশ লিখে ব্লক যোগ করুন, নির্বাচিত বাক্য সাজান, ছবি বসান, সহলেখক যুক্ত করুন,
                সংস্করণ ফিরিয়ে আনুন এবং পূর্ণ পাতা রিলোড ছাড়াই প্রকাশ করুন।
              </p>
              <Link href="/guides/blocks" className="group mt-8 inline-flex items-center gap-2 border-b border-black pb-1 text-sm font-semibold">
                ব্লক সম্পাদক দেখুন <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
          <SiteFooter />
        </div>
      </section>
    </main>
  );
}
