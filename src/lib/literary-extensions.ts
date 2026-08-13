import { mergeAttributes, Node } from "@tiptap/core";

function literaryBlock(name: string, tag: "div" | "aside", className: string) {
  return Node.create({
    name,
    group: "block",
    content: "inline*",
    defining: true,
    parseHTML() {
      return [{ tag: `${tag}[data-type="${name}"]` }];
    },
    renderHTML({ HTMLAttributes }) {
      return [
        tag,
        mergeAttributes(HTMLAttributes, {
          "data-type": name,
          class: className,
        }),
        0,
      ];
    },
  });
}

export const Verse = literaryBlock("verse", "div", "literary-verse");
export const Footnote = literaryBlock("footnote", "aside", "literary-footnote");
export const AuthorNote = literaryBlock("authorNote", "aside", "literary-author-note");
export const Spoiler = literaryBlock("spoiler", "div", "literary-spoiler");
