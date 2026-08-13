"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/lib/content";
import { cn } from "@/lib/utils";

type TocItem = { title: string; href: string };

export function DocsShell({
  children,
  toc,
}: {
  children: React.ReactNode;
  toc?: TocItem[];
}) {
  const pathname = usePathname();

  return (
    <div className="site-container grid min-h-[calc(100vh-4rem)] lg:grid-cols-[230px_minmax(0,1fr)] xl:grid-cols-[230px_minmax(0,760px)_220px] xl:justify-center">
      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] overflow-y-auto border-r py-8 pr-6 lg:block">
        <nav className="space-y-7">
          {navigation.map((section) => (
            <div key={section.title}>
              <h2 className="mb-2 px-2 text-sm font-semibold">{section.title}</h2>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(`${item.href}/`));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-2 py-1.5 text-sm transition-colors",
                        active
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {item.title}
                      {item.badge && (
                        <span className="bg-brand px-1.5 py-0.5 text-[9px] font-semibold text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 px-0 py-10 sm:px-8 lg:px-10 lg:py-14">
        {children}
      </main>

      <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] border-l py-14 pl-8 xl:block">
        <div className="text-sm">
          <p className="mb-3 font-medium">এই পাতায়</p>
          <nav className="space-y-2.5 border-l pl-4 text-muted-foreground">
            {(toc ?? [
              { title: "এক নজরে", href: "#overview" },
              { title: "মূলনীতি", href: "#principles" },
              { title: "প্রকাশ শুরু", href: "#start" },
            ]).map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block transition-colors hover:text-foreground"
              >
                {item.title}
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
}
