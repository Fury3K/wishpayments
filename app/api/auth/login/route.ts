import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { comparePassword, signJWT } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { addCorsHeaders, corsOptions } from '@/lib/cors';

export const OPTIONS = corsOptions;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email?.trim();
    const password = body.password?.trim();

    console.log(`Login attempt for email: ${email}`);

    if (!email || !password) {
      console.log('Missing email or password');
      return addCorsHeaders(NextResponse.json({ message: 'Missing email or password' }, { status: 400 }));
    }

    const userArray = await db.select().from(users).where(eq(users.email, email));
    const user = userArray[0];

    if (!user) {
      console.log('User not found');
      return addCorsHeaders(NextResponse.json({ message: 'Invalid credentials' }, { status: 401 }));
    }

    if (!user.password) {
      console.log('User has no password set (OAuth user)');
      return addCorsHeaders(NextResponse.json({ message: 'Invalid credentials' }, { status: 401 }));
    }

    const passwordMatch = await comparePassword(password, user.password);
    console.log(`Password match result for ${email}: ${passwordMatch}`);

    if (!passwordMatch) {
      return addCorsHeaders(NextResponse.json({ message: 'Invalid credentials' }, { status: 401 }));
    }

    const token = await signJWT({ userId: user.id, email: user.email });

    const response = NextResponse.json({ message: 'Login successful', token }, { status: 200 });
    response.cookies.set('token', token, {
        httpOnly: false, // Set to false so client can read it if needed, or true for security (middleware can still read it)
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
    });

    return addCorsHeaders(response);
  } catch (error) {
    console.error('Login error:', error);
    return addCorsHeaders(NextResponse.json({ message: 'Internal server error' }, { status: 500 }));
  }
}
