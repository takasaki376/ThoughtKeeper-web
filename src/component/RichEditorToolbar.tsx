import { Editor } from "@tiptap/react";
import {
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdRedo,
  MdTaskAlt,
  MdUndo,
} from "react-icons/md";

const RichEditorToolbar = ({ editor }: { editor: Editor }) => {


  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 border-b p-4 text-2xl">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={!editor.isActive("taskList") ? "opacity-20" : ""}
      >
        <MdTaskAlt />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={!editor.isActive("bulletList") ? "opacity-20" : ""}
      >
        <MdFormatListBulleted />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={!editor.isActive("orderedList") ? "opacity-20" : ""}
      >
        <MdFormatListNumbered />
      </button>

      <button onClick={() => editor.chain().focus().undo().run()} type="button">
        <MdUndo />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} type="button">
        <MdRedo />
      </button>
    </div>
  );
};

export default RichEditorToolbar
