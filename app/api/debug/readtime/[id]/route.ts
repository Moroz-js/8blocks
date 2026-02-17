import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateBilingualReadTime } from '@/lib/readTime';

// Debug endpoint to check readTime calculation
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        contentRu: true,
        readTime: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Calculate what it should be
    const calculatedReadTime = calculateBilingualReadTime(post.content, post.contentRu);

    // Parse content
    const contentText = post.content
      .replace(/<[^>]*>/g, '')
      .replace(/[#*_`~\[\]]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const contentRuText = post.contentRu
      ? post.contentRu
          .replace(/<[^>]*>/g, '')
          .replace(/[#*_`~\[\]]/g, '')
          .replace(/\s+/g, ' ')
          .trim()
      : '';

    const contentWords = contentText.split(/\s+/).filter(w => w.length > 0);
    const contentRuWords = contentRuText ? contentRuText.split(/\s+/).filter(w => w.length > 0) : [];

    return NextResponse.json({
      post: {
        id: post.id,
        title: post.title,
        storedReadTime: post.readTime,
      },
      english: {
        htmlLength: post.content.length,
        textLength: contentText.length,
        wordCount: contentWords.length,
        estimatedMinutes: Math.max(1, Math.ceil(contentWords.length / 225)),
        preview: contentText.substring(0, 200) + '...',
      },
      russian: post.contentRu ? {
        htmlLength: post.contentRu.length,
        textLength: contentRuText.length,
        wordCount: contentRuWords.length,
        estimatedMinutes: Math.max(1, Math.ceil(contentRuWords.length / 190)),
        preview: contentRuText.substring(0, 200) + '...',
      } : null,
      calculated: {
        shouldBe: calculatedReadTime,
        currentlyIs: post.readTime,
        needsUpdate: post.readTime !== calculatedReadTime,
      },
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to calculate' },
      { status: 500 }
    );
  }
}
