"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

const initialComments = [
  { name: "Mira Sen", body: "The idea of keeping the interface quiet until it is needed really resonates.", time: "2 hours ago" },
  { name: "Rafi Alam", body: "Structured content without sacrificing the writing flow is exactly the balance I want.", time: "Yesterday" },
];

export function Comments() {
  const [comments, setComments] = useState(initialComments);
  const [draft, setDraft] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setComments((items) => [{ name: "You", body, time: "Just now" }, ...items]);
    setDraft("");
  }

  return (
    <section id="comments" className="scroll-mt-24 pt-4">
      <h2 className="text-xl font-semibold tracking-tight">Conversation <span className="text-muted-foreground">{comments.length}</span></h2>
      <form onSubmit={submit} className="mt-5 border bg-muted/40 p-4">
        <label htmlFor="comment" className="mb-2 block text-sm font-medium">Join the discussion</label>
        <textarea id="comment" value={draft} onChange={(event) => setDraft(event.target.value)} rows={3} placeholder="Write a thoughtful response..." className="w-full resize-y border bg-background p-3 text-sm leading-6 outline-none focus:border-brand" />
        <div className="mt-3 flex justify-end">
          <button type="submit" className="inline-flex h-9 items-center gap-2 bg-foreground px-3 text-sm font-medium text-background">
            Comment <Send className="size-3.5" />
          </button>
        </div>
      </form>
      <div className="mt-3 divide-y">
        {comments.map((comment, index) => (
          <article key={`${comment.name}-${index}`} className="py-5">
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center bg-brand-soft text-xs font-semibold text-brand">{comment.name.slice(0, 1)}</span>
              <div><p className="text-sm font-medium">{comment.name}</p><p className="text-xs text-muted-foreground">{comment.time}</p></div>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{comment.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
