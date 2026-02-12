'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Category } from '@prisma/client';

interface CategoryFormProps {
  category?: Category;
  categories: Category[];
}

export default function CategoryForm({ category, categories }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: category?.name || '',
    nameRu: category?.nameRu || '',
    slug: category?.slug || '',
    parentId: category?.parentId || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = category
        ? `/api/admin/categories/${category.id}`
        : '/api/admin/categories';
      
      const method = category ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save category');
      }

      router.push('/admin/dashboard/categories');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!category || !confirm('Are you sure you want to delete this category?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      router.push('/admin/dashboard/categories');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData({ ...formData, slug });
  };

  // Filter out current category from parent options to prevent self-referencing
  const parentCategories = categories.filter(c => !c.parentId && c.id !== category?.id);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-white">Name (EN)</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="admin-input"
            placeholder="Enter category name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-white">Name (RU)</label>
          <input
            type="text"
            value={formData.nameRu}
            onChange={(e) => setFormData({ ...formData, nameRu: e.target.value })}
            className="admin-input"
            placeholder="Введите название категории"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 text-white">Slug</label>
        <div className="flex gap-2">
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="admin-input"
            placeholder="category-slug"
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

      <div>
        <label className="block text-sm font-medium mb-1.5 text-white">Parent Category</label>
        <select
          value={formData.parentId}
          onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
          className="admin-input cursor-pointer"
        >
          <option value="">None (Top Level)</option>
          {parentCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="admin-btn-primary disabled:opacity-50"
        >
          {loading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
        </button>

        {category && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="admin-btn-danger disabled:opacity-50"
          >
            Delete Category
          </button>
        )}
      </div>
    </form>
  );
}
