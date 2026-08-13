import type { Metadata } from "next";
import Link from "next/link";
import { SeriesForm } from "@/components/studio/library-forms";
import { getAuthors, getSeriesList } from "@/data/library";

export const metadata: Metadata = { title: "Series · Studio" };
export const dynamic = "force-dynamic";

export default async function SeriesStudioPage() {
  const [authors, items] = await Promise.all([getAuthors(), getSeriesList({ includePrivate: true })]);
  return <div className="mx-auto max-w-6xl"><header><p className="font-mono text-xs uppercase tracking-widest text-brand">Library control</p><h1 className="mt-2 text-3xl font-semibold">Series</h1><p className="mt-2 text-sm text-muted-foreground">Ordered collections with their own status, credits, identity, and volume layout.</p></header><div className="mt-8 grid gap-7 xl:grid-cols-[minmax(0,1fr)_380px]"><section className="border bg-background"><div className="border-b p-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">{items.length} series</div>{items.map((item) => <Link key={item.id} href={`/series/${item.slug}`} className="flex items-center justify-between gap-4 border-b p-4 hover:bg-muted/50"><div><h2 className="font-medium">{item.title}</h2><p className="mt-1 text-xs text-muted-foreground">{item.subtitle || "No subtitle"}</p></div><span className="text-xs uppercase text-muted-foreground">{item.status} · {item.visibility}</span></Link>)}</section><SeriesForm authors={authors.map(({ id, name, kind }) => ({ id, name, kind }))} /></div></div>;
}
