import type { Metadata } from "next";
import { ChapterEditor } from "@/components/editor/chapter-editor";
import { getAuthors, getBooks } from "@/data/library";

export const metadata: Metadata = { title: "New chapter" };
export const dynamic = "force-dynamic";

export default async function NewChapterPage() {
  const [books, authors] = await Promise.all([getBooks({ includePrivate: true }), getAuthors()]);
  return <ChapterEditor books={books.map(({ id, title }) => ({ id, title }))} authors={authors.map(({ id, name }) => ({ id, name }))} />;
}
