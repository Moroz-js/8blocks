import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Get tracking cookie
    const trackingCookie = request.cookies.get(`view_${slug}`);
    
    // If already viewed today, don't count
    if (trackingCookie) {
      const lastView = new Date(trackingCookie.value);
      const now = new Date();
      
      // Check if less than 24 hours
      if (now.getTime() - lastView.getTime() < 24 * 60 * 60 * 1000) {
        return NextResponse.json({ viewed: false, message: 'Already viewed today' });
      }
    }
    
    // Increment view count
    const post = await prisma.blogPost.update({
      where: { slug },
      data: {
        views: {
          increment: 1,
        },
      },
      select: {
        views: true,
      },
    });
    
    // Set cookie for 24 hours
    const response = NextResponse.json({ 
      viewed: true, 
      views: post.views 
    });
    
    response.cookies.set(`view_${slug}`, new Date().toISOString(), {
      maxAge: 24 * 60 * 60, // 24 hours
      httpOnly: true,
      sameSite: 'lax',
    });
    
    return response;
  } catch (error) {
    console.error('View tracking error:', error);
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
  }
}
