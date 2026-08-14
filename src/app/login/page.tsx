import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { auth } from "@/lib/auth";
import { canAccessStudio } from "@/lib/permissions";

export const metadata: Metadata = { title: "Writer sign in" };

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect(canAccessStudio(session.user.role) ? "/studio" : "/account");
  return (
    <main className="site-container grid min-h-[calc(100vh-4rem)] place-items-center py-12">
      <div className="w-full max-w-md border bg-card p-6 shadow-[var(--shadow)] sm:p-9">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold"><span className="grid size-7 place-items-center bg-foreground text-xs text-background">E</span>editorial</Link>
        <h1 className="mt-8 text-3xl font-semibold tracking-[-0.04em]">Enter the studio.</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Owners, administrators, editors, and writers sign in here with their assigned email and password.</p>
        <AuthForm />
      </div>
    </main>
  );
}
