"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { canAccessStudio } from "@/lib/permissions";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const result = mode === "signin"
      ? await authClient.signIn.email({ email, password })
      : await authClient.signUp.email({ name: String(form.get("name")), email, password });
    setPending(false);
    if (result.error) { setError(result.error.message ?? "Authentication failed"); return; }
    const session = await authClient.getSession();
    const role = (session.data?.user as { role?: string } | undefined)?.role;
    router.push(canAccessStudio(role) ? "/studio" : "/account");
    router.refresh();
  }

  return (
    <form method="post" onSubmit={submit} className="mt-8 space-y-4">
      {mode === "signup" && <label className="block text-sm font-medium">Display name<input name="name" required minLength={2} className="mt-1.5 h-11 w-full border bg-background px-3 outline-none focus:border-brand" placeholder="Your name" /></label>}
      <label className="block text-sm font-medium">Email<input name="email" required type="email" autoComplete="email" className="mt-1.5 h-11 w-full border bg-background px-3 outline-none focus:border-brand" placeholder="you@example.com" /></label>
      <label className="block text-sm font-medium">Password<input name="password" required minLength={10} type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} className="mt-1.5 h-11 w-full border bg-background px-3 outline-none focus:border-brand" placeholder="At least 10 characters" /></label>
      {error && <p role="alert" className="border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100">{error}</p>}
      <button type="submit" disabled={pending} className="flex h-11 w-full items-center justify-center gap-2 bg-foreground text-sm font-medium text-background disabled:opacity-60">{pending ? <LoaderCircle className="size-4 animate-spin" /> : <>{mode === "signin" ? "Sign in" : "Create account"}<ArrowRight className="size-4" /></>}</button>
      <button type="button" onClick={() => setMode((value) => value === "signin" ? "signup" : "signin")} className="w-full text-sm text-muted-foreground hover:text-foreground">{mode === "signin" ? "New reader? Create an account" : "Already have an account? Sign in"}</button>
      {mode === "signup" && <p className="border bg-muted/40 p-3 text-xs leading-5 text-muted-foreground">New public accounts begin as readers. An owner or administrator must assign a publishing role before the Studio becomes available.</p>}
    </form>
  );
}
