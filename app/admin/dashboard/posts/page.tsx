import { redirect } from 'next/navigation';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function PostsListPage() {
  const isAuthenticated = await verifyAdminAuth();
  
  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  const posts = await prisma.blogPost.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-black text-white pt-5 px-6 pb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">Blog Posts</h1>
          <div className="flex gap-3">
            <Link
              href="/admin/dashboard"
              className="admin-btn-secondary"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/admin/dashboard/posts/new"
              className="admin-btn-primary"
            >
              Create New Post
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          {posts.length === 0 ? (
            <div className="text-center py-12 text-white/50">
              No posts yet. Create your first post!
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="p-2 bg-[#0B0B0B] border border-white/10 rounded-lg hover:border-white/20 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-xl font-medium mb-1">{post.title}</h2>
                    {post.excerpt && (
                      <p className="text-white/70 text-sm mb-2">{post.excerpt}</p>
                    )}
                    <div className="flex gap-4 text-sm text-white/50">
                      <span>Slug: {post.slug}</span>
                      {post.category && (
                        <span>Category: {post.category.name}</span>
                      )}
                      <span>
                        Status: {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/admin/dashboard/posts/${post.id}`}
                    className="admin-btn-secondary shrink-0"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
