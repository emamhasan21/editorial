import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { count, desc, eq } from "drizzle-orm";
import { ArrowRight, BookOpen, FilePenLine, LibraryBig, Plus, ScrollText, Users } from "lucide-react";
import { db } from "@/db";
import { authors, books, chapters, posts } from "@/db/schema";
import { auth } from "@/lib/auth";
import { canAccessStudio, canManageRoles, roleLabel } from "@/lib/permissions";

export const metadata: Metadata = { title: "Dashboard · Studio" };
export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !canAccessStudio(session.user.role)) redirect("/login");

  const [publishedResult, booksResult, chaptersResult, authorsResult, recent] = await Promise.all([
    db.select({ value: count() }).from(posts).where(eq(posts.status, "published")),
    db.select({ value: count() }).from(books),
    db.select({ value: count() }).from(chapters),
    db.select({ value: count() }).from(authors),
    db.select({ id: posts.id, slug: posts.slug, title: posts.title, status: posts.status, releaseType: posts.releaseType, updatedAt: posts.updatedAt }).from(posts).orderBy(desc(posts.updatedAt)).limit(6),
  ]);

  const metrics = [
    { label: "Published releases", value: publishedResult[0]?.value ?? 0, icon: FilePenLine, href: "/studio/posts" },
    { label: "Books", value: booksResult[0]?.value ?? 0, icon: BookOpen, href: "/studio/books" },
    { label: "Chapters", value: chaptersResult[0]?.value ?? 0, icon: ScrollText, href: "/studio/chapters/new" },
    { label: "Literary authors", value: authorsResult[0]?.value ?? 0, icon: Users, href: "/studio/authors" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2"><p className="font-mono text-xs uppercase tracking-widest text-brand">Dashboard</p><span className="border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{roleLabel(session.user.role)}</span></div>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em]">Welcome, {session.user.name}.</h1>
          <p className="mt-2 text-sm text-muted-foreground">Publication status and the next useful actions, all in one place.</p>
        </div>
        <Link href="/studio/new" className="inline-flex h-10 items-center gap-2 bg-foreground px-4 text-sm font-medium text-background"><Plus className="size-4" /> New release</Link>
      </header>

      <section aria-labelledby="overview-heading" className="py-8">
        <h2 id="overview-heading" className="sr-only">Publication overview</h2>
        <div className="grid gap-px border bg-border sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => <Link key={metric.label} href={metric.href} className="group bg-background p-5 transition-colors hover:bg-muted/50"><div className="flex items-center justify-between text-muted-foreground"><span className="text-sm">{metric.label}</span><metric.icon className="size-4" /></div><p className="mt-6 text-3xl font-semibold tracking-tight">{metric.value}</p><p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground">Open section <ArrowRight className="size-3" /></p></Link>)}
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_290px]">
        <section>
          <div className="flex items-end justify-between gap-4"><div><h2 className="font-semibold">Recent releases</h2><p className="mt-1 text-sm text-muted-foreground">Real records from the publication database.</p></div><Link href="/studio/posts" className="text-sm text-muted-foreground hover:text-foreground">View all</Link></div>
          <div className="mt-4 border">
            {recent.length ? recent.map((post) => <div key={post.id} className="flex items-center gap-4 border-b p-4 last:border-b-0"><span className="grid size-10 shrink-0 place-items-center border font-mono text-[10px] uppercase">{post.releaseType.slice(0, 2)}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{post.title}</p><p className="mt-1 text-xs text-muted-foreground">Updated {post.updatedAt.toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })}</p></div><StatusBadge status={post.status} />{post.status === "published" && <Link href={`/releases/${post.slug}`} aria-label={`View ${post.title}`}><ArrowRight className="size-4 text-muted-foreground" /></Link>}</div>) : <p className="p-8 text-sm text-muted-foreground">No releases yet. Create the first one from the button above.</p>}
          </div>
        </section>

        <aside>
          <h2 className="font-semibold">Quick actions</h2>
          <div className="mt-4 space-y-2">
            <QuickLink href="/studio/new" icon={FilePenLine} title="Write a release" />
            <QuickLink href="/studio/books" icon={BookOpen} title="Create or manage books" />
            <QuickLink href="/studio/series" icon={LibraryBig} title="Organize a series" />
            {canManageRoles(session.user.role) && <QuickLink href="/studio/users" icon={Users} title="Manage users and roles" />}
          </div>
        </aside>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const published = status === "published";
  return <span className={`px-2 py-1 text-[10px] font-medium uppercase ${published ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100" : "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100"}`}>{status}</span>;
}

function QuickLink({ href, icon: Icon, title }: { href: string; icon: typeof BookOpen; title: string }) {
  return <Link href={href} className="flex items-center gap-3 border bg-background p-3 text-sm transition-colors hover:bg-muted"><Icon className="size-4 text-brand" /><span className="flex-1">{title}</span><ArrowRight className="size-3.5 text-muted-foreground" /></Link>;
}
