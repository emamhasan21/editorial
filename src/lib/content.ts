export type NavigationSection = {
  title: string;
  items: { title: string; href: string; badge?: string }[];
};

export const navigation: NavigationSection[] = [
  {
    title: "Discover",
    items: [
      { title: "Introduction", href: "/" },
      { title: "Latest stories", href: "/blog" },
      { title: "Standalone releases", href: "/releases" },
      { title: "Topics", href: "/topics" },
    ],
  },
  {
    title: "Library",
    items: [
      { title: "Books", href: "/books" },
      { title: "Series", href: "/series" },
      { title: "Writers", href: "/writers" },
    ],
  },
  {
    title: "Publishing",
    items: [
      { title: "Writing guide", href: "/guides/writing" },
      { title: "Block library", href: "/guides/blocks", badge: "New" },
      { title: "Media", href: "/guides/media" },
      { title: "Revisions", href: "/guides/revisions" },
    ],
  },
  {
    title: "Workspace",
    items: [
      { title: "Studio", href: "/studio" },
      { title: "New release", href: "/studio/new" },
      { title: "New chapter", href: "/studio/chapters/new" },
      { title: "Settings", href: "/studio/settings" },
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
