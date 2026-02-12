'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TiptapEditor from './TiptapEditor';
import ImageUpload from './ImageUpload';
import type { BlogPost, Category } from '@prisma/client';

interface PostFormProps {
  post?: BlogPost;
  categories: Category[];
}

export default function PostForm({ post, categories }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: post?.title || '',
    titleRu: post?.titleRu || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    excerptRu: post?.excerptRu || '',
    content: post?.content || '',
    contentRu: post?.contentRu || '',
    featuredImage: post?.featuredImage || '',
    categoryId: post?.categoryId || '',
    published: post?.published || false,
    noindex: post?.noindex || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = post
        ? `/api/admin/posts/${post.id}`
        : '/api/admin/posts';
      
      const method = post ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save post');
      }

      router.push('/admin/dashboard/posts');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!post || !confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/posts/${post.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      router.push('/admin/dashboard/posts');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData({ ...formData, slug });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Title (EN)</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="admin-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Title (RU)</label>
          <input
            type="text"
            value={formData.titleRu}
            onChange={(e) => setFormData({ ...formData, titleRu: e.target.value })}
            className="admin-input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Slug</label>
        <div className="flex gap-2">
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="admin-input"
          />
          <button
            type="button"
            onClick={generateSlug}
            className="admin-btn-secondary shrink-0"
          >
            Generate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Excerpt (EN)</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
            className="admin-input resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Excerpt (RU)</label>
          <textarea
            value={formData.excerptRu}
            onChange={(e) => setFormData({ ...formData, excerptRu: e.target.value })}
            rows={3}
            className="admin-input resize-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Content (EN)</label>
        <TiptapEditor
          content={formData.content}
          onChange={(content) => setFormData({ ...formData, content })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Content (RU)</label>
        <TiptapEditor
          content={formData.contentRu}
          onChange={(contentRu) => setFormData({ ...formData, contentRu })}
        />
      </div>

      <div>
        <ImageUpload
          value={formData.featuredImage}
          onChange={(url) => setFormData({ ...formData, featuredImage: url })}
          label="Featured Image"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Category</label>
        <select
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          className="admin-input cursor-pointer"
        >
          <option value="">No category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm font-medium">Published</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.noindex}
            onChange={(e) => setFormData({ ...formData, noindex: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm font-medium">NoIndex (hide from search engines)</span>
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="admin-btn-primary disabled:opacity-50"
        >
          {loading ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
        </button>

        {post && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="admin-btn-danger disabled:opacity-50"
          >
            Delete Post
          </button>
        )}
      </div>
    </form>
  );
}
