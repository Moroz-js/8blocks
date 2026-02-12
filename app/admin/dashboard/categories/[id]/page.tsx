import { redirect } from 'next/navigation';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import CategoryForm from '@/components/admin/CategoryForm';
import Link from 'next/link';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const isAuthenticated = await verifyAdminAuth();
  
  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  const [category, categories] = await Promise.all([
    prisma.category.findUnique({
      where: { id },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!category) {
    redirect('/admin/dashboard/categories');
  }

  return (
    <div className="min-h-screen bg-black text-white pt-5 px-6 pb-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">Edit Category</h1>
          <Link
            href="/admin/dashboard/categories"
            className="admin-btn-secondary"
          >
            Back to Categories
          </Link>
        </div>

        <CategoryForm category={category} categories={categories} />
      </div>
    </div>
  );
}
