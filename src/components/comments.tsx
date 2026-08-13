"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

const initialComments = [
  { name: "মীরা সেন", body: "প্রয়োজন না হওয়া পর্যন্ত ইন্টারফেসটি নীরব রাখার ভাবনাটি খুব ভালো লেগেছে।", time: "২ ঘণ্টা আগে" },
  { name: "রাফি আলম", body: "লেখার স্বাভাবিক প্রবাহ না হারিয়েও গুছানো কনটেন্ট—ঠিক এই ভারসাম্যটাই দরকার।", time: "গতকাল" },
];

export function Comments() {
  const [comments, setComments] = useState(initialComments);
  const [draft, setDraft] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setComments((items) => [{ name: "আপনি", body, time: "এইমাত্র" }, ...items]);
    setDraft("");
  }

  return (
    <section id="comments" className="scroll-mt-24 pt-4">
      <h2 className="text-xl font-semibold tracking-tight">আলাপ <span className="text-muted-foreground">{comments.length.toLocaleString("bn-BD")}</span></h2>
      <form onSubmit={submit} className="mt-5 border bg-muted/40 p-4">
        <label htmlFor="comment" className="mb-2 block text-sm font-medium">আলোচনায় যোগ দিন</label>
        <textarea id="comment" value={draft} onChange={(event) => setDraft(event.target.value)} rows={3} placeholder="ভেবেচিন্তে একটি উত্তর লিখুন..." className="w-full resize-y border bg-background p-3 text-sm leading-7 outline-none focus:border-brand" />
        <div className="mt-3 flex justify-end">
          <button type="submit" className="inline-flex h-9 items-center gap-2 bg-foreground px-3 text-sm font-medium text-background">মন্তব্য করুন <Send className="size-3.5" /></button>
        </div>
      </form>
      <div className="mt-3 divide-y">
        {comments.map((comment, index) => (
          <article key={`${comment.name}-${index}`} className="py-5">
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand">{comment.name.slice(0, 1)}</span>
              <div><p className="text-sm font-medium">{comment.name}</p><p className="text-xs text-muted-foreground">{comment.time}</p></div>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{comment.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
