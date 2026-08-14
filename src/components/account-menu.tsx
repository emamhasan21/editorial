"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BookMarked, ChevronDown, LayoutDashboard, LogOut, PenLine, Settings, UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { canAccessStudio, canManageRoles, roleLabel } from "@/lib/permissions";

type AccountUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: string | null;
};

export function AccountMenu() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as AccountUser | undefined;
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const studioAccess = canAccessStudio(user?.role);
  const administrationAccess = canManageRoles(user?.role);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", close);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", close);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  async function signOut() {
    setSigningOut(true);
    await authClient.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
    setSigningOut(false);
  }

  if (isPending) {
    return <span className="ml-1 h-9 w-20 animate-pulse border bg-muted" aria-label="Checking account" />;
  }

  if (!user) {
    return (
      <Link href="/login" className="ml-1 inline-flex h-9 items-center gap-2 border border-foreground bg-foreground px-3 text-sm font-medium text-background transition-opacity hover:opacity-85">
        <UserRound className="size-4" />
        <span>Sign in</span>
      </Link>
    );
  }

  const accountHref = studioAccess ? "/studio" : "/account";
  const initial = user.name.trim().slice(0, 1).toUpperCase() || user.email.slice(0, 1).toUpperCase();

  return (
    <div ref={containerRef} className="relative ml-1">
      <button
        type="button"
        aria-label="Open account menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 items-center gap-2 border bg-background px-1.5 pr-2 text-sm hover:bg-muted"
      >
        <span className="grid size-6 place-items-center bg-foreground text-[10px] font-semibold text-background">{initial}</span>
        <span className="hidden max-w-28 truncate sm:block">{user.name}</span>
        <ChevronDown className={`size-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[90] w-72 border bg-background p-2 shadow-2xl">
          <div className="border-b px-3 py-3">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{user.email}</p>
            <span className="mt-2 inline-flex bg-muted px-2 py-1 font-mono text-[10px] uppercase tracking-wider">{roleLabel(user.role)}</span>
          </div>
          <nav className="py-2 text-sm">
            <MenuLink href={accountHref} icon={studioAccess ? LayoutDashboard : BookMarked} label={studioAccess ? "Dashboard" : "My account"} onNavigate={() => setOpen(false)} />
            {studioAccess && <MenuLink href="/studio/new" icon={PenLine} label="Write a release" onNavigate={() => setOpen(false)} />}
            {administrationAccess && <MenuLink href="/studio/settings" icon={Settings} label="Administration" onNavigate={() => setOpen(false)} />}
          </nav>
          <button type="button" onClick={signOut} disabled={signingOut} className="flex w-full items-center gap-2 border-t px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50">
            <LogOut className="size-4" /> {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, icon: Icon, label, onNavigate }: { href: string; icon: typeof UserRound; label: string; onNavigate: () => void }) {
  return <Link href={href} onClick={onNavigate} className="flex items-center gap-2 px-3 py-2.5 hover:bg-muted"><Icon className="size-4 text-muted-foreground" />{label}</Link>;
}
