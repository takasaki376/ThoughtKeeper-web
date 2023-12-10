"use client"
import BulletList from '@tiptap/extension-bullet-list'
import Document from '@tiptap/extension-document'
import Highlight from '@tiptap/extension-highlight'
import ListItem from '@tiptap/extension-list-item'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Typography from '@tiptap/extension-typography'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export const RichEditor = () => {
  const editor = useEditor({
    content: `
    <ul>
    <li>A list item</li>
    <li>And another one</li>
    </ul>
    `,
    extensions: [StarterKit,Highlight,Typography,Document, Paragraph, Text, BulletList, ListItem],
  })

  if (!editor) {
    return null
  }

  return (
    <div className='mx-auto px-5'>
      <div className='flex justify-between'>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('opacity-20') ? 'is-active' : ''}
      >
        toggleBulletList
      </button>
      <button
        onClick={() => editor.chain().focus().splitListItem('listItem').run()}
          disabled={!editor.can().splitListItem('listItem')}
      >
        splitListItem
      </button>
      <button
        onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
        disabled={!editor.can().sinkListItem('listItem')}
      >
        sinkListItem
      </button>
      <button
        onClick={() => editor.chain().focus().liftListItem('listItem').run()}
        disabled={!editor.can().liftListItem('listItem')}
      >
        liftListItem
      </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
