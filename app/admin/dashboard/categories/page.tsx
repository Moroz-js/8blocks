'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  nameRu: string | null;
  slug: string;
  description: string | null;
  descriptionRu: string | null;
  parentId: string | null;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    nameRu: '',
    slug: '',
    description: '',
    descriptionRu: '',
    parentId: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingId
        ? `/api/admin/categories/${editingId}`
        : '/api/admin/categories';
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', nameRu: '', slug: '', description: '', descriptionRu: '', parentId: '' });
        setEditingId(null);
        fetchCategories();
      }
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      nameRu: category.nameRu || '',
      slug: category.slug,
      description: category.description || '',
      descriptionRu: category.descriptionRu || '',
      parentId: category.parentId || '',
    });
    setEditingId(category.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData({ ...formData, slug });
  };

  const parentCategories = categories.filter(c => !c.parentId);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-white/50">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-medium">Categories</h1>
          <Link
            href="/admin/dashboard"
            className="admin-btn-secondary"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-medium mb-4">
              {editingId ? 'Edit Category' : 'Create Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Name (EN)</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white/8 border border-white/20 rounded-lg focus:border-purple-500 focus:outline-none text-white placeholder-white/50"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Name (RU)</label>
                <input
                  type="text"
                  value={formData.nameRu}
                  onChange={(e) => setFormData({ ...formData, nameRu: e.target.value })}
                  className="w-full px-4 py-2 bg-white/8 border border-white/20 rounded-lg focus:border-purple-500 focus:outline-none text-white placeholder-white/50"
                  placeholder="Введите название категории"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Slug</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="flex-1 px-4 py-2 bg-white/8 border border-white/20 rounded-lg focus:border-purple-500 focus:outline-none text-white placeholder-white/50"
                    placeholder="category-slug"
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="admin-btn-secondary whitespace-nowrap"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Parent Category</label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full px-4 py-2 bg-white/8 border border-white/20 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                >
                  <option value="">None (Top Level)</option>
                  {parentCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Description (EN)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/8 border border-white/20 rounded-lg focus:border-purple-500 focus:outline-none text-white placeholder-white/50"
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Description (RU)</label>
                <textarea
                  value={formData.descriptionRu}
                  onChange={(e) => setFormData({ ...formData, descriptionRu: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/8 border border-white/20 rounded-lg focus:border-purple-500 focus:outline-none text-white placeholder-white/50"
                  placeholder="Введите описание"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="admin-btn-primary"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ name: '', nameRu: '', slug: '', description: '', descriptionRu: '', parentId: '' });
                    }}
                    className="admin-btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-4">Existing Categories</h2>
            <div className="space-y-3">
              {parentCategories.map((category) => (
                <div key={category.id}>
                  <div className="p-4 bg-[#0B0B0B] border border-white/20 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-white/50">Slug: {category.slug}</p>
                        {category.description && (
                          <p className="text-sm text-white/70 mt-2">{category.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="admin-btn-secondary admin-btn-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="admin-btn-danger admin-btn-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Child categories */}
                  {categories.filter(c => c.parentId === category.id).map((child) => (
                    <div key={child.id} className="ml-8 mt-2 p-3 bg-[#0B0B0B]/50 border border-white/10 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-sm">↳ {child.name}</h4>
                          <p className="text-xs text-white/50">Slug: {child.slug}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(child)}
                            className="admin-btn-secondary admin-btn-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(child.id)}
                            className="admin-btn-danger admin-btn-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
