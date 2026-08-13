import type { Metadata } from "next";
import { PostEditor } from "@/components/editor/post-editor";

export const metadata: Metadata = { title: "New post" };

export default function NewPostPage() {
  return <PostEditor />;
}
