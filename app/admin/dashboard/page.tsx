import { redirect } from 'next/navigation';
import { verifyAdminAuth } from '@/lib/admin-auth';
import Link from 'next/link';

export default async function AdminDashboard() {
  const isAuthenticated = await verifyAdminAuth();
  
  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="admin-card-header">
          <div>
            <h1 className="text-4xl font-medium mb-2">Admin Dashboard</h1>
            <p className="text-white/50">Manage your blog content</p>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="admin-btn-secondary"
            >
              Logout
            </button>
          </form>
        </div>

        <div className="dashboard-grid mt-8">
          <Link href="/admin/dashboard/posts" className="dashboard-card">
            <div className="text-4xl mb-4">📝</div>
            <h2 className="text-2xl font-medium mb-2">Blog Posts</h2>
            <p className="text-white/50">Create and manage blog posts</p>
          </Link>

          <Link href="/admin/dashboard/categories" className="dashboard-card">
            <div className="text-4xl mb-4">📁</div>
            <h2 className="text-2xl font-medium mb-2">Categories</h2>
            <p className="text-white/50">Organize posts into categories</p>
          </Link>

          <Link href="/admin/dashboard/submissions" className="dashboard-card">
            <div className="text-4xl mb-4">📩</div>
            <h2 className="text-2xl font-medium mb-2">Submissions</h2>
            <p className="text-white/50">View contact form submissions</p>
          </Link>

          <Link href="/admin/dashboard/newsletter" className="dashboard-card">
            <div className="text-4xl mb-4">📧</div>
            <h2 className="text-2xl font-medium mb-2">Newsletter</h2>
            <p className="text-white/50">Manage newsletter subscribers</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
