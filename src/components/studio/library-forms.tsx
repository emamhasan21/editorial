"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Check, LoaderCircle, Plus } from "lucide-react";

type AuthorOption = { id: string; name: string; kind: string };
type SeriesOption = { id: string; title: string };

function useSubmit(endpoint: string) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const [message, setMessage] = useState("");
  async function submit(payload: Record<string, unknown>) {
    setState("saving");
    setMessage("");
    const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      setState("idle");
      setMessage(result?.error?.message ?? "Could not save this record.");
      return false;
    }
    setState("saved");
    setMessage("Saved. The new record is ready.");
    router.refresh();
    return true;
  }
  return { state, message, submit };
}

function FormShell({ title, description, state, message, children }: { title: string; description: string; state: "idle" | "saving" | "saved"; message: string; children: React.ReactNode }) {
  return <section className="border bg-background p-5 shadow-[var(--shadow)] sm:p-7">
    <div className="border-b pb-5"><p className="font-mono text-xs uppercase tracking-widest text-brand">Create</p><h2 className="mt-2 text-xl font-semibold">{title}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p></div>
    <div className="mt-5 space-y-4">{children}</div>
    {message && <p className={`mt-4 border p-3 text-sm ${state === "saved" ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900"}`}>{message}</p>}
    <button disabled={state === "saving"} className="mt-5 inline-flex h-10 items-center gap-2 bg-foreground px-4 text-sm font-medium text-background disabled:opacity-50">{state === "saving" ? <LoaderCircle className="size-4 animate-spin" /> : state === "saved" ? <Check className="size-4" /> : <Plus className="size-4" />} Save {title.toLowerCase()}</button>
  </section>;
}

const inputClass = "mt-1.5 h-10 w-full border bg-background px-3 text-sm outline-none focus:border-brand";

export function AuthorForm() {
  const action = useSubmit("/api/authors");
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const ok = await action.submit({
      name: form.get("name"), englishName: form.get("englishName") || undefined,
      kind: form.get("kind"), bio: form.get("bio") || undefined,
      literaryPeriod: form.get("literaryPeriod") || undefined,
      genres: String(form.get("genres") || "").split(",").map((item) => item.trim()).filter(Boolean),
      publicDomain: form.get("publicDomain") === "on", featured: form.get("featured") === "on",
    });
    if (ok) event.currentTarget.reset();
  }
  return <form onSubmit={onSubmit}><FormShell title="Author" description="Create a literary identity. Classic writers do not need an account; current writers can be linked later." state={action.state} message={action.message}>
    <label className="block text-sm font-medium">Display name<input name="name" required className={inputClass} placeholder="রবীন্দ্রনাথ ঠাকুর" /></label>
    <label className="block text-sm font-medium">English name<input name="englishName" className={inputClass} placeholder="Rabindranath Tagore" /></label>
    <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Identity type<select name="kind" className={inputClass}><option value="classic">Classic writer</option><option value="current">Current writer</option><option value="translator">Translator</option><option value="editor">Editor</option><option value="organization">Organization</option><option value="anonymous">Anonymous</option></select></label><label className="block text-sm font-medium">Literary period<input name="literaryPeriod" className={inputClass} placeholder="বাংলা নবজাগরণ" /></label></div>
    <label className="block text-sm font-medium">Short biography<textarea name="bio" rows={4} className="mt-1.5 w-full border bg-background p-3 text-sm outline-none focus:border-brand" /></label>
    <label className="block text-sm font-medium">Genres <span className="font-normal text-muted-foreground">(comma separated)</span><input name="genres" className={inputClass} placeholder="কবিতা, ছোটগল্প, প্রবন্ধ" /></label>
    <div className="flex flex-wrap gap-5 text-sm"><label className="flex items-center gap-2"><input name="publicDomain" type="checkbox" /> Public domain</label><label className="flex items-center gap-2"><input name="featured" type="checkbox" /> Featured</label></div>
  </FormShell></form>;
}

export function SeriesForm({ authors }: { authors: AuthorOption[] }) {
  const action = useSubmit("/api/series");
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const authorId = String(form.get("authorId") || "");
    const ok = await action.submit({ title: form.get("title"), subtitle: form.get("subtitle") || undefined, description: form.get("description") || undefined, status: form.get("status"), visibility: form.get("visibility"), language: "bn", contributors: authorId ? [{ authorId, role: "author" }] : [] });
    if (ok) event.currentTarget.reset();
  }
  return <form onSubmit={onSubmit}><FormShell title="Series" description="Group related volumes under one ordered, independently publishable series page." state={action.state} message={action.message}>
    <label className="block text-sm font-medium">Series title<input name="title" required className={inputClass} /></label>
    <label className="block text-sm font-medium">Subtitle<input name="subtitle" className={inputClass} /></label>
    <label className="block text-sm font-medium">Description<textarea name="description" rows={4} className="mt-1.5 w-full border bg-background p-3 text-sm outline-none" /></label>
    <CreditAndState authors={authors} />
  </FormShell></form>;
}

export function BookForm({ authors, series }: { authors: AuthorOption[]; series: SeriesOption[] }) {
  const action = useSubmit("/api/books");
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); const authorId = String(form.get("authorId") || "");
    const ok = await action.submit({ title: form.get("title"), subtitle: form.get("subtitle") || undefined, description: form.get("description") || undefined, workType: form.get("workType"), seriesId: form.get("seriesId") || undefined, volumeOrder: Number(form.get("volumeOrder") || 0), status: form.get("status"), visibility: form.get("visibility"), language: "bn", publicDomain: form.get("publicDomain") === "on", contributors: authorId ? [{ authorId, role: "author" }] : [] });
    if (ok) event.currentTarget.reset();
  }
  return <form onSubmit={onSubmit}><FormShell title="Book" description="Create a work and an edition, then add chapters as separate documents for dependable large-book performance." state={action.state} message={action.message}>
    <label className="block text-sm font-medium">Book title<input name="title" required className={inputClass} /></label>
    <label className="block text-sm font-medium">Subtitle<input name="subtitle" className={inputClass} /></label>
    <label className="block text-sm font-medium">Description<textarea name="description" rows={4} className="mt-1.5 w-full border bg-background p-3 text-sm outline-none" /></label>
    <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Work type<select name="workType" className={inputClass}><option value="novel">Novel</option><option value="novella">Novella</option><option value="collection">Collection</option><option value="poem">Poetry</option><option value="essay">Essays</option><option value="research">Research</option><option value="other">Other</option></select></label><label className="block text-sm font-medium">Series<select name="seriesId" className={inputClass}><option value="">Standalone book</option>{series.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label></div>
    <label className="block text-sm font-medium">Volume order<input name="volumeOrder" type="number" min="0" defaultValue="0" className={inputClass} /></label>
    <CreditAndState authors={authors} />
    <label className="flex items-center gap-2 text-sm"><input name="publicDomain" type="checkbox" /> Public-domain work</label>
  </FormShell></form>;
}

function CreditAndState({ authors }: { authors: AuthorOption[] }) {
  return <><label className="block text-sm font-medium">Primary author<select name="authorId" className={inputClass}><option value="">No credit yet</option>{authors.map((author) => <option key={author.id} value={author.id}>{author.name} · {author.kind}</option>)}</select></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">State<select name="status" className={inputClass}><option value="planned">Planned</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option><option value="paused">Paused</option></select></label><label className="block text-sm font-medium">Visibility<select name="visibility" className={inputClass}><option value="private">Private draft</option><option value="unlisted">Unlisted</option><option value="public">Public</option></select></label></div></>;
}
