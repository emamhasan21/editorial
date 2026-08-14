import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t py-10">
      <div className="flex flex-col gap-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-foreground">editorial</p>
          <p className="mt-1">বাংলা সাহিত্য, সুন্দর পাঠ ও স্বাধীন প্রকাশনা।</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/books" className="hover:text-foreground">বই</Link>
          <Link href="/series" className="hover:text-foreground">বইমালা</Link>
          <Link href="/writers" className="hover:text-foreground">লেখক</Link>
          <Link href="/releases" className="hover:text-foreground">সাহিত্য</Link>
          <Link href="/about" className="hover:text-foreground">আমাদের কথা</Link>
        </nav>
      </div>
    </footer>
  );
}
