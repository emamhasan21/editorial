import type { Metadata } from "next";
import { PostEditor } from "@/components/editor/post-editor";
import { getAuthors } from "@/data/library";

export const metadata: Metadata = { title: "New post" };

export default async function NewPostPage() {
  const authors = await getAuthors();
  return <PostEditor authors={authors.map(({ id, name, kind }) => ({ id, name, kind }))} />;
}
