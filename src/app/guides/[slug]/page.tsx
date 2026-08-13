import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, Slash } from "lucide-react";
import { DocsShell } from "@/components/docs-shell";
import { Reveal, WordReveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";

const guides = {
  writing: { title: "Writing guide", description: "From first line to a polished, scheduled post." },
  blocks: { title: "Block library", description: "Every piece of content available in the visual editor." },
  media: { title: "Media", description: "Upload, optimize, caption, crop, and reuse visual assets." },
  revisions: { title: "Revisions", description: "Compare drafts, restore decisions, and publish with confidence." },
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
    <DocsShell toc={[{ title: "Overview", href: "#overview" }, { title: "How it works", href: "#works" }, { title: "Good to know", href: "#notes" }]}>
      <Reveal><p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">Publishing guide</p></Reveal>
      <WordReveal className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">{guide.title}</WordReveal>
      <Reveal delay={0.18}><p className="mt-5 text-lg leading-8 text-muted-foreground">{guide.description}</p></Reveal>
      <div className="reading-copy mt-10">
        <h2 id="overview">Overview</h2>
        <p>The studio keeps controls close to the content. Most actions are available from the selection toolbar, the block handle, or the command menu.</p>
        <div className="my-8 border bg-muted/50 p-5 not-prose">
          <div className="flex gap-3"><span className="grid size-8 shrink-0 place-items-center bg-foreground text-background"><Slash className="size-4" /></span><div><p className="mt-0 font-medium text-foreground">Try the command menu</p><p className="mb-0 mt-1 text-sm leading-6 text-muted-foreground">Type <code>/</code> on an empty line to browse headings, media, layout blocks, embeds, and patterns.</p></div></div>
        </div>
        <h2 id="works">How it works</h2>
        <p>Each block has a predictable JSON shape and a semantic HTML renderer. That means an editor can offer rich visual controls without locking published content into an opaque format.</p>
        <h2 id="notes">Good to know</h2>
        <ul className="my-5 space-y-3 text-base">
          {["Autosave creates lightweight working snapshots.", "Publishing creates a permanent revision.", "Preview links can expire automatically.", "Media receives responsive derivatives on upload."].map((item) => <li key={item} className="flex gap-3"><Check className="mt-1 size-4 shrink-0 text-brand" />{item}</li>)}
        </ul>
      </div>
      <SiteFooter />
    </DocsShell>
  );
}
