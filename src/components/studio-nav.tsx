"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FilePlus2, Files, Image, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/studio", label: "Overview", icon: BarChart3 },
  { href: "/studio/new", label: "New post", icon: FilePlus2 },
  { href: "/studio/posts", label: "Posts", icon: Files },
  { href: "/studio/media", label: "Media", icon: Image },
  { href: "/studio/writers", label: "Writers", icon: Users },
  { href: "/studio/settings", label: "Settings", icon: Settings },
];

export function StudioNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto p-2 lg:block lg:space-y-1 lg:p-4">
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
