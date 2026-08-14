import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { StudioNav } from "@/components/studio-nav";
import { auth } from "@/lib/auth";
import { canAccessStudio, roleLabel } from "@/lib/permissions";

export default async function StudioLayout({ children }: LayoutProps<"/studio">) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !canAccessStudio(session.user.role)) redirect("/login");
  return (
    <div className="site-container min-h-[calc(100vh-4rem)] lg:grid lg:grid-cols-[210px_minmax(0,1fr)]">
      <aside className="border-b bg-muted/15 lg:sticky lg:top-16 lg:flex lg:h-[calc(100vh-4rem)] lg:flex-col lg:border-b-0 lg:border-r">
        <div className="hidden border-b px-7 pb-5 pt-8 lg:block">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Workspace</p>
          <p className="mt-1 font-semibold">Editorial Studio</p>
        </div>
        <StudioNav role={session.user.role} />
        <div className="mt-auto hidden border-t p-5 lg:block">
          <p className="truncate text-sm font-medium">{session.user.name}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">{session.user.email}</p>
          <span className="mt-2 inline-flex border bg-background px-2 py-1 font-mono text-[9px] uppercase tracking-wider">{roleLabel(session.user.role)}</span>
        </div>
      </aside>
      <main className="min-w-0 px-0 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
