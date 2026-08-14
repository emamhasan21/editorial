export type NavigationSection = {
  title: string;
  items: { title: string; href: string; badge?: string }[];
};

export const navigation: NavigationSection[] = [
  {
    title: "পাঠাগার",
    items: [
      { title: "প্রথম পাতা", href: "/" },
      { title: "সকল বই", href: "/books" },
      { title: "বইমালা", href: "/series" },
      { title: "নতুন প্রকাশ", href: "/releases" },
    ],
  },
  {
    title: "লেখকসম্ভার",
    items: [
      { title: "ধ্রুপদি লেখক", href: "/writers#classic" },
      { title: "সমকালীন লেখক", href: "/writers#current" },
      { title: "সকল লেখক", href: "/writers" },
    ],
  },
  {
    title: "সাহিত্য বিভাগ",
    items: [
      { title: "ছোটগল্প", href: "/releases?type=story" },
      { title: "কবিতা", href: "/releases?type=poem" },
      { title: "প্রবন্ধ", href: "/releases?type=essay" },
      { title: "সাক্ষাৎকার", href: "/releases?type=interview" },
      { title: "বই আলোচনা", href: "/releases?type=review" },
      { title: "বিষয়ভিত্তিক সংগ্রহ", href: "/topics" },
    ],
  },
];

export const articles = [
  {
    slug: "a-better-way-to-publish",
    title: "A better way to publish on your own terms",
    excerpt:
      "The speed of a modern application with the calm, deliberate rhythm of a great reading experience.",
    date: "August 13, 2026",
    minutes: "6 min read",
    category: "Notes",
    accent: "#d9ffb8",
  },
  {
    slug: "designing-for-the-long-read",
    title: "Designing for the long read",
    excerpt:
      "Typography, pacing, and tiny moments of motion that help a reader stay in the story.",
    date: "August 9, 2026",
    minutes: "8 min read",
    category: "Design",
    accent: "#c9dcff",
  },
  {
    slug: "the-block-is-the-medium",
    title: "The block is the medium",
    excerpt:
      "Why structured content gives writers freedom without turning the editor into a control panel.",
    date: "August 2, 2026",
    minutes: "5 min read",
    category: "Publishing",
    accent: "#ffd5e5",
  },
];
