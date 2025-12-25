import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq, and, gt } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth';
import { addCorsHeaders, corsOptions } from '@/lib/cors';

export const OPTIONS = corsOptions;

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return addCorsHeaders(NextResponse.json({ message: 'Missing token or password' }, { status: 400 }));
    }

    const userArray = await db.select().from(users).where(
      and(
        eq(users.resetToken, token),
        gt(users.resetTokenExpiry, new Date())
      )
    );
    const user = userArray[0];

    if (!user) {
      return addCorsHeaders(NextResponse.json({ message: 'Invalid or expired reset token' }, { status: 400 }));
    }

    const hashedPassword = await hashPassword(password);

    await db.update(users)
      .set({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      })
      .where(eq(users.id, user.id));

    return addCorsHeaders(NextResponse.json({ message: 'Password reset successfully' }, { status: 200 }));
  } catch (error) {
    console.error('Reset password error:', error);
    return addCorsHeaders(NextResponse.json({ message: 'Internal server error' }, { status: 500 }));
  }
}