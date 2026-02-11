import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${originalName}`;

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    try {
      if (!existsSync(uploadDir)) {
        console.log('Creating uploads directory:', uploadDir);
        await mkdir(uploadDir, { recursive: true, mode: 0o755 });
      }
    } catch (mkdirError) {
      console.error('Failed to create uploads directory:', mkdirError);
      // Continue anyway - directory might exist but existsSync failed
    }

    // Save file
    const filepath = join(uploadDir, filename);
    console.log('Saving file to:', filepath);
    
    try {
      await writeFile(filepath, buffer, { mode: 0o644 });
      console.log('File saved successfully');
    } catch (writeError) {
      console.error('Failed to write file:', writeError);
      throw new Error(`Failed to write file: ${writeError instanceof Error ? writeError.message : 'Unknown error'}`);
    }

    // Return public URL
    const url = `/uploads/${filename}`;

    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Return more detailed error in development
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
    const detailedError = process.env.NODE_ENV === 'development' 
      ? errorMessage 
      : 'Failed to upload file';
    
    return NextResponse.json(
      { error: detailedError },
      { status: 500 }
    );
  }
}
