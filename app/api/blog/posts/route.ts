import { NextRequest, NextResponse } from 'next/server';
import { getBlogPosts, getBlogPostsByCategory } from '@/lib/blog';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'en';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');

    let response;

    if (category) {
      response = await getBlogPostsByCategory(category, locale, page, limit);
    } else {
      response = await getBlogPosts(locale, page, limit);
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Blog posts API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch blog posts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
