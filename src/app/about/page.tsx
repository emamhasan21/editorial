import type { Metadata } from "next";
import { DocsShell } from "@/components/docs-shell";
import { Reveal, WordReveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <DocsShell>
      <Reveal><p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">About</p></Reveal>
      <WordReveal className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">A quiet home for ambitious writing.</WordReveal>
      <div className="reading-copy mt-8">
        <p>Editorial is a fully self-hosted publishing application for a small, serious team. It combines a visual block editor with a fast, carefully designed public site.</p>
        <h2 id="principles">Built around durable choices</h2>
        <p>Content is stored as structured data. Media stays on your own server. The database, search index, sessions, and published HTML remain under your control. There is no third-party backend dependency.</p>
        <h2 id="start">Designed to grow deliberately</h2>
        <p>The first deployment fits a modest VPS, while the boundaries around media, jobs, and caching make it possible to scale those pieces later without rewriting the application.</p>
      </div>
      <SiteFooter />
    </DocsShell>
  );
}
