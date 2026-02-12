'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { Node } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useEffect, useState, useCallback } from 'react';

// Event bus for embed edit requests (NodeView → React component)
let onEditEmbed: ((pos: number, content: string) => void) | null = null;

// Custom embed block node for arbitrary HTML (iframes, widgets, etc.)
const EmbedBlock = Node.create({
  name: 'embedBlock',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      content: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [{
      tag: 'div[data-type="embed"]',
      getAttrs: (element) => ({
        content: (element as HTMLElement).innerHTML,
      }),
    }];
  },

  renderHTML({ node }) {
    const el = document.createElement('div');
    el.setAttribute('data-type', 'embed');
    el.innerHTML = node.attrs.content;
    return el;
  },

  addNodeView() {
    return ({ node, getPos }) => {
      const dom = document.createElement('div');
      dom.className = 'editor-embed-wrapper';
      dom.contentEditable = 'false';

      const header = document.createElement('div');
      header.className = 'editor-embed-header';

      const label = document.createElement('span');
      label.className = 'editor-embed-label';
      label.textContent = 'Embed';

      const actions = document.createElement('div');
      actions.className = 'editor-embed-actions';

      const editBtn = document.createElement('button');
      editBtn.className = 'editor-embed-action-btn';
      editBtn.textContent = 'Edit';
      editBtn.type = 'button';
      editBtn.onclick = () => {
        const pos = typeof getPos === 'function' ? getPos() : undefined;
        if (pos !== undefined && onEditEmbed) {
          onEditEmbed(pos, node.attrs.content);
        }
      };

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'editor-embed-action-btn editor-embed-action-delete';
      deleteBtn.textContent = 'Delete';
      deleteBtn.type = 'button';
      deleteBtn.onclick = () => {
        const pos = typeof getPos === 'function' ? getPos() : undefined;
        if (pos !== undefined) {
          const event = new CustomEvent('embed-delete', { detail: { pos } });
          document.dispatchEvent(event);
        }
      };

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
      header.appendChild(label);
      header.appendChild(actions);

      const preview = document.createElement('div');
      preview.className = 'editor-embed-preview';
      preview.innerHTML = node.attrs.content;

      dom.appendChild(header);
      dom.appendChild(preview);

      return { dom };
    };
  },
});

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({ content, onChange, placeholder: _placeholder }: TiptapEditorProps) {
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [embedCode, setEmbedCode] = useState('');
  const [editingEmbedPos, setEditingEmbedPos] = useState<number | null>(null);

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
      EmbedBlock,
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

  // Register embed edit handler
  const handleEditEmbed = useCallback((pos: number, embedContent: string) => {
    setEditingEmbedPos(pos);
    setEmbedCode(embedContent);
    setShowEmbedModal(true);
  }, []);

  useEffect(() => {
    onEditEmbed = handleEditEmbed;
    return () => { onEditEmbed = null; };
  }, [handleEditEmbed]);

  // Listen for embed delete events
  useEffect(() => {
    const handleDelete = (e: Event) => {
      const pos = (e as CustomEvent).detail.pos;
      if (editor && typeof pos === 'number') {
        const node = editor.state.doc.nodeAt(pos);
        if (node) {
          editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run();
        }
      }
    };
    document.addEventListener('embed-delete', handleDelete);
    return () => document.removeEventListener('embed-delete', handleDelete);
  }, [editor]);

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

  const addFile = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.txt,.csv';

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
        editor
          .chain()
          .focus()
          .insertContent(
            `<a href="${data.url}" target="_blank" rel="noopener noreferrer">${file.name}</a>`
          )
          .run();
      } catch (error) {
        console.error('Failed to upload file:', error);
        alert('Failed to upload file');
      }
    };

    input.click();
  };

  const handleEmbedSubmit = () => {
    if (!embedCode.trim()) return;

    if (editingEmbedPos !== null) {
      // Update existing embed
      const node = editor.state.doc.nodeAt(editingEmbedPos);
      if (node) {
        const tr = editor.state.tr.replaceWith(
          editingEmbedPos,
          editingEmbedPos + node.nodeSize,
          editor.schema.nodes.embedBlock.create({ content: embedCode.trim() })
        );
        editor.view.dispatch(tr);
      }
    } else {
      // Insert new embed
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'embedBlock',
          attrs: { content: embedCode.trim() },
        })
        .run();
    }

    setEmbedCode('');
    setEditingEmbedPos(null);
    setShowEmbedModal(false);
  };

  const closeEmbedModal = () => {
    setShowEmbedModal(false);
    setEmbedCode('');
    setEditingEmbedPos(null);
  };

  const setLink = () => {
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const btnClass = (active: boolean) =>
    active ? 'editor-btn editor-btn-active' : 'editor-btn editor-btn-inactive';

  return (
    <div className="relative border border-white/10 rounded-lg overflow-hidden bg-[#0B0B0B] hover:border-white/20 transition-all duration-200">
      <div className="editor-toolbar">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive('bold'))}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive('italic'))}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btnClass(editor.isActive('heading', { level: 2 }))}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={btnClass(editor.isActive('heading', { level: 3 }))}
          title="Heading 3"
        >
          H3
        </button>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive('bulletList'))}
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive('orderedList'))}
          title="Numbered List"
        >
          1. List
        </button>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button
          type="button"
          onClick={setLink}
          className={btnClass(editor.isActive('link'))}
          title="Add Link"
        >
          Link
        </button>
        <button
          type="button"
          onClick={addImage}
          className="editor-btn editor-btn-inactive"
          title="Upload Image"
        >
          Image
        </button>
        <button
          type="button"
          onClick={addFile}
          className="editor-btn editor-btn-inactive"
          title="Upload File"
        >
          File
        </button>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button
          type="button"
          onClick={() => { setEditingEmbedPos(null); setEmbedCode(''); setShowEmbedModal(true); }}
          className="editor-btn editor-btn-inactive"
          title="Embed HTML (iframe, widget, etc.)"
        >
          &lt;/&gt; Embed
        </button>
      </div>

      <EditorContent editor={editor} />

      {/* Embed modal */}
      {showEmbedModal && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg mx-4 p-4 bg-[#111] border border-white/20 rounded-lg">
            <h3 className="text-sm font-medium text-white mb-2">
              {editingEmbedPos !== null ? 'Edit embed code' : 'Paste embed code'}
            </h3>
            <p className="text-xs text-white/40 mb-3">
              iframe, YouTube, Twitter, or any HTML widget
            </p>
            <textarea
              value={embedCode}
              onChange={(e) => setEmbedCode(e.target.value)}
              placeholder='<iframe src="..." ...></iframe>'
              rows={6}
              className="admin-input resize-none font-mono text-xs"
              autoFocus
            />
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={handleEmbedSubmit}
                disabled={!embedCode.trim()}
                className="admin-btn-primary disabled:opacity-40"
              >
                {editingEmbedPos !== null ? 'Update' : 'Insert'}
              </button>
              <button
                type="button"
                onClick={closeEmbedModal}
                className="admin-btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
