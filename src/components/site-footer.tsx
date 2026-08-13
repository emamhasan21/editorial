import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t py-10">
      <div className="flex flex-col gap-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-foreground">editorial</p>
          <p className="mt-1">Own your words. Publish beautifully.</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/blog" className="hover:text-foreground">Writing</Link>
          <Link href="/topics" className="hover:text-foreground">Topics</Link>
          <Link href="/about" className="hover:text-foreground">About</Link>
          <Link href="/studio" className="hover:text-foreground">Studio</Link>
        </nav>
      </div>
    </footer>
  );
}
