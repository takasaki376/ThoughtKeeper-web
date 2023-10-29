"use client"
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";

// import RichEditorToolbar from "./rich-editor-toolbar";

export const Tiptap = () => {
  const editor = useEditor({
    content: "<p>Hello World! 🌎️</p>",
    editorProps: {
      attributes: {
        class: "prose prose-base m-5 focus:outline-none text-left",
      },
    },
    extensions: [StarterKit],
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="mx-auto mt-10 w-2/3 border-2">
        {/* <RichEditorToolbar editor={editor} /> */}
        <div className="mt-3 h-[70vh] overflow-hidden overflow-y-scroll p-3">
            <EditorContent editor={editor} />
        </div>
    </div>
  );
};
