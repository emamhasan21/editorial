import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { StudioNav } from "@/components/studio-nav";
import { auth } from "@/lib/auth";

export default async function StudioLayout({ children }: LayoutProps<"/studio">) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  return (
    <div className="site-container min-h-[calc(100vh-4rem)] lg:grid lg:grid-cols-[210px_minmax(0,1fr)]">
      <aside className="border-b lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r">
        <div className="hidden px-7 pb-2 pt-8 lg:block">
          <p className="eyebrow text-muted-foreground">লেখকের ঘর</p>
          <p className="mt-1 font-semibold">সম্পাদকীয় স্টুডিও</p>
        </div>
        <StudioNav />
      </aside>
      <main className="min-w-0 px-0 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
