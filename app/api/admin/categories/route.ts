import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isAuthenticated = await verifyAdminAuth();
  
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, nameRu, slug, description, descriptionRu, parentId } = body;

    const category = await prisma.category.create({
      data: {
        name,
        nameRu: nameRu || null,
        slug,
        description: description || null,
        descriptionRu: descriptionRu || null,
        parentId: parentId || null,
      },
    });

    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
