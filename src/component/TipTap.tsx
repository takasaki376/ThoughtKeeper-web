"use client";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface TiptapProps {
  onChange: (value: string) => void;
  value: string;
}

export const Tiptap = ({ onChange, value }: TiptapProps) => {
  const editor = useEditor({
    content: value, // 初期コンテンツを設定
    editable: true, // エディタがすぐに入力可能
    extensions: [StarterKit, BulletList, ListItem],
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getHTML();
      onChange(updatedContent);
    },
  });

  useEffect(() => {
    if (editor && !editor.isDestroyed && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="mx-auto mt-10 w-2/3 border-2">
      <div className="mt-3 h-[70vh] overflow-hidden overflow-y-scroll p-3">
        {/* エディタが設定されるまでは表示を一時停止する */}
        {editor ? <EditorContent editor={editor} /> : <p>Loading...</p>}
      </div>
    </div>
  );
};
