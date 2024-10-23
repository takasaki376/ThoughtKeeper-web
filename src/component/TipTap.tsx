"use client";
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
    extensions: [StarterKit],
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getHTML();
      onChange(updatedContent); // 正しく更新された内容を呼び出し元に渡す
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
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
