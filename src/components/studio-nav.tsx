"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FilePlus2, Files, Image, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/studio", label: "এক নজরে", icon: BarChart3 },
  { href: "/studio/new", label: "নতুন লেখা", icon: FilePlus2 },
  { href: "/studio/posts", label: "সব লেখা", icon: Files },
  { href: "/studio/media", label: "ছবি ও মাধ্যম", icon: Image },
  { href: "/studio/writers", label: "লেখক", icon: Users },
  { href: "/studio/settings", label: "সেটিংস", icon: Settings },
];

export function StudioNav() {
  const pathname = usePathname();
  return (
    <nav className="no-scrollbar flex gap-1 overflow-x-auto overscroll-x-contain p-2 lg:block lg:space-y-1 lg:p-4">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link key={link.href} href={link.href} className={cn("flex shrink-0 items-center gap-2 px-3 py-2 text-sm transition-colors", active ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground")}>
            <link.icon className="size-4" /> {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
