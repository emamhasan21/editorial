import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-current/15 py-10 text-current">
      <div className="flex flex-col gap-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">সম্পাদকীয়</p>
          <p className="mt-1 opacity-55">শব্দ আপনার। প্রকাশও আপনার।</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 opacity-60">
          <Link href="/blog" className="transition-opacity hover:opacity-100">লেখা</Link>
          <Link href="/topics" className="transition-opacity hover:opacity-100">বিষয়</Link>
          <Link href="/about" className="transition-opacity hover:opacity-100">আমাদের কথা</Link>
          <Link href="/studio" className="transition-opacity hover:opacity-100">স্টুডিও</Link>
        </nav>
      </div>
    </footer>
  );
}
