import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BookOpen, LibraryBig, UserRound, Users } from "lucide-react";
import { auth } from "@/lib/auth";
import { canAccessStudio, roleLabel } from "@/lib/permissions";

export const metadata: Metadata = { title: "My account" };

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  const studioAccess = canAccessStudio(session.user.role);

  return (
    <main className="site-container min-h-[calc(100vh-4rem)] py-10 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <header className="border-b pb-8">
          <p className="font-mono text-xs uppercase tracking-widest text-brand">Account</p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="grid size-16 place-items-center bg-foreground text-xl font-semibold text-background">{session.user.name.slice(0, 1).toUpperCase()}</span>
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.035em]">{session.user.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{session.user.email}</p>
              <span className="mt-2 inline-flex border px-2 py-1 font-mono text-[10px] uppercase tracking-wider">{roleLabel(session.user.role)}</span>
            </div>
          </div>
        </header>

        <section className="grid gap-4 py-8 sm:grid-cols-2">
          {studioAccess && <AccountLink href="/studio" icon={LibraryBig} title="Open dashboard" description="Manage releases, books, writers, and publication settings." />}
          <AccountLink href="/books" icon={BookOpen} title="Browse books" description="Continue through the long-form Bangla library." />
          <AccountLink href="/series" icon={LibraryBig} title="Explore series" description="Find connected volumes and ongoing works." />
          <AccountLink href="/writers" icon={Users} title="Discover writers" description="Browse classic and current literary profiles." />
        </section>

        {!studioAccess && <div className="border bg-muted/40 p-5"><UserRound className="size-5 text-brand" /><h2 className="mt-3 font-semibold">Reader account</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">This account can read and participate in public features. Publishing tools appear only after an owner or administrator assigns a writer, editor, or administrator role.</p></div>}
      </div>
    </main>
  );
}

function AccountLink({ href, icon: Icon, title, description }: { href: string; icon: typeof BookOpen; title: string; description: string }) {
  return <Link href={href} className="group border p-5 transition-colors hover:bg-muted/50"><Icon className="size-5 text-brand" /><h2 className="mt-4 font-semibold group-hover:underline">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></Link>;
}
