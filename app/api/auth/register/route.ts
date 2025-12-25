import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { hashPassword } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { addCorsHeaders, corsOptions } from '@/lib/cors';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

export const OPTIONS = corsOptions;

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return addCorsHeaders(NextResponse.json({ message: 'Missing fields' }, { status: 400 }));
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return addCorsHeaders(NextResponse.json({ message: 'User with this email already exists' }, { status: 409 }));
    }

    const hashedPassword = await hashPassword(password);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      emailVerified: false,
      verificationToken,
      verificationTokenExpiry,
    });

    await sendVerificationEmail(email, verificationToken);

    return addCorsHeaders(NextResponse.json({ message: 'User registered successfully. Please check your email to verify your account.' }, { status: 201 }));
  } catch (error) {
    console.error('Registration error:', error);
    return addCorsHeaders(NextResponse.json({ message: 'Internal server error' }, { status: 500 }));
  }
}
