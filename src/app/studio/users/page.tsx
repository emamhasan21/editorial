import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { UserRoleControl } from "@/components/studio/user-role-control";
import { auth } from "@/lib/auth";
import { asSystemRole, canManageRoles, roleLabel } from "@/lib/permissions";

export const metadata: Metadata = { title: "Users & roles · Studio" };
export const dynamic = "force-dynamic";

export default async function UsersStudioPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  if (!canManageRoles(session.user.role)) redirect("/studio");
  const accounts = await db.select({ id: users.id, name: users.name, email: users.email, username: users.username, role: users.role, createdAt: users.createdAt }).from(users).orderBy(asc(users.name));

  return (
    <div className="mx-auto max-w-6xl">
      <header className="border-b pb-6"><p className="font-mono text-xs uppercase tracking-widest text-brand">Administration</p><h1 className="mt-2 text-3xl font-semibold">Users & roles</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Reader accounts can be promoted to contributor, writer, editor, administrator, or owner. Your own role and protected owner accounts cannot be changed accidentally.</p></header>
      <div className="mt-8 border">
        {accounts.map((account) => {
          const isSelf = account.id === session.user.id;
          const protectedOwner = account.role === "owner" && session.user.role !== "owner";
          return <div key={account.id} className="grid gap-4 border-b p-4 last:border-0 md:grid-cols-[minmax(0,1fr)_170px_280px] md:items-center"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="truncate font-medium">{account.name}</p>{isSelf && <span className="bg-muted px-2 py-0.5 text-[10px] uppercase">You</span>}</div><p className="mt-1 truncate text-xs text-muted-foreground">{account.email}{account.username ? ` · @${account.username}` : ""}</p></div><div><span className="border px-2 py-1 font-mono text-[10px] uppercase tracking-wider">{roleLabel(account.role)}</span><p className="mt-2 text-[10px] text-muted-foreground">Joined {account.createdAt.toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })}</p></div><UserRoleControl userId={account.id} currentRole={asSystemRole(account.role)} disabled={isSelf || protectedOwner} /></div>;
        })}
      </div>
    </div>
  );
}
