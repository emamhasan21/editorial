"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Command,
  GitBranch,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { AccountMenu } from "@/components/account-menu";
import { navigation } from "@/lib/content";

const primaryLinks = [
  { href: "/books", label: "বই" },
  { href: "/series", label: "বইমালা" },
  { href: "/writers", label: "লেখক" },
  { href: "/releases", label: "সাহিত্য" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((value) => !value);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const searchable = useMemo(
    () => navigation.flatMap((section) => section.items),
    [],
  );
  const results = searchable.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()),
  );

  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("editorial-theme", next);
  }

  return (
    <>
      <header className="site-header glass sticky top-0 z-50 border-b">
        <div className="site-container flex h-16 items-center gap-4">
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setMenuOpen(true)}
            className="grid size-9 place-items-center text-muted-foreground hover:text-foreground lg:hidden"
          >
            <Menu className="size-5" />
          </button>

          <Link href="/" className="group flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid size-7 place-items-center bg-foreground text-xs text-background transition-transform duration-300 group-hover:-rotate-3">
              E
            </span>
            <span>editorial</span>
          </Link>

          <nav className="ml-4 hidden items-center gap-5 text-sm text-muted-foreground md:flex">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden h-9 w-56 items-center gap-2 border bg-muted/60 px-3 text-left text-sm text-muted-foreground transition-colors hover:bg-muted sm:flex"
            >
              <Search className="size-4" />
              <span>খুঁজুন...</span>
              <kbd className="ml-auto flex items-center gap-0.5 border bg-background px-1.5 py-0.5 font-mono text-[10px]">
                <Command className="size-2.5" />K
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="grid size-9 place-items-center text-muted-foreground hover:text-foreground sm:hidden"
            >
              <Search className="size-4" />
            </button>
            <a
              href="https://github.com/emamhasan21/editorial"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="grid size-9 place-items-center text-muted-foreground hover:text-foreground"
            >
              <GitBranch className="size-4" />
            </a>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="grid size-9 place-items-center text-muted-foreground hover:text-foreground"
            >
              <Sun className="theme-icon-dark size-4" />
              <Moon className="theme-icon-light size-4" />
            </button>
            <AccountMenu />
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[70] bg-black/35 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              onClick={(event) => event.stopPropagation()}
              className="h-full w-[min(86vw,340px)] overflow-y-auto border-r bg-background p-6 shadow-2xl"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-semibold">মেনু</span>
                <button
                  type="button"
                  aria-label="Close navigation"
                  onClick={() => setMenuOpen(false)}
                  className="grid size-9 place-items-center border"
                >
                  <X className="size-4" />
                </button>
              </div>
              <MobileNavigation pathname={pathname} onNavigate={() => setMenuOpen(false)} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-label="Search"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-xl border bg-background shadow-2xl"
            >
              <div className="flex h-14 items-center gap-3 border-b px-4">
                <Search className="size-4 text-muted-foreground" />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="বই, লেখক ও রচনা খুঁজুন..."
                  className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <kbd className="border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  ESC
                </kbd>
              </div>
              <div className="max-h-[52vh] overflow-y-auto p-2">
                <p className="px-2 py-2 text-xs font-medium text-muted-foreground">
                  {query ? "অনুসন্ধানের ফল" : "দ্রুত প্রবেশ"}
                </p>
                {results.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      router.push(item.href);
                    }}
                    className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm hover:bg-muted"
                  >
                    {item.title}
                    <span className="font-mono text-xs text-muted-foreground">↗</span>
                  </button>
                ))}
                {!results.length && (
                  <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                    “{query}”–এর জন্য কিছু পাওয়া যায়নি।
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MobileNavigation({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <nav className="space-y-7">
      {navigation.map((section) => (
        <div key={section.title}>
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {section.title}
          </p>
          <div className="space-y-0.5">
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center justify-between px-2 py-2 text-sm ${
                  pathname === item.href
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {item.title}
                {item.badge && (
                  <span className="bg-brand px-1.5 py-0.5 text-[10px] text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
