import type { Metadata } from "next";
import Link from "next/link";
import { DocsShell } from "@/components/docs-shell";
import { Reveal, WordReveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { getSeriesList } from "@/data/library";

export const metadata: Metadata = { title: "Series", description: "Browse ongoing and completed literary series." };
export const dynamic = "force-dynamic";
export default async function SeriesPage() { const items = await getSeriesList(); return <DocsShell toc={[{ title: "All series", href: "#all" }]}><header className="pb-10"><Reveal><p className="font-mono text-xs uppercase tracking-[.2em] text-brand">Serial reading</p></Reveal><WordReveal className="mt-3 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">Stories that unfold in volumes.</WordReveal><p className="mt-5 max-w-2xl leading-7 text-muted-foreground">Follow an ordered collection, see its progress, and move from one volume to the next.</p></header><section id="all" className="grid gap-5 sm:grid-cols-2">{items.map((item, index) => <Link key={item.id} href={`/series/${item.slug}`} className="group border bg-background p-5 shadow-[var(--shadow)] transition-transform hover:-translate-y-1"><div className="aspect-[16/8] border" style={{ background: item.accentColor || ["#d9ffb8", "#c9dcff", "#ffd5e5"][index % 3] }} /><p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{item.status} · {item.language}</p><h2 className="mt-2 text-xl font-semibold group-hover:underline">{item.title}</h2><p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{item.description || item.subtitle || "Series description in preparation."}</p></Link>)}</section><SiteFooter /></DocsShell>; }
