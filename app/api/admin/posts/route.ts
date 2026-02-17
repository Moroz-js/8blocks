import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { calculateBilingualReadTime } from '@/lib/readTime';

// GET all posts (admin)
export async function GET() {
  try {
    await requireAdmin();

    const posts = await prisma.blogPost.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Unauthorized or server error' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// CREATE new post
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const {
      title,
      titleRu,
      slug,
      excerpt,
      excerptRu,
      content,
      contentRu,
      featuredImage,
      published,
      noindex,
      categoryId,
    } = body;

    // Auto-calculate read time based on content
    const readTime = calculateBilingualReadTime(content, contentRu);

    const post = await prisma.blogPost.create({
      data: {
        title,
        titleRu,
        slug,
        excerpt,
        excerptRu,
        content,
        contentRu,
        featuredImage,
        published: published || false,
        noindex: noindex || false,
        publishedAt: published ? new Date() : null,
        categoryId: categoryId || null,
        views: Math.floor(Math.random() * 24) + 20, // Random initial views: 20-43
        readTime, // Auto-calculated reading time
      },
      include: {
        category: true,
      },
    });

    // Revalidate cached pages
    revalidatePath('/blog');
    revalidatePath('/ru/blog');
    if (post.category) {
      revalidatePath(`/blog/${post.category.slug}`);
      revalidatePath(`/ru/blog/${post.category.slug}`);
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
