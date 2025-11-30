import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { hashPassword } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { addCorsHeaders, corsOptions } from '@/lib/cors';

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

    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });

    return addCorsHeaders(NextResponse.json({ message: 'User registered successfully' }, { status: 201 }));
  } catch (error) {
    console.error('Registration error:', error);
    return addCorsHeaders(NextResponse.json({ message: 'Internal server error' }, { status: 500 }));
  }
}
