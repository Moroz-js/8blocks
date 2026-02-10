import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function POST() {
  const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  
  response.cookies.delete('admin-token');

  return response;
}
