import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Comments } from "@/components/comments";
import { ContributorLinks } from "@/components/contributor-links";
import { DocsShell } from "@/components/docs-shell";
import { ReactionBar } from "@/components/reaction-bar";
import { Reveal, WordReveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { getPublishedPostBySlug } from "@/data/posts";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: PageProps<"/releases/[slug]">): Promise<Metadata> { const { slug } = await params; const release = await getPublishedPostBySlug(slug); return release ? { title: release.title, description: release.excerpt } : {}; }
export default async function ReleasePage({ params }: PageProps<"/releases/[slug]">) { const { slug } = await params; const release = await getPublishedPostBySlug(slug); if (!release) notFound(); const toc = [...release.tableOfContents.map((item) => ({ title: item.text, href: `#${item.id}` })), { title: "Conversation", href: "#comments" }]; return <DocsShell toc={toc}><article><header className="border-b pb-9"><Reveal><p className="font-mono text-xs uppercase tracking-widest text-brand">{release.kicker || release.releaseType}</p></Reveal><WordReveal className="mt-4 text-4xl font-semibold leading-[1.08] tracking-[-.045em] sm:text-5xl">{release.title}</WordReveal>{release.subtitle && <p className="mt-4 text-xl leading-8 text-muted-foreground">{release.subtitle}</p>}<p className="mt-6 text-sm text-muted-foreground"><ContributorLinks contributors={release.contributors} fallback={release.author} /> · {(release.publishedAt || release.updatedAt).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" })}</p></header><div className="reading-copy py-10" dangerouslySetInnerHTML={{ __html: release.html }} /><ReactionBar /><Comments /><SiteFooter /></article></DocsShell>; }
