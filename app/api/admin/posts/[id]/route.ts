import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { calculateBilingualReadTime } from '@/lib/readTime';

// GET single post
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Unauthorized or server error' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// UPDATE post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
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

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Auto-recalculate read time if content has changed
    const readTime = calculateBilingualReadTime(content, contentRu);
    
    // Debug logging
    console.log('📊 ReadTime calculation:', {
      contentLength: content?.length || 0,
      contentRuLength: contentRu?.length || 0,
      calculatedReadTime: readTime,
      title: title.substring(0, 50),
    });

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
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
        publishedAt: published && !existingPost.published ? new Date() : existingPost.publishedAt,
        categoryId: categoryId || null,
        readTime, // Auto-recalculated reading time
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
    revalidatePath(`/blog/${post.category?.slug}/${post.slug}`);
    revalidatePath(`/ru/blog/${post.category?.slug}/${post.slug}`);

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

// DELETE post
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    // Get post before deletion to revalidate its pages
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { category: true },
    });

    await prisma.blogPost.delete({
      where: { id },
    });

    // Revalidate cached pages
    revalidatePath('/blog');
    revalidatePath('/ru/blog');
    if (post?.category) {
      revalidatePath(`/blog/${post.category.slug}`);
      revalidatePath(`/ru/blog/${post.category.slug}`);
    }

    return NextResponse.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
