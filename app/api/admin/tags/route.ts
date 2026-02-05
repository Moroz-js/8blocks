import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(tags);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const isAuthenticated = await verifyAdminAuth();
  
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, nameRu, slug } = body;

    const tag = await prisma.tag.create({
      data: {
        name,
        nameRu: nameRu || null,
        slug,
      },
    });

    return NextResponse.json(tag);
  } catch {
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 });
  }
}
