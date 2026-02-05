'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({ content, onChange, placeholder: _placeholder }: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-purple-400 underline',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'editor-content',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        editor.chain().focus().setImage({ src: data.url }).run();
      } catch (error) {
        console.error('Failed to upload image:', error);
        alert('Failed to upload image');
      }
    };

    input.click();
  };

  const setLink = () => {
    // If already a link, remove it
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    // Otherwise, add a link
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-[#0B0B0B] hover:border-white/20 transition-all duration-200">
      <div className="editor-toolbar">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'editor-btn editor-btn-active' : 'editor-btn editor-btn-inactive'}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'editor-btn editor-btn-active' : 'editor-btn editor-btn-inactive'}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'editor-btn editor-btn-active' : 'editor-btn editor-btn-inactive'}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'editor-btn editor-btn-active' : 'editor-btn editor-btn-inactive'}
          title="Heading 3"
        >
          H3
        </button>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'editor-btn editor-btn-active' : 'editor-btn editor-btn-inactive'}
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'editor-btn editor-btn-active' : 'editor-btn editor-btn-inactive'}
          title="Numbered List"
        >
          1. List
        </button>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button
          type="button"
          onClick={setLink}
          className={editor.isActive('link') ? 'editor-btn editor-btn-active' : 'editor-btn editor-btn-inactive'}
          title="Add Link"
        >
          🔗 Link
        </button>
        <button
          type="button"
          onClick={addImage}
          className="editor-btn editor-btn-inactive"
          title="Upload Image"
        >
          🖼️ Image
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
