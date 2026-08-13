import Link from "next/link";
import { ArrowRight, Blocks, Feather, Gauge, GitBranch, MoveRight, WandSparkles } from "lucide-react";
import { AnimatedField } from "@/components/animated-field";
import { DocsShell } from "@/components/docs-shell";
import { Reveal, WordReveal } from "@/components/reveal";

const principles = [
  {
    icon: Blocks,
    title: "Structured, not restricted",
    text: "Compose headings, stories, images, callouts, quotes, columns, embeds, and reusable patterns as portable content blocks.",
  },
  {
    icon: Gauge,
    title: "Fast by default",
    text: "Server-rendered pages, careful animation, local media processing, and no third-party backend in the critical path.",
  },
  {
    icon: GitBranch,
    title: "Every change remembered",
    text: "Drafts, autosaves, preview links, revisions, scheduled publishing, and roles for a real multi-writer newsroom.",
  },
];

export default function Home() {
  return (
    <DocsShell>
      <article>
        <section id="overview" className="relative isolate overflow-hidden border bg-card px-6 py-16 sm:px-10 sm:py-20">
          <AnimatedField />
          <div
            aria-hidden
            className="absolute -right-20 -top-32 size-80 bg-[radial-gradient(circle,#9c91ff_0%,rgba(156,145,255,.28)_38%,transparent_70%)] opacity-75 blur-2xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-40 -left-16 size-80 bg-[radial-gradient(circle,#76e7b4_0%,rgba(118,231,180,.22)_35%,transparent_70%)] opacity-70 blur-2xl"
          />
          <div className="relative max-w-2xl">
            <Reveal>
              <div className="mb-5 inline-flex items-center gap-2 border bg-background/70 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
                <WandSparkles className="size-3.5 text-brand" />
                Publishing should feel this calm
              </div>
            </Reveal>
            <WordReveal className="text-4xl font-semibold leading-[1.03] tracking-[-0.05em] sm:text-6xl">
              Your ideas deserve a beautiful place to live.
            </WordReveal>
            <Reveal delay={0.28}>
              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Editorial is a self-hosted Bangla literary platform with the speed of an app,
                the flexibility of a block editor, and a reading experience that stays out
                of the way.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/studio/new"
                  className="group inline-flex h-10 items-center gap-2 bg-foreground px-4 text-sm font-medium text-background"
                >
                  Open the studio
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex h-10 items-center border bg-background/70 px-4 text-sm font-medium backdrop-blur transition-colors hover:bg-muted"
                >
                  Read the journal
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="pt-14" id="principles">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">Core principles</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em]">
              Everything a publication needs.
              <span className="block text-muted-foreground">Nothing it doesn’t.</span>
            </h2>
          </Reveal>

          <div className="mt-8 grid divide-y border md:grid-cols-3 md:divide-x md:divide-y-0">
            {principles.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 0.08} className="h-full">
                <div className="h-full p-6">
                  <principle.icon className="mb-8 size-5 text-brand" />
                  <h3 className="font-semibold">{principle.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{principle.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="reading-copy pt-14" id="start">
          <Reveal>
            <h2>A writer-first workflow</h2>
            <p>
              The editor begins as a blank page, not a dashboard. Type <code>/</code> to add
              a block, drag to rearrange a section, or select text to reveal precise formatting
              controls. Your document remains clean structured JSON underneath.
            </p>
            <blockquote>
              The interface is quiet when you are writing and powerful exactly when you ask it to be.
            </blockquote>
            <h3>Made for more than one voice</h3>
            <p>
              Invite writers and editors, assign ownership, collect revisions, prepare a social
              preview, and publish without leaving the studio. Every public page is rendered for
              speed, accessibility, and excellent typography.
            </p>
          </Reveal>
        </section>

        <Reveal className="mt-14 border bg-muted/50 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="grid size-10 shrink-0 place-items-center bg-brand text-white">
              <Feather className="size-5" />
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold">Ready for the first draft?</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                The local studio includes block formatting, autosave, preview, and revision-ready content.
              </p>
              <Link href="/studio/new" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand">
                Create a post <MoveRight className="size-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </article>
    </DocsShell>
  );
}
