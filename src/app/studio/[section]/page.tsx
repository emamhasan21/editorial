import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, HardDriveUpload, Plus, Settings2, UserPlus } from "lucide-react";

const sections = {
  posts: { title: "সব লেখা", description: "খসড়া, নির্ধারিত এবং প্রকাশিত লেখা।", icon: FileText, action: "নতুন লেখা", href: "/studio/new" },
  media: { title: "ছবি ও মাধ্যম", description: "এই সার্ভারে থাকা ছবি ও ফাইল।", icon: HardDriveUpload, action: "ফাইল আপলোড", href: "#upload" },
  writers: { title: "লেখক", description: "লেখক, সম্পাদক, ভূমিকা ও আমন্ত্রণ।", icon: UserPlus, action: "লেখক আমন্ত্রণ", href: "#invite" },
  settings: { title: "সেটিংস", description: "প্রকাশনার পরিচয়, ডোমেইন ও প্রাথমিক পছন্দ।", icon: Settings2, action: "সংরক্ষণ", href: "#save" },
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
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow text-brand">লেখকের ঘর</p><h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em]">{data.title}</h1><p className="mt-2 text-sm text-muted-foreground">{data.description}</p></div><Link href={data.href} className="inline-flex h-10 items-center gap-2 bg-foreground px-4 text-sm font-medium text-background"><Plus className="size-4" />{data.action}</Link></div>
      <div className="mt-8 border bg-muted/30 p-10 text-center sm:p-16"><span className="mx-auto grid size-12 place-items-center border bg-background"><Icon className="size-5 text-brand" /></span><h2 className="mt-5 font-semibold">{section === "settings" ? "প্রকাশনার নিয়ন্ত্রণ প্রস্তুত" : `${data.title} এখানে দেখা যাবে`}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">এই পর্দাটি মূল অ্যাপের সঙ্গে যুক্ত। স্থানীয় MariaDB মাইগ্রেশন ও সিড চালানোর পর ডেটাবেসের তথ্য এখানে দেখা যাবে।</p></div>
    </div>
  );
}
