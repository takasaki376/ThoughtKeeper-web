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
    <div className="border-gray-300 mx-auto mt-10 w-2/3 rounded-lg border bg-lightGray p-3 shadow-sm transition-colors">
      <div className="border-gray-200 overflow-hidden overflow-y-scroll rounded-md border bg-white">
        {/* エディタが設定されるまでは表示を一時停止する */}
        {editor ? (
          <EditorContent
            editor={editor}
            className="focus:outline-none focus-visible:outline-none"
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};
