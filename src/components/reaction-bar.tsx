"use client";

import { useState } from "react";
import { Bookmark, Check, Heart, MessageCircle, Share2 } from "lucide-react";

export function ReactionBar() {
  const [claps, setClaps] = useState(128);
  const [bookmarked, setBookmarked] = useState(false);
  const [shared, setShared] = useState(false);

  async function share() {
    if (navigator.share) {
      await navigator.share({ title: document.title, url: location.href });
    } else {
      await navigator.clipboard.writeText(location.href);
      setShared(true);
      window.setTimeout(() => setShared(false), 1600);
    }
  }

  return (
    <div className="my-10 flex flex-wrap items-center gap-2 border-y py-4">
      <button type="button" onClick={() => setClaps((value) => value + 1)} className="inline-flex h-9 items-center gap-2 border px-3 text-sm transition-colors hover:bg-muted" aria-label="Clap for this post">
        <Heart className="size-4" /> {claps}
      </button>
      <a href="#comments" className="inline-flex h-9 items-center gap-2 border px-3 text-sm transition-colors hover:bg-muted">
        <MessageCircle className="size-4" /> 3
      </a>
      <button type="button" onClick={() => setBookmarked((value) => !value)} className={`inline-flex h-9 items-center gap-2 border px-3 text-sm transition-colors hover:bg-muted ${bookmarked ? "bg-brand text-white" : ""}`}>
        <Bookmark className="size-4" fill={bookmarked ? "currentColor" : "none"} />
        {bookmarked ? "Saved" : "Save"}
      </button>
      <button type="button" onClick={share} className="ml-auto inline-flex h-9 items-center gap-2 border px-3 text-sm transition-colors hover:bg-muted">
        {shared ? <Check className="size-4" /> : <Share2 className="size-4" />}
        {shared ? "Copied" : "Share"}
      </button>
    </div>
  );
}
