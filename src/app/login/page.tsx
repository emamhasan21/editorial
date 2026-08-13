import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { auth } from "@/lib/auth";

export const metadata: Metadata = { title: "লেখক প্রবেশ" };

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/studio");
  return (
    <main className="site-container grid min-h-[calc(100vh-4rem)] place-items-center py-12">
      <div className="w-full max-w-md border bg-card p-6 shadow-[var(--shadow)] sm:p-9">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold"><span className="grid size-8 place-items-center rounded-full bg-foreground text-xs text-background">স</span>সম্পাদকীয়</Link>
        <h1 className="mt-8 text-3xl font-semibold tracking-[-0.04em]">স্টুডিওতে প্রবেশ করুন।</h1>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">লিখতে, সম্পাদনা করতে, প্রকাশ করতে এবং দলের সঙ্গে কাজ করতে সাইন ইন করুন।</p>
        <AuthForm />
      </div>
    </main>
  );
}
