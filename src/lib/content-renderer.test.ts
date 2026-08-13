import { describe, expect, it } from "vitest";
import { renderDocument, slugify } from "./content-renderer";

describe("content renderer", () => {
  it("renders semantic, sanitized HTML and a table of contents", () => {
    const result = renderDocument({
      type: "doc",
      content: [
        { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "A useful section" }] },
        { type: "paragraph", content: [{ type: "text", text: "Readable body copy." }] },
      ],
    });
    expect(result.html).toContain('<h2 id="a-useful-section">A useful section</h2>');
    expect(result.plainText).toContain("Readable body copy.");
    expect(result.tableOfContents).toEqual([{ id: "a-useful-section", text: "A useful section", level: 2 }]);
  });

  it("keeps Bangla letters in slugs", () => {
    expect(slugify("বাংলা সাহিত্যের নতুন পথ")).toBe("বাংলা-সাহিত্যের-নতুন-পথ");
  });

  it("renders literary blocks without discarding their semantics", () => {
    const result = renderDocument({
      type: "doc",
      content: [
        { type: "verse", content: [{ type: "text", text: "A line of verse" }] },
        { type: "footnote", content: [{ type: "text", text: "A source note" }] },
        { type: "authorNote", content: [{ type: "text", text: "From the author" }] },
        { type: "spoiler", content: [{ type: "text", text: "A hidden turn" }] },
      ],
    });
    expect(result.html).toContain('data-type="verse"');
    expect(result.html).toContain('class="literary-footnote"');
    expect(result.html).toContain('data-type="authorNote"');
    expect(result.html).toContain('class="literary-spoiler"');
  });
});
