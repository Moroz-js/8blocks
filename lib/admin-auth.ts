import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function verifyAdminToken(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;

    if (!token) {
      return false;
    }

    await jwtVerify(token, secret);
    return true;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

export async function requireAdmin() {
  const isAuthenticated = await verifyAdminToken();
  
  if (!isAuthenticated) {
    throw new Error('Unauthorized');
  }
}

// Alias for backward compatibility
export const verifyAdminAuth = verifyAdminToken;
