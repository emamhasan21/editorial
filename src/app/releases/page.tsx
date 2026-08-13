import type { Metadata } from "next";
import Link from "next/link";
import { ContributorLinks } from "@/components/contributor-links";
import { DocsShell } from "@/components/docs-shell";
import { Reveal, WordReveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { getPublishedPosts } from "@/data/posts";

export const metadata: Metadata = { title: "Releases", description: "Stories, poems, essays, and other standalone publications." };
export const dynamic = "force-dynamic";
export default async function ReleasesPage() { const releases = await getPublishedPosts(); return <DocsShell toc={[{ title: "All releases", href: "#all" }]}><header className="pb-10"><Reveal><p className="font-mono text-xs uppercase tracking-[.2em] text-brand">Plain-text releases</p></Reveal><WordReveal className="mt-3 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">Stories complete in one sitting.</WordReveal><p className="mt-5 max-w-2xl leading-7 text-muted-foreground">Poems, essays, stories, reviews, interviews, and notes outside the chapter structure.</p></header><section id="all">{releases.map((release) => <Link key={release.id} href={`/releases/${release.slug}`} className="group block border-t py-6 last:border-b"><p className="font-mono text-[10px] uppercase tracking-widest text-brand">{release.releaseType}</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.025em] group-hover:underline">{release.title}</h2>{release.subtitle && <p className="mt-2 text-muted-foreground">{release.subtitle}</p>}<p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{release.excerpt}</p><p className="mt-4 text-xs text-muted-foreground"><ContributorLinks contributors={release.contributors} fallback={release.author} /></p></Link>)}</section><SiteFooter /></DocsShell>; }
