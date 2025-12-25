import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';
import { addCorsHeaders, corsOptions } from '@/lib/cors';

export const OPTIONS = corsOptions;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return addCorsHeaders(NextResponse.json({ message: 'Email is required' }, { status: 400 }));
    }

    const userArray = await db.select().from(users).where(eq(users.email, email));
    const user = userArray[0];

    // Even if user not found, return success to prevent email enumeration
    if (!user) {
      return addCorsHeaders(NextResponse.json({ message: 'If an account exists with this email, a password reset link has been sent.' }, { status: 200 }));
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.update(users)
      .set({
        resetToken,
        resetTokenExpiry,
      })
      .where(eq(users.id, user.id));

    await sendPasswordResetEmail(email, resetToken);

    return addCorsHeaders(NextResponse.json({ message: 'If an account exists with this email, a password reset link has been sent.' }, { status: 200 }));
  } catch (error) {
    console.error('Forgot password error:', error);
    return addCorsHeaders(NextResponse.json({ message: 'Internal server error' }, { status: 500 }));
  }
}