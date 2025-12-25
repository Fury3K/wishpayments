import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq, and, gt } from 'drizzle-orm';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=missing_token', req.url));
  }

  try {
    const user = await db.select().from(users).where(
      and(
        eq(users.verificationToken, token),
        gt(users.verificationTokenExpiry, new Date())
      )
    );

    if (user.length === 0) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', req.url));
    }

    await db.update(users)
      .set({
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      })
      .where(eq(users.id, user[0].id));

    return NextResponse.redirect(new URL('/login?verified=true', req.url));
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.redirect(new URL('/login?error=server_error', req.url));
  }
}