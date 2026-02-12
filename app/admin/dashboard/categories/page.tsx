import { redirect } from 'next/navigation';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function CategoriesListPage() {
  const isAuthenticated = await verifyAdminAuth();
  
  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  const parentCategories = categories.filter(c => !c.parentId);

  return (
    <div className="min-h-screen bg-black text-white pt-5 px-6 pb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium">Categories</h1>
          <div className="flex gap-3">
            <Link
              href="/admin/dashboard"
              className="admin-btn-secondary"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/admin/dashboard/categories/new"
              className="admin-btn-primary"
            >
              Create New Category
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          {categories.length === 0 ? (
            <div className="text-center py-12 text-white/50">
              No categories yet. Create your first category!
            </div>
          ) : (
            parentCategories.map((category) => (
              <div key={category.id}>
                <div className="p-2 bg-[#0B0B0B] border border-white/10 rounded-lg hover:border-white/20 transition">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h2 className="text-lg font-medium">{category.name}</h2>
                      {category.nameRu && (
                        <p className="text-sm text-white/70">{category.nameRu}</p>
                      )}
                      <p className="text-sm text-white/50">Slug: {category.slug}</p>
                    </div>
                    <Link
                      href={`/admin/dashboard/categories/${category.id}`}
                      className="admin-btn-secondary shrink-0"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
                
                {/* Child categories */}
                {categories.filter(c => c.parentId === category.id).map((child) => (
                  <div key={child.id} className="ml-6 mt-1.5 p-2 bg-[#0B0B0B]/50 border border-white/5 rounded-lg hover:border-white/15 transition">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">↳ {child.name}</h3>
                        {child.nameRu && (
                          <p className="text-sm text-white/70">{child.nameRu}</p>
                        )}
                        <p className="text-xs text-white/50">Slug: {child.slug}</p>
                      </div>
                      <Link
                        href={`/admin/dashboard/categories/${child.id}`}
                        className="admin-btn-secondary admin-btn-sm shrink-0"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
