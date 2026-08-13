import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DocsShell } from "@/components/docs-shell";
import { Reveal, WordReveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = { title: "Topics" };

const topics = [
  { name: "Writing", count: 18, description: "Craft, voice, editing, and the shape of an idea.", color: "#d9ffb8" },
  { name: "Design", count: 12, description: "Reading interfaces, typography, motion, and systems.", color: "#c9dcff" },
  { name: "Publishing", count: 9, description: "Independent media, tools, ownership, and workflow.", color: "#ffd5e5" },
  { name: "Technology", count: 7, description: "The practical engineering behind a calm product.", color: "#ffe7aa" },
];

export default function TopicsPage() {
  return (
    <DocsShell toc={[{ title: "Browse topics", href: "#browse" }, { title: "About the journal", href: "#about" }]}>
      <Reveal><p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">Library</p></Reveal>
      <WordReveal className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Follow an idea.</WordReveal>
      <Reveal delay={0.18}><p className="mt-5 max-w-2xl leading-7 text-muted-foreground">Explore the recurring questions behind the publication. Each topic gathers essays, field notes, and practical guides.</p></Reveal>
      <section id="browse" className="mt-10 grid gap-px border bg-border sm:grid-cols-2">
        {topics.map((topic, index) => (
          <Reveal key={topic.name} delay={index * 0.06} className="bg-background">
            <Link href={`/blog?topic=${topic.name.toLowerCase()}`} className="group block min-h-52 bg-background p-6 transition-colors hover:bg-muted/60">
              <div className="flex items-start justify-between">
                <span className="size-3" style={{ backgroundColor: topic.color }} />
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
              <h2 className="mt-10 text-xl font-semibold">{topic.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{topic.description}</p>
              <p className="mt-5 font-mono text-xs text-muted-foreground">{topic.count} stories</p>
            </Link>
          </Reveal>
        ))}
      </section>
      <section id="about" className="reading-copy"><h2>A connected body of work</h2><p>Topics are editorial collections rather than filing cabinets. A story can belong to several, giving readers many paths through the archive while preserving a clear canonical URL.</p></section>
      <SiteFooter />
    </DocsShell>
  );
}
