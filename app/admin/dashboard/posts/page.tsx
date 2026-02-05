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
      tags: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-medium">Blog Posts</h1>
          <div className="flex gap-4">
            <Link
              href="/admin/dashboard"
              className="px-4 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/admin/dashboard/posts/new"
              className="px-4 py-1 bg-purple-500 rounded-lg hover:bg-purple-600 transition"
            >
              Create New Post
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12 text-white/50">
              No posts yet. Create your first post!
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="p-6 bg-[#0B0B0B] border border-white/20 rounded-xl"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-2xl font-medium mb-2">{post.title}</h2>
                    {post.excerpt && (
                      <p className="text-white/70 mb-4">{post.excerpt}</p>
                    )}
                    <div className="flex gap-4 text-sm text-white/50">
                      <span>Slug: {post.slug}</span>
                      {post.category && (
                        <span>Category: {post.category.name}</span>
                      )}
                      <span>
                        Status: {post.published ? '✅ Published' : '📝 Draft'}
                      </span>
                    </div>
                    {post.tags.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {post.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="px-3 py-1 bg-white/10 rounded-full text-sm"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/admin/dashboard/posts/${post.id}`}
                    className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
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
