"use client";

import { useState, useSyncExternalStore } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { BookOpen, LoaderCircle, Save } from "lucide-react";
import { AuthorNote, Footnote, Spoiler, Verse } from "@/lib/literary-extensions";

type BookOption = { id: string; title: string };
type AuthorOption = { id: string; name: string };
const field = "mt-1.5 h-10 w-full border bg-background px-3 text-sm outline-none focus:border-brand";

export function ChapterEditor({ books, authors }: { books: BookOption[]; authors: AuthorOption[] }) {
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  if (!isClient) return <div className="min-h-[70vh] animate-pulse border bg-muted/30" aria-label="Loading chapter editor" />;
  return <ChapterEditorCore books={books} authors={authors} />;
}

function ChapterEditorCore({ books, authors }: { books: BookOption[]; authors: AuthorOption[] }) {
  const [bookId, setBookId] = useState(books[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [chapterNumber, setChapterNumber] = useState("");
  const [position, setPosition] = useState(1);
  const [type, setType] = useState("chapter");
  const [status, setStatus] = useState("draft");
  const [authorId, setAuthorId] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const editor = useEditor({ immediatelyRender: true, extensions: [StarterKit.configure({ heading: { levels: [1, 2, 3] } }), Placeholder.configure({ placeholder: "Begin this chapter…" }), Verse, Footnote, AuthorNote, Spoiler], content: "<p></p>", editorProps: { attributes: { class: "reading-copy min-h-[52vh] focus:outline-none" } } });

  function insert(typeName: "verse" | "footnote" | "authorNote" | "spoiler", text: string) { editor?.chain().focus().insertContent({ type: typeName, content: [{ type: "text", text }] }).run(); }
  async function save() {
    if (!editor || !bookId || !title.trim()) { setMessage("Choose a book and add a chapter title."); return; }
    setSaving(true); setMessage("");
    const response = await fetch(`/api/books/${bookId}/chapters`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, chapterNumber: chapterNumber || undefined, position, type, status, visibility: status === "published" ? "public" : "private", document: editor.getJSON(), contributors: authorId ? [{ authorId, role: "author" }] : [] }) });
    const result = await response.json().catch(() => null); setSaving(false);
    setMessage(response.ok ? `Saved. Reader URL: /books/${result.data.bookSlug}/${result.data.slug}` : result?.error?.message ?? "Could not save the chapter.");
  }

  return <div className="mx-auto max-w-6xl"><header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b pb-5"><div><p className="font-mono text-xs uppercase tracking-widest text-brand">Large-book editor</p><h1 className="mt-2 text-3xl font-semibold">New chapter</h1><p className="mt-2 text-sm text-muted-foreground">A separate document with its own revision and reading URL.</p></div><button onClick={save} disabled={saving} className="inline-flex h-10 items-center gap-2 bg-foreground px-4 text-sm font-medium text-background disabled:opacity-50">{saving ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />} Save chapter</button></header><div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_250px]"><section className="border bg-background shadow-[var(--shadow)]"><div className="flex flex-wrap gap-1 border-b p-2 text-xs"><button onClick={() => insert("verse", "Write a verse here…")} className="border px-2 py-1.5">Verse</button><button onClick={() => insert("footnote", "Add a footnote…")} className="border px-2 py-1.5">Footnote</button><button onClick={() => insert("authorNote", "Add an author note…")} className="border px-2 py-1.5">Author note</button><button onClick={() => insert("spoiler", "Add hidden text…")} className="border px-2 py-1.5">Spoiler</button></div><div className="px-6 py-8 sm:px-12"><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Chapter title" className="mb-8 w-full bg-transparent text-4xl font-semibold tracking-[-0.04em] outline-none" /><EditorContent editor={editor} /></div></section><aside className="space-y-4 border bg-background p-4"><label className="block text-xs font-medium">Book<select value={bookId} onChange={(event) => setBookId(event.target.value)} className={field}><option value="">Choose a book</option>{books.map((book) => <option key={book.id} value={book.id}>{book.title}</option>)}</select></label><div className="grid grid-cols-2 gap-3"><label className="block text-xs font-medium">Number<input value={chapterNumber} onChange={(event) => setChapterNumber(event.target.value)} className={field} /></label><label className="block text-xs font-medium">Position<input type="number" min="0" value={position} onChange={(event) => setPosition(Number(event.target.value))} className={field} /></label></div><label className="block text-xs font-medium">Type<select value={type} onChange={(event) => setType(event.target.value)} className={field}><option value="chapter">Chapter</option><option value="prologue">Prologue</option><option value="interlude">Interlude</option><option value="epilogue">Epilogue</option><option value="appendix">Appendix</option></select></label><label className="block text-xs font-medium">Credit<select value={authorId} onChange={(event) => setAuthorId(event.target.value)} className={field}><option value="">Inherit book credit</option>{authors.map((author) => <option key={author.id} value={author.id}>{author.name}</option>)}</select></label><label className="block text-xs font-medium">Workflow<select value={status} onChange={(event) => setStatus(event.target.value)} className={field}><option value="draft">Draft</option><option value="review">Ready for review</option><option value="published">Publish now</option></select></label><div className="border bg-muted/40 p-3 text-xs leading-5 text-muted-foreground"><BookOpen className="mb-2 size-4 text-brand" />Splitting large books by chapter keeps reads, revisions, and autosaves fast on the 1 GB VPS.</div>{message && <p className="border p-3 text-xs leading-5">{message}</p>}</aside></div></div>;
}

function emptySubscribe() { return () => undefined; }
