"use client"
import Document from '@tiptap/extension-document'
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit';

import RichEditorToolbar from "./RichEditorToolbar";

export const Tiptap = () => {
  const editor = useEditor({
    content: `
  <h2>
    Hi there,
  </h2>
  <p>
    this is a basic <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
  </p>
  <ul>
    <li>
      That’s a bullet list with one …
    </li>
    <li>
      … or two list items.
    </li>
  </ul>
  <p>
    Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
  </p>
  <pre><code class="language-css">body {
  display: none;
}</code></pre>
  <p>
    I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
  </p>
  <blockquote>
    Wow, that’s amazing. Good work, boy! 👏
    <br />
    — Mom
  </blockquote>
`,
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
