import type { Metadata } from "next";
import Link from "next/link";
import { BookForm } from "@/components/studio/library-forms";
import { getAuthors, getBooks, getSeriesList } from "@/data/library";

export const metadata: Metadata = { title: "Books · Studio" };
export const dynamic = "force-dynamic";

export default async function BooksStudioPage() {
  const [authors, series, books] = await Promise.all([getAuthors(), getSeriesList({ includePrivate: true }), getBooks({ includePrivate: true })]);
  return <div className="mx-auto max-w-6xl"><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-widest text-brand">Library control</p><h1 className="mt-2 text-3xl font-semibold">Books</h1><p className="mt-2 text-sm text-muted-foreground">Each book stays light while its chapters remain separately editable and revisioned.</p></div><Link href="/studio/chapters/new" className="bg-foreground px-4 py-2.5 text-sm font-medium text-background">Write a chapter</Link></header><div className="mt-8 grid gap-7 xl:grid-cols-[minmax(0,1fr)_380px]"><section className="border bg-background"><div className="border-b p-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">{books.length} books</div>{books.map((book) => <Link key={book.id} href={`/books/${book.slug}`} className="flex items-center justify-between gap-4 border-b p-4 hover:bg-muted/50"><div><h2 className="font-medium">{book.title}</h2><p className="mt-1 text-xs text-muted-foreground">{book.seriesTitle || "Standalone"}</p></div><span className="text-xs uppercase text-muted-foreground">{book.status}</span></Link>)}</section><BookForm authors={authors.map(({ id, name, kind }) => ({ id, name, kind }))} series={series.map(({ id, title }) => ({ id, title }))} /></div></div>;
}
