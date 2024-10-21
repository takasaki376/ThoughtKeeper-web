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
    content:
      value ||
      `
      <ul>
        <li></li>
      </ul>
    `, // 初期コンテンツとして箇条書きを設定
    extensions: [StarterKit, BulletList, ListItem],
    onUpdate: ({ editor }) => {
      // エディタの内容が更新されたときに呼ばれる
      const updatedContent = editor.getHTML();
      onChange(updatedContent);
    },
  });

  // 外部から `value` が変更された場合にエディタ内容を更新する
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="mx-auto mt-10 w-2/3 border-2">
      <div className="mt-3 h-[70vh] overflow-hidden overflow-y-scroll p-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
