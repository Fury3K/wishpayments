import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';
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

    if (!user) {
      // Return 404 or just success to prevent email enumeration (going with 404 for now as it's an explicit action)
      return addCorsHeaders(NextResponse.json({ message: 'User not found' }, { status: 404 }));
    }

    if (user.emailVerified) {
      return addCorsHeaders(NextResponse.json({ message: 'Email is already verified' }, { status: 400 }));
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.update(users)
      .set({
        verificationToken,
        verificationTokenExpiry,
      })
      .where(eq(users.id, user.id));

    await sendVerificationEmail(email, verificationToken);

    return addCorsHeaders(NextResponse.json({ message: 'Verification email sent' }, { status: 200 }));
  } catch (error) {
    console.error('Resend verification error:', error);
    return addCorsHeaders(NextResponse.json({ message: 'Internal server error' }, { status: 500 }));
  }
}