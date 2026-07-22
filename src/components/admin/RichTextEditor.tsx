"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Undo,
  Redo,
  Heading2,
  Heading3,
} from "lucide-react";

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`rounded p-1.5 hover:bg-primary-light disabled:opacity-30 ${
        active ? "bg-primary-light text-primary-dark" : "text-ink/70"
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  compact = false,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  compact?: boolean;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: false }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          class: "text-primary underline",
        },
      }),
      Placeholder.configure({ placeholder: placeholder ?? "Start writing…" }),
    ],
    content: value,
    immediatelyRender: false, // avoids an SSR/hydration mismatch warning in Next.js
    editorProps: {
      attributes: {
        class: compact
          ? "prose-sm max-h-16 min-h-[2.5rem] overflow-y-auto max-w-none rounded-b-md border border-t-0 border-border px-2 py-1.5 text-xs focus:outline-none"
          : "prose-sm min-h-[160px] max-w-none rounded-b-md border border-t-0 border-border px-3 py-2 text-sm focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  function setLink() {
    const url = window.prompt("Link URL");
    if (url === null) return;

    const trimmed = url.trim();
    if (trimmed === "") {
      editor?.chain().focus().unsetLink().run();
      return;
    }

    // Only allow http(s) links and same-site relative paths — blocks
    // javascript:, data:, and other unexpected schemes at entry, as a
    // first layer alongside the DOMPurify sanitization already applied
    // on save.
    const isSafe = /^https?:\/\//i.test(trimmed) || trimmed.startsWith("/");
    if (!isSafe) {
      window.alert(
        "Please enter a full https:// URL or a relative path starting with /",
      );
      return;
    }

    editor?.chain().focus().setLink({ href: trimmed }).run();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 rounded-t-md border border-border bg-surface p-1.5">
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Link"
          active={editor.isActive("link")}
          onClick={setLink}
        >
          <LinkIcon size={16} />
        </ToolbarButton>
        <span className="mx-1 h-4 w-px bg-border" />
        <ToolbarButton
          label="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo size={16} />
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo size={16} />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
