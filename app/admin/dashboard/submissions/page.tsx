'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/admin/submissions');
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setSubmissions(data);
    } catch (err) {
      setError('Failed to load submissions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    setDeletingId(id);
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete');
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete submission');
    } finally {
      setDeletingId(null);
    }
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
            <h1 className="text-4xl font-medium mb-2">Contact Submissions</h1>
            <p className="text-white/50">
              {submissions.length} submission{submissions.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <Link
            href="/admin/dashboard"
            className="admin-btn-secondary"
          >
            Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="error-message mb-6">{error}</div>
        )}

        <div className="space-y-4">
          {submissions.length === 0 ? (
            <div className="text-center py-12 text-white/50">
              No submissions yet.
            </div>
          ) : (
            submissions.map((submission) => (
              <div
                key={submission.id}
                className="admin-card"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-medium truncate">
                        {submission.name}
                      </h2>
                      <a
                        href={`mailto:${submission.email}`}
                        className="text-purple-400 hover:text-purple-300 text-sm shrink-0"
                      >
                        {submission.email}
                      </a>
                    </div>
                    <p className="text-white/70 mb-3 whitespace-pre-wrap">
                      {submission.message}
                    </p>
                    <span className="text-sm text-white/40">
                      {formatDate(submission.submittedAt)}
                    </span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <a
                      href={`mailto:${submission.email}?subject=Re: Contact from 8Blocks&body=%0A%0A---%0AOriginal message from ${submission.name}:%0A${encodeURIComponent(submission.message)}`}
                      className="admin-btn-secondary admin-btn-sm"
                    >
                      Reply
                    </a>
                    <button
                      onClick={() => handleDelete(submission.id)}
                      disabled={deletingId === submission.id}
                      className="admin-btn-danger admin-btn-sm disabled:opacity-50"
                    >
                      {deletingId === submission.id ? '...' : 'Delete'}
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
