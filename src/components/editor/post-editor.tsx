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
  <p>একটি স্পষ্ট ভাবনা দিয়ে শুরু করুন। সাজাতে এই লেখাটি নির্বাচন করুন, অথবা নতুন লাইনে কার্সর রেখে একটি ব্লক বেছে নিন।</p>
  <h2>এখান থেকে একটি নতুন অংশ শুরু হতে পারে</h2>
  <p>সম্পাদকটি লেখার জায়গা সহজ ও শান্ত রেখেই কনটেন্টকে গুছিয়ে সংরক্ষণ করে।</p>
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
      Placeholder.configure({ placeholder: "আপনার গল্প বলুন…" }),
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
    const href = window.prompt("লিংকটি দিন", current ?? "https://");
    if (href === null) return;
    if (!href.trim()) editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  }

  function addImage() {
    if (!editor) return;
    const src = window.prompt("ছবির লিংক", "https://images.unsplash.com/");
    if (src) editor.chain().focus().setImage({ src, alt: "" }).run();
  }

  async function publishNow() {
    if (!editor || !title.trim()) {
      setPublishMessage("প্রকাশ করার আগে লেখার শিরোনাম দিন।");
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
          ? "প্রকাশ করার আগে /login থেকে প্রবেশ করুন। আপনার স্থানীয় খসড়া নিরাপদ আছে।"
          : result?.error?.message ?? "লেখাটি প্রকাশ করা যায়নি।",
      );
      return;
    }
    saveNow();
    setPublished(true);
    setPublishMessage(`/blog/${result.data.slug} ঠিকানায় প্রকাশিত হয়েছে`);
  }

  const saveLabel = saveState === "saving" ? "সংরক্ষণ হচ্ছে…" : saveState === "saved" ? "স্থানীয়ভাবে সংরক্ষিত" : "খসড়া";

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b pb-5">
        <div>
          <p className="eyebrow text-brand">নতুন লেখা</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            {saveState === "saved" ? <Check className="size-3 text-emerald-500" /> : <Save className="size-3" />}
            {saveLabel}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setPreview((value) => !value)} className="inline-flex h-9 items-center gap-2 border px-3 text-sm hover:bg-muted"><Eye className="size-4" /> {preview ? "সম্পাদনা" : "প্রিভিউ"}</button>
          <button type="button" onClick={saveNow} className="hidden h-9 items-center gap-2 border px-3 text-sm hover:bg-muted sm:inline-flex"><Save className="size-4" /> সংরক্ষণ</button>
          <button type="button" onClick={() => setPublishOpen(true)} className="inline-flex h-9 items-center gap-2 bg-foreground px-3 text-sm font-medium text-background"><Send className="size-4" /> প্রকাশ</button>
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
                placeholder="লেখার শিরোনাম"
                aria-label="লেখার শিরোনাম"
                className="mb-8 w-full resize-none overflow-hidden bg-transparent text-4xl font-semibold leading-tight tracking-[-0.045em] outline-none placeholder:text-muted-foreground/45 sm:text-5xl"
              />
              <div className="editor-content"><EditorContent editor={editor} /></div>
            </div>
          </section>

          <aside className="space-y-5">
            <Panel title="লেখা">
              <Field label="অবস্থা" value="খসড়া" />
              <Field label="দৃশ্যমানতা" value="সবার জন্য" />
              <Field label="প্রকাশ" value="এখনই" />
              <Field label="লেখক" value="Emam Hasan" />
            </Panel>
            <Panel title="গুছিয়ে রাখুন">
              <label className="block text-xs font-medium text-muted-foreground">বিষয়<select className="mt-1.5 h-9 w-full border bg-background px-2 text-sm text-foreground outline-none"><option>সাহিত্য</option><option>নকশা</option><option>প্রকাশনা</option></select></label>
              <label className="mt-4 block text-xs font-medium text-muted-foreground">ট্যাগ<input className="mt-1.5 h-9 w-full border bg-background px-2 text-sm text-foreground outline-none" placeholder="ট্যাগ যোগ করুন…" /></label>
            </Panel>
            <Panel title="সারাংশ"><textarea rows={4} className="w-full resize-y border bg-background p-2 text-sm leading-6 outline-none" placeholder="একটি ছোট সারাংশ লিখুন…" /></Panel>
          </aside>
        </div>
      )}

      {preview && (
        <div className="mx-auto max-w-[760px] border bg-background px-6 py-12 shadow-[var(--shadow)] sm:px-14 sm:py-16">
          <p className="eyebrow text-brand">প্রিভিউ</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">{title || "শিরোনামহীন লেখা"}</h1>
          <p className="mt-5 text-sm text-muted-foreground">Emam Hasan · খসড়া প্রিভিউ</p>
          <div className="reading-copy mt-10" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </div>
      )}

      <AnimatePresence>
        {publishOpen && (
          <motion.div className="fixed inset-0 z-[90] grid place-items-center bg-black/45 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPublishOpen(false)}>
            <motion.div initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }} onClick={(event) => event.stopPropagation()} className="w-full max-w-md border bg-background p-6 shadow-2xl">
              <div className="flex items-start justify-between"><div><h2 className="text-lg font-semibold">প্রকাশের জন্য প্রস্তুত?</h2><p className="mt-1 text-sm leading-7 text-muted-foreground">লেখাটি সবার সামনে যাওয়ার আগে ঠিকানা, দৃশ্যমানতা ও সময় দেখে নিন।</p></div><button onClick={() => setPublishOpen(false)} aria-label="বন্ধ করুন"><X className="size-4" /></button></div>
              <div className="mt-5 space-y-4 border-y py-5"><Field label="লেখা" value={title || "শিরোনামহীন লেখা"} /><Field label="ঠিকানা" value={`/blog/${slugify(title) || "শিরোনামহীন-লেখা"}`} /><Field label="দৃশ্যমানতা" value="সবার জন্য" /></div>
              {publishMessage && <div className={`mt-5 flex items-start gap-2 p-3 text-sm ${published ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100" : "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100"}`}>{published && <Check className="mt-0.5 size-4 shrink-0" />}{publishMessage}</div>}
              {!published && <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setPublishOpen(false)} className="h-9 border px-3 text-sm">বাতিল</button><button type="button" disabled={publishing} onClick={publishNow} className="h-9 bg-foreground px-4 text-sm font-medium text-background disabled:opacity-60">{publishing ? "প্রকাশ হচ্ছে…" : "এখনই প্রকাশ"}</button></div>}
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
        <button type="button" onClick={() => setBlockMenu(!blockMenu)} className="inline-flex h-8 items-center gap-2 px-2 text-sm font-medium hover:bg-muted"><Plus className="size-4" /> ব্লক যোগ করুন <ChevronDown className="size-3" /></button>
        <AnimatePresence>{blockMenu && <BlockMenu editor={editor} close={() => setBlockMenu(false)} onAddImage={onAddImage} />}</AnimatePresence>
      </div>
      <Divider />
      <Tool active={editor.isActive("bold")} label="গাঢ়" onClick={() => command.toggleBold().run()}><Bold /></Tool>
      <Tool active={editor.isActive("italic")} label="তির্যক" onClick={() => command.toggleItalic().run()}><Italic /></Tool>
      <Tool active={editor.isActive("underline")} label="নিচে দাগ" onClick={() => command.toggleUnderline().run()}><Underline /></Tool>
      <Tool active={editor.isActive("highlight")} label="রঙে চিহ্নিত" onClick={() => command.toggleHighlight().run()}><Highlighter /></Tool>
      <Tool active={editor.isActive("code")} label="লাইনের মধ্যে কোড" onClick={() => command.toggleCode().run()}><Code2 /></Tool>
      <Tool active={editor.isActive("link")} label="লিংক" onClick={onAddLink}><Link2 /></Tool>
      <Divider />
      <Tool active={editor.isActive({ textAlign: "left" })} label="বামে" onClick={() => command.setTextAlign("left").run()}><AlignLeft /></Tool>
      <Tool active={editor.isActive({ textAlign: "center" })} label="মাঝে" onClick={() => command.setTextAlign("center").run()}><AlignCenter /></Tool>
      <Tool active={editor.isActive({ textAlign: "right" })} label="ডানে" onClick={() => command.setTextAlign("right").run()}><AlignRight /></Tool>
      <Divider />
      <Tool label="ফিরিয়ে নিন" disabled={!editor.can().chain().focus().undo().run()} onClick={() => command.undo().run()}><Undo2 /></Tool>
      <Tool label="আবার করুন" disabled={!editor.can().chain().focus().redo().run()} onClick={() => command.redo().run()}><Redo2 /></Tool>
      <Tool label="আরও"><MoreHorizontal /></Tool>
    </div>
  );
}

function BlockMenu({ editor, close, onAddImage }: { editor: Editor; close: () => void; onAddImage: () => void }) {
  const items = [
    { label: "অনুচ্ছেদ", hint: "সাধারণ লেখা", icon: Pilcrow, action: () => editor.chain().focus().setParagraph().run() },
    { label: "শিরোনাম ১", hint: "বড় অংশ", icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: "শিরোনাম ২", hint: "অংশের নাম", icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "শিরোনাম ৩", hint: "উপ-অংশ", icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: "বুলেট তালিকা", hint: "ক্রমহীন বিষয়", icon: List, action: () => editor.chain().focus().toggleBulletList().run() },
    { label: "সংখ্যার তালিকা", hint: "ক্রমিক বিষয়", icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run() },
    { label: "উদ্ধৃতি", hint: "আলাদা উদ্ধৃতি", icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run() },
    { label: "ছবি", hint: "লিংক থেকে", icon: ImageIcon, action: onAddImage },
    { label: "টেবিল", hint: "শিরোনামসহ ৩ × ৩", icon: Table2, action: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
    { label: "অংশ বিভাজন", hint: "দৃশ্যমান রেখা", icon: Minus, action: () => editor.chain().focus().setHorizontalRule().run() },
  ];
  return (
    <motion.div initial={{ opacity: 0, y: -4, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -3 }} className="absolute left-0 top-10 z-40 w-72 border bg-background p-2 shadow-2xl">
      <p className="px-2 pb-2 pt-1 text-xs font-medium tracking-widest text-muted-foreground">ব্লক</p>
      <div className="grid max-h-80 grid-cols-2 gap-1 overflow-y-auto">
        {items.map((item) => <button key={item.label} type="button" onClick={() => { item.action(); close(); }} className="flex items-start gap-2 p-2 text-left hover:bg-muted"><item.icon className="mt-0.5 size-4 shrink-0" /><span><span className="block text-xs font-medium">{item.label}</span><span className="block text-[10px] leading-4 text-muted-foreground">{item.hint}</span></span></button>)}
      </div>
      <p className="mt-2 border-t px-2 pt-2 text-[10px] text-muted-foreground">ইঙ্গিত: <kbd className="border px-1">/</kbd> লিখলেও এই মেনু খুলবে।</p>
    </motion.div>
  );
}

function Tool({ children, label, active, disabled, onClick }: { children: React.ReactElement<{ className?: string }>; label: string; active?: boolean; disabled?: boolean; onClick?: () => void }) {
  return <button type="button" title={label} aria-label={label} aria-pressed={active} disabled={disabled} onClick={onClick} className={cn("grid size-8 place-items-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30", active && "bg-muted text-foreground")}>{children && <span className="[&>svg]:size-4">{children}</span>}</button>;
}

function Divider() { return <span className="mx-1 h-5 w-px bg-border" />; }
function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <section className="border bg-background p-4"><h2 className="mb-4 text-sm font-semibold">{title}</h2>{children}</section>; }
function Field({ label, value }: { label: string; value: string }) { return <div className="flex items-start justify-between gap-3 border-b py-2 text-xs last:border-b-0"><span className="text-muted-foreground">{label}</span><span className="max-w-[65%] break-all text-right font-medium">{value}</span></div>; }
function slugify(value: string) { return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\u0980-\u09ff]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 210); }
