"use client"
import Document from '@tiptap/extension-document'
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit';

import RichEditorToolbar from "./RichEditorToolbar";

export const Tiptap = () => {
  const editor = useEditor({
    content: `<li>Enter something ...</li>`,
    editorProps: {
      attributes: {
        class: "m-5 focus:outline-none",
      },
    },
    extensions: [
      StarterKit,
      Document,
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
