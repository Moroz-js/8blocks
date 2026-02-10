import { NextRequest, NextResponse } from 'next/server';
import { sendNewsletterConfirmation, sendAdminNewsletterNotification } from '@/lib/email';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface NewsletterData {
  email: string;
  locale: 'en' | 'ru';
}

export async function POST(request: NextRequest) {
  try {
    const body: NewsletterData = await request.json();

    // Validate required fields
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already subscribed
    const existingSubscription = await prisma.newsletterSubscription.findUnique({
      where: { email: body.email },
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 409 }
      );
    }

    // Save to database
    try {
      await prisma.newsletterSubscription.create({
        data: {
          email: body.email,
          locale: body.locale || 'en',
        },
      });
      console.log('Newsletter subscription saved to database');
    } catch (dbError) {
      console.error('Failed to save newsletter subscription:', dbError);
      return NextResponse.json(
        { error: 'Failed to subscribe' },
        { status: 500 }
      );
    }

    // Send confirmation email to subscriber
    console.log('📧 Attempting to send newsletter confirmation to:', body.email);
    try {
      await sendNewsletterConfirmation({
        email: body.email,
        locale: body.locale || 'en',
      });
      console.log('✅ Newsletter confirmation email sent to:', body.email);
    } catch (emailError) {
      console.error('❌ Failed to send confirmation email:', emailError);
      // Continue even if email fails
    }

    // Notify admin
    console.log('📧 Attempting to send admin notification');
    try {
      await sendAdminNewsletterNotification({
        email: body.email,
        locale: body.locale || 'en',
      });
      console.log('✅ Admin newsletter notification sent');
    } catch (emailError) {
      console.error('❌ Failed to send admin notification:', emailError);
      // Continue even if admin notification fails
    }

    return NextResponse.json(
      { success: true, message: 'Subscribed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
