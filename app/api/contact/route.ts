import { NextRequest, NextResponse } from 'next/server';
import { sendThankYouEmail, sendAdminNotification } from '@/lib/email';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  locale: 'en' | 'ru';
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate name length
    if (body.name.length < 2 || body.name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters' },
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

    // Validate message length
    if (body.message.length < 10 || body.message.length > 2000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 2000 characters' },
        { status: 400 }
      );
    }

    // Save to database first (so data isn't lost if email fails)
    try {
      await prisma.contactSubmission.create({
        data: {
          name: body.name,
          email: body.email,
          message: body.message,
        },
      });
      console.log('Contact submission saved to database');
    } catch (dbError) {
      console.error('Failed to save contact submission to database:', dbError);
      // Don't fail the request if DB save fails, but log it
    }

    // Log the submission
    console.log('Contact form submission:', {
      name: body.name,
      email: body.email,
      message: body.message,
      locale: body.locale,
      timestamp: new Date().toISOString(),
    });

    // Send thank you email to the user
    console.log('📧 Attempting to send thank you email to:', body.email);
    try {
      await sendThankYouEmail({
        name: body.name,
        email: body.email,
        message: body.message,
        locale: body.locale,
      });
      console.log('✅ Thank you email sent to:', body.email);
    } catch (emailError) {
      console.error('❌ Failed to send thank you email:', emailError);
      // Continue even if email fails - don't block the form submission
    }

    // Send notification to admin (optional)
    console.log('📧 Attempting to send admin notification');
    try {
      await sendAdminNotification({
        name: body.name,
        email: body.email,
        message: body.message,
        locale: body.locale,
      });
      console.log('✅ Admin notification sent');
    } catch (emailError) {
      console.error('❌ Failed to send admin notification:', emailError);
      // Continue even if admin notification fails
    }

    return NextResponse.json(
      { success: true, message: 'Form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
