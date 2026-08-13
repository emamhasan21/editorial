import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans_Bengali, Noto_Serif_Bengali } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const banglaSans = Noto_Sans_Bengali({
  variable: "--font-bangla-sans",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});

const banglaSerif = Noto_Serif_Bengali({
  variable: "--font-bangla-serif",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "সম্পাদকীয় — স্বাধীন বাংলা প্রকাশনা",
    template: "%s — সম্পাদকীয়",
  },
  description:
    "বাংলা লেখক ও পাঠকের জন্য দ্রুত, স্বনির্ভর ব্লক-ভিত্তিক প্রকাশনা।",
};

const themeScript = `
  try {
    const stored = localStorage.getItem('editorial-theme');
    const theme = stored || 'dark';
    document.documentElement.dataset.theme = theme;
  } catch (_) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="bn"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${banglaSans.variable} ${banglaSerif.variable} ${geistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
