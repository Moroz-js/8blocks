import { redirect } from 'next/navigation';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import CategoryForm from '@/components/admin/CategoryForm';
import Link from 'next/link';

export default async function NewCategoryPage() {
  const isAuthenticated = await verifyAdminAuth();
  
  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="min-h-screen bg-black text-white pt-5 px-6 pb-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">Create New Category</h1>
          <Link
            href="/admin/dashboard/categories"
            className="admin-btn-secondary"
          >
            Back to Categories
          </Link>
        </div>

        <CategoryForm categories={categories} />
      </div>
    </div>
  );
}
