'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Tag {
  id: string;
  name: string;
  nameRu: string | null;
  slug: string;
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    nameRu: '',
    slug: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/admin/tags');
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingId
        ? `/api/admin/tags/${editingId}`
        : '/api/admin/tags';
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', nameRu: '', slug: '' });
        setEditingId(null);
        fetchTags();
      }
    } catch (error) {
      console.error('Failed to save tag:', error);
    }
  };

  const handleEdit = (tag: Tag) => {
    setFormData({
      name: tag.name,
      nameRu: tag.nameRu || '',
      slug: tag.slug,
    });
    setEditingId(tag.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;

    try {
      const response = await fetch(`/api/admin/tags/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTags();
      }
    } catch (error) {
      console.error('Failed to delete tag:', error);
    }
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setFormData({ ...formData, slug });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-white/50">Loading tags...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-medium">Tags</h1>
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
              {editingId ? 'Edit Tag' : 'Create Tag'}
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
                  placeholder="Enter tag name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-white">Name (RU)</label>
                <input
                  type="text"
                  value={formData.nameRu}
                  onChange={(e) => setFormData({ ...formData, nameRu: e.target.value })}
                  className="w-full px-4 py-2 bg-white/8 border border-white/20 rounded-lg focus:border-purple-500 focus:outline-none text-white placeholder-white/50"
                  placeholder="Введите название тега"
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
                    placeholder="tag-slug"
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
                      setFormData({ name: '', nameRu: '', slug: '' });
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
            <h2 className="text-2xl font-medium mb-4">Existing Tags</h2>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0B0B0B] border border-white/20 rounded-lg"
                >
                  <span>{tag.name}</span>
                  <button
                    onClick={() => handleEdit(tag)}
                    className="admin-btn-secondary admin-btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="admin-btn-danger admin-btn-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
