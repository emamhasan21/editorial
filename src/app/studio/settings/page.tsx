import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { Database, HardDrive, ShieldCheck, Users } from "lucide-react";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { PublicationSettingsForm } from "@/components/studio/publication-settings-form";
import { auth } from "@/lib/auth";
import { canManageRoles } from "@/lib/permissions";
import { siteName, siteTagline } from "@/lib/site";

export const metadata: Metadata = { title: "Settings · Studio" };
export const dynamic = "force-dynamic";

type PublicationValue = { name?: string; description?: string; locale?: "bn" | "en" };

export default async function SettingsStudioPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  if (!canManageRoles(session.user.role)) redirect("/studio");
  const [record] = await db.select({ value: settings.value }).from(settings).where(eq(settings.key, "publication")).limit(1);
  const value = (record?.value ?? {}) as PublicationValue;
  const publication = { name: value.name ?? siteName, description: value.description ?? siteTagline, locale: value.locale ?? "bn" };

  return (
    <div className="mx-auto max-w-6xl">
      <header className="border-b pb-6"><p className="font-mono text-xs uppercase tracking-widest text-brand">Administration</p><h1 className="mt-2 text-3xl font-semibold">Settings</h1><p className="mt-2 text-sm text-muted-foreground">Publication identity and a clear overview of the self-hosted installation.</p></header>
      <div className="mt-8 grid gap-7 xl:grid-cols-[minmax(0,1fr)_340px]">
        <PublicationSettingsForm initial={publication} />
        <aside className="space-y-3">
          <InfoCard icon={Database} title="MariaDB" text="Content, accounts, sessions, revisions, comments, and settings use the isolated local database." />
          <InfoCard icon={HardDrive} title="Local media" text="Uploads and optimized images stay on this server. No hosted media backend is required." />
          <InfoCard icon={ShieldCheck} title="Protected Studio" text="Publishing routes verify the account session and role at the server boundary." />
          <Link href="/studio/users" className="flex items-center gap-3 border bg-background p-4 text-sm font-medium hover:bg-muted"><Users className="size-4 text-brand" /> Manage users and roles</Link>
        </aside>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, text }: { icon: typeof Database; title: string; text: string }) {
  return <div className="border bg-background p-4"><Icon className="size-4 text-brand" /><h2 className="mt-3 text-sm font-semibold">{title}</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p></div>;
}
