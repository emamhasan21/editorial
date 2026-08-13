import type { Metadata } from "next";
import Link from "next/link";
import { AuthorForm } from "@/components/studio/library-forms";
import { getAuthors } from "@/data/library";

export const metadata: Metadata = { title: "Authors · Studio" };
export const dynamic = "force-dynamic";

export default async function AuthorsStudioPage() {
  const authors = await getAuthors();
  return <StudioGrid title="Authors" description="Literary identities are separate from login accounts, so classic writers and living collaborators share one credit system." form={<AuthorForm />}>
    {authors.map((author) => <Link href={`/writers/${author.slug}`} key={author.id} className="block border-b p-4 transition-colors hover:bg-muted/50 last:border-0"><div className="flex items-start justify-between gap-4"><div><h3 className="font-medium">{author.name}</h3><p className="mt-1 text-xs text-muted-foreground">{author.englishName || author.literaryPeriod || "Profile ready for credits"}</p></div><span className="border px-2 py-1 font-mono text-[10px] uppercase">{author.kind}</span></div></Link>)}
  </StudioGrid>;
}

function StudioGrid({ title, description, form, children }: { title: string; description: string; form: React.ReactNode; children: React.ReactNode }) {
  return <div className="mx-auto max-w-6xl"><header><p className="font-mono text-xs uppercase tracking-widest text-brand">Library control</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em]">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p></header><div className="mt-8 grid gap-7 xl:grid-cols-[minmax(0,1fr)_360px]"><div className="border bg-background"><div className="border-b p-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">{title} · {Array.isArray(children) ? children.length : 0}</div>{children || <p className="p-8 text-sm text-muted-foreground">No records yet.</p>}</div>{form}</div></div>;
}
