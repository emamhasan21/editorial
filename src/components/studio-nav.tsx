"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BarChart3, BookOpen, ChevronDown, FileText, LibraryBig, PenLine, ScrollText, Settings, Users } from "lucide-react";
import { canManageAuthors, canManageRoles } from "@/lib/permissions";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: typeof BarChart3 };

const dashboard: NavItem[] = [
  { href: "/studio", label: "Dashboard", icon: BarChart3 },
];

const publishing: NavItem[] = [
  { href: "/studio/posts", label: "All releases", icon: FileText },
  { href: "/studio/new", label: "New release", icon: PenLine },
];

const library: NavItem[] = [
  { href: "/studio/authors", label: "Authors", icon: Users },
  { href: "/studio/series", label: "Series", icon: LibraryBig },
  { href: "/studio/books", label: "Books", icon: BookOpen },
  { href: "/studio/chapters/new", label: "New chapter", icon: ScrollText },
];

const administration: NavItem[] = [
  { href: "/studio/users", label: "Users & roles", icon: Users },
  { href: "/studio/settings", label: "Settings", icon: Settings },
];

export function StudioNav({ role }: { role: unknown }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const sections = [
    { title: "", items: dashboard },
    { title: "Publishing", items: publishing },
    { title: "Library", items: canManageAuthors(role) ? library : library.filter((item) => item.href !== "/studio/authors") },
    ...(canManageRoles(role) ? [{ title: "Administration", items: administration }] : []),
  ];

  return (
    <>
      <div className="p-3 lg:hidden">
        <button type="button" aria-expanded={mobileOpen} onClick={() => setMobileOpen((value) => !value)} className="flex w-full items-center justify-between border bg-background px-3 py-2.5 text-sm font-medium">
          Dashboard navigation
          <ChevronDown className={`size-4 transition-transform ${mobileOpen ? "rotate-180" : ""}`} />
        </button>
      </div>
      <nav className={cn("border-t p-3 lg:block lg:border-0 lg:p-4", mobileOpen ? "block" : "hidden")}>
        {sections.map((section) => (
          <div key={section.title || "dashboard"} className="mb-5 last:mb-0">
            {section.title && <p className="mb-1.5 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{section.title}</p>}
            <div className="space-y-1">
              {section.items.map((link) => {
                const active = pathname === link.href || (link.href !== "/studio" && pathname.startsWith(`${link.href}/`));
                return (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={cn("flex items-center gap-2 px-3 py-2.5 text-sm transition-colors", active ? "bg-foreground font-medium text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                    <link.icon className="size-4" /> {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </>
  );
}
