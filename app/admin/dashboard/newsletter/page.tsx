'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface NewsletterSubscriber {
  id: string;
  email: string;
  locale: string;
  subscribedAt: string;
  unsubscribedAt: string | null;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch('/api/admin/newsletter');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setSubscribers(data);
    } catch (err) {
      setError('Failed to load subscribers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;

    setDeletingId(id);
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete');
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete subscriber');
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = () => {
    const csv = [
      'Email,Language,Subscribed At,Status',
      ...subscribers.map((s) =>
        `${s.email},${s.locale === 'ru' ? 'Russian' : 'English'},${new Date(s.subscribedAt).toISOString()},${s.unsubscribedAt ? 'Unsubscribed' : 'Active'}`
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const activeSubscribers = subscribers.filter((s) => !s.unsubscribedAt);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="admin-card-header">
          <div>
            <h1 className="text-4xl font-medium mb-2">Newsletter Subscribers</h1>
            <p className="text-white/50">
              {activeSubscribers.length} active, {subscribers.length} total
            </p>
          </div>
          <div className="flex gap-3">
            {subscribers.length > 0 && (
              <button
                onClick={handleExport}
                className="admin-btn-secondary"
              >
                Export CSV
              </button>
            )}
            <Link
              href="/admin/dashboard"
              className="admin-btn-secondary"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {error && (
          <div className="error-message mb-6">{error}</div>
        )}

        <div className="space-y-4">
          {subscribers.length === 0 ? (
            <div className="text-center py-12 text-white/50">
              No subscribers yet.
            </div>
          ) : (
            subscribers.map((subscriber) => (
              <div
                key={subscriber.id}
                className={`admin-card ${subscriber.unsubscribedAt ? 'opacity-50' : ''}`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <a
                        href={`mailto:${subscriber.email}`}
                        className="text-xl font-medium text-purple-400 hover:text-purple-300 truncate"
                      >
                        {subscriber.email}
                      </a>
                      <span className="text-sm text-white/40 shrink-0 uppercase">
                        {subscriber.locale}
                      </span>
                      {subscriber.unsubscribedAt && (
                        <span className="text-sm text-red-400 shrink-0">
                          Unsubscribed
                        </span>
                      )}
                    </div>
                    <div className="flex gap-4 text-sm text-white/40">
                      <span>
                        Subscribed: {formatDate(subscriber.subscribedAt)}
                      </span>
                      {subscriber.unsubscribedAt && (
                        <span>
                          Unsubscribed: {formatDate(subscriber.unsubscribedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <a
                      href={`mailto:${subscriber.email}`}
                      className="admin-btn-secondary admin-btn-sm"
                    >
                      Email
                    </a>
                    <button
                      onClick={() => handleDelete(subscriber.id)}
                      disabled={deletingId === subscriber.id}
                      className="admin-btn-danger admin-btn-sm disabled:opacity-50"
                    >
                      {deletingId === subscriber.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
