"use client"
import BulletList from "@tiptap/extension-bullet-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export const Tiptap = () => {
  const editor = useEditor({
    content: `
      <ul>
        <li></li>
      </ul>
    `,
    editorProps: {
      attributes: {
        class: "m-5 focus:outline-none",
      },
    },
    extensions: [StarterKit, BulletList],
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="mx-auto mt-10 w-2/3 border-2">
      <div className="mt-3 h-[70vh] overflow-hidden overflow-y-scroll p-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
