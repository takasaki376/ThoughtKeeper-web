"use client"
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";

import RichEditorToolbar from "./RichEditorToolbar";

export const Tiptap = () => {
  const editor = useEditor({
    content: ``,
    editorProps: {
      attributes: {
        class: "prose prose-base m-5 focus:outline-none text-left",
      },
    },
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="mx-auto mt-10 w-2/3 border-2">
        <RichEditorToolbar editor={editor} />
        <div className="mt-3 h-[70vh] overflow-hidden overflow-y-scroll p-3">
            <EditorContent editor={editor} />
        </div>
    </div>
  );
};
