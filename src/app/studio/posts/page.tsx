import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { ArrowUpRight, Plus } from "lucide-react";
import { db } from "@/db";
import { posts, users } from "@/db/schema";

export const metadata: Metadata = { title: "Releases · Studio" };
export const dynamic = "force-dynamic";

export default async function ReleasesStudioPage() {
  const releases = await db.select({ id: posts.id, slug: posts.slug, title: posts.title, type: posts.releaseType, status: posts.status, visibility: posts.visibility, updatedAt: posts.updatedAt, authorName: users.name }).from(posts).leftJoin(users, eq(posts.authorId, users.id)).orderBy(desc(posts.updatedAt)).limit(200);
  return (
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b pb-6"><div><p className="font-mono text-xs uppercase tracking-widest text-brand">Publishing</p><h1 className="mt-2 text-3xl font-semibold">All releases</h1><p className="mt-2 text-sm text-muted-foreground">Draft, review, scheduled, published, and archived releases.</p></div><Link href="/studio/new" className="inline-flex h-10 items-center gap-2 bg-foreground px-4 text-sm font-medium text-background"><Plus className="size-4" /> New release</Link></header>
      <div className="mt-8 overflow-x-auto border">
        <table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-4 py-3 font-medium">Title</th><th className="px-4 py-3 font-medium">Type</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Author</th><th className="px-4 py-3 font-medium">Updated</th><th className="px-4 py-3"><span className="sr-only">Open</span></th></tr></thead><tbody>{releases.map((release) => <tr key={release.id} className="border-b last:border-0"><td className="px-4 py-4 font-medium">{release.title}</td><td className="px-4 py-4 capitalize text-muted-foreground">{release.type}</td><td className="px-4 py-4"><span className="border px-2 py-1 text-[10px] uppercase">{release.status}</span></td><td className="px-4 py-4 text-muted-foreground">{release.authorName || "Unknown"}</td><td className="px-4 py-4 text-muted-foreground">{release.updatedAt.toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })}</td><td className="px-4 py-4">{release.status === "published" && <Link href={`/releases/${release.slug}`} aria-label={`View ${release.title}`}><ArrowUpRight className="size-4" /></Link>}</td></tr>)}</tbody></table>
        {!releases.length && <p className="p-8 text-sm text-muted-foreground">No releases yet.</p>}
      </div>
    </div>
  );
}
