"use client";

import { useCallback, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TableKit } from "@tiptap/extension-table";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  ChevronDown,
  Code2,
  Eye,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  MoreHorizontal,
  Pilcrow,
  Plus,
  Quote,
  Redo2,
  Save,
  Send,
  Table2,
  Underline,
  Undo2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

type SaveState = "idle" | "saving" | "saved";

const initialContent = `
  <p>Begin with a clear idea. Select this text to format it, or place the cursor on a new line and choose a block.</p>
  <h2>A section can begin here</h2>
  <p>The editor stores structured content while keeping the writing surface calm and direct.</p>
`;

export function PostEditor() {
  const [title, setTitle] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [preview, setPreview] = useState(false);
  const [blockMenu, setBlockMenu] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState("");
  const [previewHtml, setPreviewHtml] = useState(initialContent);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const queueAutosave = useCallback((editor: Editor) => {
    setSaveState("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const draft = { title, document: editor.getJSON(), updatedAt: new Date().toISOString() };
      localStorage.setItem("editorial-local-draft", JSON.stringify(draft));
      setSaveState("saved");
    }, 650);
  }, [title]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: { openOnClick: false, autolink: true },
      }),
      Highlight.configure({ multicolor: false }),
      Image.configure({ allowBase64: false, inline: false }),
      Placeholder.configure({ placeholder: "Tell your story…" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TableKit.configure({ table: { resizable: true } }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "reading-copy min-h-[55vh] focus:outline-none",
        spellcheck: "true",
      },
    },
    onUpdate: ({ editor: activeEditor }) => {
      setPreviewHtml(activeEditor.getHTML());
      queueAutosave(activeEditor);
    },
  });

  function saveNow() {
    if (!editor) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveState("saving");
    localStorage.setItem("editorial-local-draft", JSON.stringify({ title, document: editor.getJSON(), updatedAt: new Date().toISOString() }));
    setSaveState("saved");
  }

  function addLink() {
    if (!editor) return;
    const current = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Paste a URL", current ?? "https://");
    if (href === null) return;
    if (!href.trim()) editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  }

  function addImage() {
    if (!editor) return;
    const src = window.prompt("Image URL", "https://images.unsplash.com/");
    if (src) editor.chain().focus().setImage({ src, alt: "" }).run();
  }

  async function publishNow() {
    if (!editor || !title.trim()) {
      setPublishMessage("Add a post title before publishing.");
      return;
    }
    setPublishing(true);
    setPublishMessage("");
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        document: editor.getJSON(),
        status: "published",
        visibility: "public",
      }),
    });
    const result = await response.json().catch(() => null);
    setPublishing(false);
    if (!response.ok) {
      setPublishMessage(
        response.status === 401
          ? "Sign in at /login before publishing. Your local draft is safe."
          : result?.error?.message ?? "The post could not be published.",
      );
      return;
    }
    saveNow();
    setPublished(true);
    setPublishMessage(`Published at /blog/${result.data.slug}`);
  }

  const saveLabel = saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved locally" : "Draft";

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b pb-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-brand">New post</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            {saveState === "saved" ? <Check className="size-3 text-emerald-500" /> : <Save className="size-3" />}
            {saveLabel}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setPreview((value) => !value)} className="inline-flex h-9 items-center gap-2 border px-3 text-sm hover:bg-muted"><Eye className="size-4" /> {preview ? "Edit" : "Preview"}</button>
          <button type="button" onClick={saveNow} className="hidden h-9 items-center gap-2 border px-3 text-sm hover:bg-muted sm:inline-flex"><Save className="size-4" /> Save</button>
          <button type="button" onClick={() => setPublishOpen(true)} className="inline-flex h-9 items-center gap-2 bg-foreground px-3 text-sm font-medium text-background"><Send className="size-4" /> Publish</button>
        </div>
      </div>

      {!preview && (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_230px]">
          <section className="min-w-0 border bg-background shadow-[var(--shadow)]">
            <EditorToolbar editor={editor} onAddLink={addLink} onAddImage={addImage} blockMenu={blockMenu} setBlockMenu={setBlockMenu} />
            <div className="px-6 py-8 sm:px-12 sm:py-12">
              <textarea
                value={title}
                onChange={(event) => { setTitle(event.target.value); setSaveState("idle"); }}
                onBlur={saveNow}
                rows={1}
                placeholder="Post title"
                aria-label="Post title"
                className="mb-8 w-full resize-none overflow-hidden bg-transparent text-4xl font-semibold leading-tight tracking-[-0.045em] outline-none placeholder:text-muted-foreground/45 sm:text-5xl"
              />
              <div className="editor-content"><EditorContent editor={editor} /></div>
            </div>
          </section>

          <aside className="space-y-5">
            <Panel title="Post">
              <Field label="Status" value="Draft" />
              <Field label="Visibility" value="Public" />
              <Field label="Publish" value="Immediately" />
              <Field label="Author" value="Emam Hasan" />
            </Panel>
            <Panel title="Organization">
              <label className="block text-xs font-medium text-muted-foreground">Category<select className="mt-1.5 h-9 w-full border bg-background px-2 text-sm text-foreground outline-none"><option>Writing</option><option>Design</option><option>Publishing</option></select></label>
              <label className="mt-4 block text-xs font-medium text-muted-foreground">Tags<input className="mt-1.5 h-9 w-full border bg-background px-2 text-sm text-foreground outline-none" placeholder="Add a tag…" /></label>
            </Panel>
            <Panel title="Excerpt"><textarea rows={4} className="w-full resize-y border bg-background p-2 text-sm leading-5 outline-none" placeholder="Write a short summary…" /></Panel>
          </aside>
        </div>
      )}

      {preview && (
        <div className="mx-auto max-w-[760px] border bg-background px-6 py-12 shadow-[var(--shadow)] sm:px-14 sm:py-16">
          <p className="font-mono text-xs uppercase tracking-widest text-brand">Preview</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">{title || "Untitled post"}</h1>
          <p className="mt-5 text-sm text-muted-foreground">Emam Hasan · Draft preview</p>
          <div className="reading-copy mt-10" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      )}

      <AnimatePresence>
        {publishOpen && (
          <motion.div className="fixed inset-0 z-[90] grid place-items-center bg-black/45 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPublishOpen(false)}>
            <motion.div initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }} onClick={(event) => event.stopPropagation()} className="w-full max-w-md border bg-background p-6 shadow-2xl">
              <div className="flex items-start justify-between"><div><h2 className="text-lg font-semibold">Ready to publish?</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Review the URL, visibility, and timing before this post goes live.</p></div><button onClick={() => setPublishOpen(false)} aria-label="Close"><X className="size-4" /></button></div>
              <div className="mt-5 space-y-4 border-y py-5"><Field label="Post" value={title || "Untitled post"} /><Field label="URL" value={`/blog/${slugify(title) || "untitled-post"}`} /><Field label="Visibility" value="Public" /></div>
              {publishMessage && <div className={`mt-5 flex items-start gap-2 p-3 text-sm ${published ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100" : "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100"}`}>{published && <Check className="mt-0.5 size-4 shrink-0" />}{publishMessage}</div>}
              {!published && <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setPublishOpen(false)} className="h-9 border px-3 text-sm">Cancel</button><button type="button" disabled={publishing} onClick={publishNow} className="h-9 bg-foreground px-4 text-sm font-medium text-background disabled:opacity-60">{publishing ? "Publishing…" : "Publish now"}</button></div>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EditorToolbar({ editor, onAddLink, onAddImage, blockMenu, setBlockMenu }: { editor: Editor | null; onAddLink: () => void; onAddImage: () => void; blockMenu: boolean; setBlockMenu: (value: boolean) => void }) {
  if (!editor) return <div className="h-12 animate-pulse border-b bg-muted/60" />;
  const command = editor.chain().focus();
  return (
    <div className="sticky top-16 z-20 flex min-h-12 flex-wrap items-center gap-0.5 border-b bg-background/95 px-2 py-1.5 backdrop-blur">
      <div className="relative">
        <button type="button" onClick={() => setBlockMenu(!blockMenu)} className="inline-flex h-8 items-center gap-2 px-2 text-sm font-medium hover:bg-muted"><Plus className="size-4" /> Add block <ChevronDown className="size-3" /></button>
        <AnimatePresence>{blockMenu && <BlockMenu editor={editor} close={() => setBlockMenu(false)} onAddImage={onAddImage} />}</AnimatePresence>
      </div>
      <Divider />
      <Tool active={editor.isActive("bold")} label="Bold" onClick={() => command.toggleBold().run()}><Bold /></Tool>
      <Tool active={editor.isActive("italic")} label="Italic" onClick={() => command.toggleItalic().run()}><Italic /></Tool>
      <Tool active={editor.isActive("underline")} label="Underline" onClick={() => command.toggleUnderline().run()}><Underline /></Tool>
      <Tool active={editor.isActive("highlight")} label="Highlight" onClick={() => command.toggleHighlight().run()}><Highlighter /></Tool>
      <Tool active={editor.isActive("code")} label="Inline code" onClick={() => command.toggleCode().run()}><Code2 /></Tool>
      <Tool active={editor.isActive("link")} label="Link" onClick={onAddLink}><Link2 /></Tool>
      <Divider />
      <Tool active={editor.isActive({ textAlign: "left" })} label="Align left" onClick={() => command.setTextAlign("left").run()}><AlignLeft /></Tool>
      <Tool active={editor.isActive({ textAlign: "center" })} label="Align center" onClick={() => command.setTextAlign("center").run()}><AlignCenter /></Tool>
      <Tool active={editor.isActive({ textAlign: "right" })} label="Align right" onClick={() => command.setTextAlign("right").run()}><AlignRight /></Tool>
      <Divider />
      <Tool label="Undo" disabled={!editor.can().chain().focus().undo().run()} onClick={() => command.undo().run()}><Undo2 /></Tool>
      <Tool label="Redo" disabled={!editor.can().chain().focus().redo().run()} onClick={() => command.redo().run()}><Redo2 /></Tool>
      <Tool label="More"><MoreHorizontal /></Tool>
    </div>
  );
}

function BlockMenu({ editor, close, onAddImage }: { editor: Editor; close: () => void; onAddImage: () => void }) {
  const items = [
    { label: "Paragraph", hint: "Plain text", icon: Pilcrow, action: () => editor.chain().focus().setParagraph().run() },
    { label: "Heading 1", hint: "Large section", icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: "Heading 2", hint: "Section title", icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "Heading 3", hint: "Subsection", icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: "Bullet list", hint: "Unordered items", icon: List, action: () => editor.chain().focus().toggleBulletList().run() },
    { label: "Numbered list", hint: "Ordered items", icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run() },
    { label: "Quote", hint: "Pull quote", icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run() },
    { label: "Image", hint: "From a URL", icon: ImageIcon, action: onAddImage },
    { label: "Table", hint: "3 × 3 with header", icon: Table2, action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
    { label: "Section break", hint: "Visual divider", icon: Minus, action: () => editor.chain().focus().setHorizontalRule().run() },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: -4, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -3 }} className="absolute left-0 top-10 z-40 w-72 border bg-background p-2 shadow-2xl">
      <p className="px-2 pb-2 pt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">Blocks</p>
      <div className="grid max-h-80 grid-cols-2 gap-1 overflow-y-auto">
        {items.map((item) => <button key={item.label} type="button" onClick={() => { item.action(); close(); }} className="flex items-start gap-2 p-2 text-left hover:bg-muted"><item.icon className="mt-0.5 size-4 shrink-0" /><span><span className="block text-xs font-medium">{item.label}</span><span className="block text-[10px] leading-4 text-muted-foreground">{item.hint}</span></span></button>)}
      </div>
      <p className="mt-2 border-t px-2 pt-2 text-[10px] text-muted-foreground">Tip: the final editor also opens this menu when you type <kbd className="border px-1">/</kbd>.</p>
    </motion.div>
  );
}

function Tool({ children, label, active, disabled, onClick }: { children: React.ReactElement<{ className?: string }>; label: string; active?: boolean; disabled?: boolean; onClick?: () => void }) {
  return <button type="button" title={label} aria-label={label} aria-pressed={active} disabled={disabled} onClick={onClick} className={cn("grid size-8 place-items-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30", active && "bg-muted text-foreground")}>{children && <span className="[&>svg]:size-4">{children}</span>}</button>;
}

function Divider() { return <span className="mx-1 h-5 w-px bg-border" />; }
function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <section className="border bg-background p-4"><h2 className="mb-4 text-sm font-semibold">{title}</h2>{children}</section>; }
function Field({ label, value }: { label: string; value: string }) { return <div className="flex items-start justify-between gap-3 border-b py-2 text-xs last:border-b-0"><span className="text-muted-foreground">{label}</span><span className="max-w-[65%] break-all text-right font-medium">{value}</span></div>; }
function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
