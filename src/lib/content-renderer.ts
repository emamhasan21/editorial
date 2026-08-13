import type { JSONContent } from "@tiptap/core";
import { generateHTML } from "@tiptap/html/server";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TableKit } from "@tiptap/extension-table";
import sanitizeHtml from "sanitize-html";

const extensions = [
  StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
  Highlight,
  Image,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  TableKit,
];

export type TocEntry = { id: string; text: string; level: number };

export function renderDocument(document: JSONContent) {
  const rawHtml = generateHTML(document, extensions);
  const sanitizedHtml = sanitizeHtml(rawHtml, {
    allowedTags: [
      "p", "h1", "h2", "h3", "strong", "em", "u", "s", "mark", "code", "pre",
      "blockquote", "ul", "ol", "li", "a", "img", "hr", "br", "table", "thead",
      "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      "*": ["style"],
    },
    allowedStyles: {
      "*": { "text-align": [/^left$/, /^center$/, /^right$/, /^justify$/] },
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }, true),
      img: sanitizeHtml.simpleTransform("img", { loading: "lazy" }, true),
    },
  });

  const tableOfContents: TocEntry[] = [];
  walk(document, (node) => {
    if (node.type === "heading" && typeof node.attrs?.level === "number") {
      const text = textFromNode(node).trim();
      if (text) tableOfContents.push({ id: slugify(text), text, level: node.attrs.level });
    }
  });

  let headingIndex = 0;
  const html = sanitizedHtml.replace(/<h([1-3])([^>]*)>/g, (tag) => {
    const entry = tableOfContents[headingIndex++];
    return entry ? tag.replace(">", ` id="${entry.id}">`) : tag;
  });

  return {
    html,
    plainText: textFromNode(document).replace(/\s+/g, " ").trim(),
    tableOfContents,
  };
}

function walk(node: JSONContent, visit: (node: JSONContent) => void) {
  visit(node);
  node.content?.forEach((child) => walk(child, visit));
}

function textFromNode(node: JSONContent): string {
  if (node.type === "text") return node.text ?? "";
  return node.content?.map(textFromNode).join(" ") ?? "";
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0980-\u09ff]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 210);
}
