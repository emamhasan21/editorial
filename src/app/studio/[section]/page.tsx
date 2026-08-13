import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, HardDriveUpload, Plus, Settings2, UserPlus } from "lucide-react";

const sections = {
  posts: { title: "Posts", description: "Draft, scheduled, and published stories.", icon: FileText, action: "New post", href: "/studio/new" },
  media: { title: "Media", description: "Images and files stored on this server.", icon: HardDriveUpload, action: "Upload media", href: "#upload" },
  writers: { title: "Writers", description: "Authors, editors, roles, and invitations.", icon: UserPlus, action: "Invite writer", href: "#invite" },
  settings: { title: "Settings", description: "Publication identity, domains, and defaults.", icon: Settings2, action: "Save changes", href: "#save" },
};

export function generateStaticParams() { return Object.keys(sections).map((section) => ({ section })); }

export async function generateMetadata({ params }: PageProps<"/studio/[section]">): Promise<Metadata> {
  const { section } = await params;
  const data = sections[section as keyof typeof sections];
  return data ? { title: data.title } : {};
}

export default async function StudioSectionPage({ params }: PageProps<"/studio/[section]">) {
  const { section } = await params;
  const data = sections[section as keyof typeof sections];
  if (!data) notFound();
  const Icon = data.icon;
  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-xs uppercase tracking-widest text-brand">Workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em]">{data.title}</h1><p className="mt-2 text-sm text-muted-foreground">{data.description}</p></div><Link href={data.href} className="inline-flex h-10 items-center gap-2 bg-foreground px-4 text-sm font-medium text-background"><Plus className="size-4" />{data.action}</Link></div>
      <div className="mt-8 border bg-muted/30 p-10 text-center sm:p-16"><span className="mx-auto grid size-12 place-items-center border bg-background"><Icon className="size-5 text-brand" /></span><h2 className="mt-5 font-semibold">{section === "settings" ? "Publication controls are ready" : `Your ${data.title.toLowerCase()} will appear here`}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">This screen is connected to the shared application shell. Database-backed records are populated after the local MariaDB migration and seed step.</p></div>
    </div>
  );
}
