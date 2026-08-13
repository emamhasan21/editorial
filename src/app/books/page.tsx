import type { Metadata } from "next";
import Link from "next/link";
import { DocsShell } from "@/components/docs-shell";
import { Reveal, WordReveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { getBooks } from "@/data/library";

export const metadata: Metadata = { title: "Books", description: "Long-form books, novels, collections, and editions." };
export const dynamic = "force-dynamic";
export default async function BooksPage() { const books = await getBooks(); return <DocsShell toc={[{ title: "All books", href: "#all" }]}><header className="pb-10"><Reveal><p className="font-mono text-xs uppercase tracking-[.2em] text-brand">Long-form library</p></Reveal><WordReveal className="mt-3 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">Choose a book. Keep your place.</WordReveal><p className="mt-5 max-w-2xl leading-7 text-muted-foreground">Novels, collections, and research works built chapter by chapter for quick reading on every screen.</p></header><section id="all" className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3">{books.map((book, index) => <Link key={book.id} href={`/books/${book.slug}`} className="group"><div className="relative aspect-[2/3] border bg-foreground p-4 text-background shadow-[var(--shadow)] transition-transform group-hover:-translate-y-1" style={{ background: ["#151515", "#3153a4", "#a53148", "#315f45"][index % 4] }}><span className="font-mono text-[9px] uppercase tracking-widest opacity-70">{book.seriesTitle || "Standalone"}</span><h2 className="mt-8 text-lg font-semibold leading-tight sm:text-xl">{book.title}</h2><span className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-widest opacity-70">{book.status}</span></div><p className="mt-3 font-medium group-hover:underline">{book.title}</p>{book.subtitle && <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{book.subtitle}</p>}</Link>)}</section><SiteFooter /></DocsShell>; }
