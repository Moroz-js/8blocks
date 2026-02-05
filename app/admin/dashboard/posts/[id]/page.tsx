import { redirect } from 'next/navigation';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import PostForm from '@/components/admin/PostForm';
import Link from 'next/link';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const isAuthenticated = await verifyAdminAuth();
  
  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  const [post, categories, tags] = await Promise.all([
    prisma.blogPost.findUnique({
      where: { id },
      include: { tags: true },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!post) {
    redirect('/admin/dashboard/posts');
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-medium">Edit Post</h1>
          <Link
            href="/admin/dashboard/posts"
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
          >
            Back to Posts
          </Link>
        </div>

        <PostForm post={post} categories={categories} allTags={tags} />
      </div>
    </div>
  );
}
