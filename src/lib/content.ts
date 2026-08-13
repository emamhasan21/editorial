export type NavigationSection = {
  title: string;
  items: { title: string; href: string; badge?: string }[];
};

export const navigation: NavigationSection[] = [
  {
    title: "পাঠাগার",
    items: [
      { title: "শুরু", href: "/" },
      { title: "সাম্প্রতিক লেখা", href: "/blog" },
      { title: "বিষয়", href: "/topics" },
    ],
  },
  {
    title: "প্রকাশনা",
    items: [
      { title: "লেখার নির্দেশিকা", href: "/guides/writing" },
      { title: "ব্লক সংগ্রহ", href: "/guides/blocks", badge: "নতুন" },
      { title: "ছবি ও মাধ্যম", href: "/guides/media" },
      { title: "সংস্করণ", href: "/guides/revisions" },
    ],
  },
  {
    title: "লেখকের ঘর",
    items: [
      { title: "স্টুডিও", href: "/studio" },
      { title: "নতুন লেখা", href: "/studio/new" },
      { title: "সেটিংস", href: "/studio/settings" },
    ],
  },
];

export const articles = [
  {
    slug: "নিজের-শর্তে-প্রকাশনা",
    title: "নিজের শর্তে প্রকাশ করার আরও সুন্দর পথ",
    excerpt: "আধুনিক অ্যাপের গতি, মনোযোগী সম্পাদনার ছন্দ এবং পাঠকের জন্য নির্ভার এক অভিজ্ঞতা।",
    date: "১৩ আগস্ট ২০২৬",
    minutes: "৬ মিনিটের পাঠ",
    category: "ভাবনা",
    accent: "#c8ff4d",
  },
  {
    slug: "দীর্ঘ-পাঠের-নকশা",
    title: "দীর্ঘ পাঠের জন্য নকশা",
    excerpt: "হরফ, ছন্দ আর ছোট ছোট গতির মুহূর্ত—যা পাঠককে লেখার ভেতরে ধরে রাখে।",
    date: "৯ আগস্ট ২০২৬",
    minutes: "৮ মিনিটের পাঠ",
    category: "নকশা",
    accent: "#a8b7ff",
  },
  {
    slug: "ব্লকই-মাধ্যম",
    title: "ব্লকই যখন প্রকাশের মাধ্যম",
    excerpt: "গুছানো কনটেন্ট কীভাবে লেখককে স্বাধীনতা দেয়, অথচ সম্পাদককে জটিল করে না।",
    date: "২ আগস্ট ২০২৬",
    minutes: "৫ মিনিটের পাঠ",
    category: "প্রকাশনা",
    accent: "#ff9fc7",
  },
];
