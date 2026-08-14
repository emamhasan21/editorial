"use client";

import { FormEvent, useState } from "react";
import { LoaderCircle, Save } from "lucide-react";

type PublicationSettings = { name: string; description: string; locale: "bn" | "en" };

export function PublicationSettingsForm({ initial }: { initial: PublicationSettings }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/settings/publication", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: String(data.get("name")), description: String(data.get("description")), locale: String(data.get("locale")) }) });
    const result = await response.json().catch(() => null);
    setPending(false);
    setMessage(response.ok ? "Publication settings saved." : result?.error?.message ?? "Settings could not be saved.");
  }

  return (
    <form onSubmit={save} className="border bg-background p-5 sm:p-6">
      <h2 className="font-semibold">Publication identity</h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">The primary name, description, and content language stored in the database.</p>
      <div className="mt-6 space-y-4">
        <label className="block text-sm font-medium">Publication name<input name="name" required maxLength={120} defaultValue={initial.name} className="mt-1.5 h-11 w-full border bg-background px-3 outline-none focus:border-brand" /></label>
        <label className="block text-sm font-medium">Description<textarea name="description" rows={4} maxLength={500} defaultValue={initial.description} className="mt-1.5 w-full resize-y border bg-background p-3 outline-none focus:border-brand" /></label>
        <label className="block text-sm font-medium">Primary language<select name="locale" defaultValue={initial.locale} className="mt-1.5 h-11 w-full border bg-background px-3"><option value="bn">বাংলা</option><option value="en">English</option></select></label>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3"><button disabled={pending} className="inline-flex h-10 items-center gap-2 bg-foreground px-4 text-sm font-medium text-background disabled:opacity-50">{pending ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />} Save settings</button>{message && <p role="status" className="text-xs text-muted-foreground">{message}</p>}</div>
    </form>
  );
}
