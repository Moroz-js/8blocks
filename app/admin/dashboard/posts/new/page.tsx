import { redirect } from 'next/navigation';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import PostForm from '@/components/admin/PostForm';
import Link from 'next/link';

export default async function NewPostPage() {
  const isAuthenticated = await verifyAdminAuth();
  
  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-medium">Create New Post</h1>
          <Link
            href="/admin/dashboard/posts"
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
          >
            Back to Posts
          </Link>
        </div>

        <PostForm categories={categories} allTags={tags} />
      </div>
    </div>
  );
}
