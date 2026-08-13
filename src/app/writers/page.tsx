import type { Metadata } from "next";
import Link from "next/link";
import { DocsShell } from "@/components/docs-shell";
import { Reveal, WordReveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { getAuthors } from "@/data/library";

export const metadata: Metadata = { title: "Writers", description: "Classic and current writers in the literary archive." };
export const dynamic = "force-dynamic";

export default async function WritersPage() {
  const writers = await getAuthors();
  const classic = writers.filter((writer) => writer.kind === "classic");
  const current = writers.filter((writer) => writer.kind !== "classic");
  return <DocsShell toc={[{ title: "Classic writers", href: "#classic" }, { title: "Current writers", href: "#current" }]}><header className="pb-10"><Reveal><p className="font-mono text-xs uppercase tracking-[.2em] text-brand">People & legacy</p></Reveal><WordReveal className="mt-3 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">Writers across generations.</WordReveal><Reveal delay={0.2}><p className="mt-5 max-w-2xl leading-7 text-muted-foreground">A durable credit archive for classic authors, contemporary writers, translators, editors, and collaborators.</p></Reveal></header><WriterGroup id="classic" title="Classic writers" writers={classic} /><WriterGroup id="current" title="Current writers & collaborators" writers={current} /><SiteFooter /></DocsShell>;
}

function WriterGroup({ id, title, writers }: { id: string; title: string; writers: Awaited<ReturnType<typeof getAuthors>> }) {
  return <section id={id} className="mb-12 scroll-mt-24"><div className="flex items-center justify-between border-b pb-3"><h2 className="text-xl font-semibold">{title}</h2><span className="font-mono text-xs text-muted-foreground">{writers.length}</span></div><div className="grid sm:grid-cols-2">{writers.map((writer) => <Link key={writer.id} href={`/writers/${writer.slug}`} className="group border-b p-5 transition-colors hover:bg-muted/50 sm:odd:border-r"><div className="flex gap-4"><span className="grid size-12 shrink-0 place-items-center bg-foreground text-lg font-semibold text-background">{writer.name.slice(0, 1)}</span><div><h3 className="font-semibold group-hover:underline">{writer.name}</h3><p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{writer.literaryPeriod || writer.kind}</p><p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{writer.bio || "Biography and credited works are being collected."}</p></div></div></Link>)}</div></section>;
}
