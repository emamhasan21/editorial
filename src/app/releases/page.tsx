import type { Metadata } from "next";
import Link from "next/link";
import { ContributorLinks } from "@/components/contributor-links";
import { DocsShell } from "@/components/docs-shell";
import { Reveal, WordReveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { getPublishedPosts } from "@/data/posts";

export const metadata: Metadata = {
  title: "সাহিত্য",
  description: "ছোটগল্প, কবিতা, প্রবন্ধ, সাক্ষাৎকার ও বই আলোচনা।",
};

export const dynamic = "force-dynamic";

const releaseTypes = {
  story: { label: "ছোটগল্প", title: "ছোটগল্পের সংগ্রহ", description: "এক বসায় পড়া যায়—এমন নির্বাচিত ছোটগল্প।" },
  poem: { label: "কবিতা", title: "কবিতার সংগ্রহ", description: "কবিতা, কবিতাগুচ্ছ ও কাব্যভাষার নতুন প্রকাশ।" },
  essay: { label: "প্রবন্ধ", title: "প্রবন্ধ ও মনন", description: "সাহিত্য, সমাজ, ইতিহাস ও সংস্কৃতিবিষয়ক প্রবন্ধ।" },
  interview: { label: "সাক্ষাৎকার", title: "লেখকের মুখোমুখি", description: "লেখক, সম্পাদক ও গবেষকদের সঙ্গে দীর্ঘ আলাপ।" },
  review: { label: "বই আলোচনা", title: "বই আলোচনা", description: "নতুন ও ধ্রুপদি বই নিয়ে পাঠ, পর্যালোচনা ও সমালোচনা।" },
} as const;

type ReleaseType = keyof typeof releaseTypes;

function isReleaseType(value: string | string[] | undefined): value is ReleaseType {
  return typeof value === "string" && value in releaseTypes;
}

const allFormats = Object.entries(releaseTypes) as [ReleaseType, (typeof releaseTypes)[ReleaseType]][];

export default async function ReleasesPage({ searchParams }: PageProps<"/releases">) {
  const { type } = await searchParams;
  const selectedType = isReleaseType(type) ? type : undefined;
  const allReleases = await getPublishedPosts();
  const releases = selectedType
    ? allReleases.filter((release) => release.releaseType === selectedType)
    : allReleases;
  const page = selectedType
    ? releaseTypes[selectedType]
    : {
        label: "নতুন প্রকাশ",
        title: "সাহিত্যের নতুন পাঠ",
        description: "ছোটগল্প, কবিতা, প্রবন্ধ, সাক্ষাৎকার, বই আলোচনা ও স্বতন্ত্র রচনা।",
      };

  return (
    <DocsShell toc={[{ title: page.label, href: "#all" }]}>
      <header className="pb-10">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[.2em] text-brand">{page.label}</p>
        </Reveal>
        <WordReveal className="mt-3 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">
          {page.title}
        </WordReveal>
        <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">{page.description}</p>
        <nav aria-label="সাহিত্যের বিভাগ" className="mt-7 flex flex-wrap gap-2">
          <Link
            href="/releases"
            className={`border px-3 py-2 text-sm transition-colors hover:bg-muted ${!selectedType ? "bg-foreground text-background" : ""}`}
          >
            সব প্রকাশ
          </Link>
          {allFormats.map(([value, format]) => (
            <Link
              key={value}
              href={`/releases?type=${value}`}
              className={`border px-3 py-2 text-sm transition-colors hover:bg-muted ${selectedType === value ? "bg-foreground text-background" : ""}`}
            >
              {format.label}
            </Link>
          ))}
        </nav>
      </header>

      <section id="all">
        {releases.length ? (
          releases.map((release) => (
            <Link
              key={release.id}
              href={`/releases/${release.slug}`}
              className="group block border-t py-6 last:border-b"
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-brand">
                {releaseTypes[release.releaseType as ReleaseType]?.label ?? release.releaseType}
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-.025em] group-hover:underline">
                {release.title}
              </h2>
              {release.subtitle && <p className="mt-2 text-muted-foreground">{release.subtitle}</p>}
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{release.excerpt}</p>
              <p className="mt-4 text-xs text-muted-foreground">
                <ContributorLinks contributors={release.contributors} fallback={release.author} />
              </p>
            </Link>
          ))
        ) : (
          <div className="border-y py-12">
            <p className="text-lg font-medium">এই বিভাগে এখনো কোনো লেখা প্রকাশিত হয়নি।</p>
            <p className="mt-2 text-sm text-muted-foreground">নতুন লেখা প্রকাশিত হলে এখানে দেখা যাবে।</p>
          </div>
        )}
      </section>
      <SiteFooter />
    </DocsShell>
  );
}
