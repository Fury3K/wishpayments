import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { verifyJWT } from '@/lib/auth';
import { addCorsHeaders, corsOptions } from '@/lib/cors';
import bcrypt from 'bcryptjs';

export const OPTIONS = corsOptions;

async function getUserIdFromRequest(req: Request): Promise<number | null> {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return null;
    const payload = await verifyJWT(token);
    if (!payload || typeof payload.userId !== 'number') return null;
    return payload.userId;
}

export async function GET(req: Request) {
    try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) {
            return addCorsHeaders(NextResponse.json({ message: 'Unauthorized' }, { status: 401 }));
        }

        const [user] = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            profilePicture: users.profilePicture,
        }).from(users).where(eq(users.id, userId));

        if (!user) {
            return addCorsHeaders(NextResponse.json({ message: 'User not found' }, { status: 404 }));
        }

        return addCorsHeaders(NextResponse.json(user, { status: 200 }));
    } catch (error) {
        console.error('GET profile error:', error);
        return addCorsHeaders(NextResponse.json({ message: 'Internal server error' }, { status: 500 }));
    }
}

export async function PUT(req: Request) {
    try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) {
            return addCorsHeaders(NextResponse.json({ message: 'Unauthorized' }, { status: 401 }));
        }

        const { name, email, password, profilePicture } = await req.json();

        const updateData: any = { name, email };
        if (password && password.trim() !== '') {
            updateData.password = await bcrypt.hash(password, 10);
        }
        if (profilePicture !== undefined) {
             updateData.profilePicture = profilePicture;
        }

        const [updatedUser] = await db.update(users)
            .set(updateData)
            .where(eq(users.id, userId))
            .returning({ id: users.id, name: users.name, email: users.email, profilePicture: users.profilePicture });

        return addCorsHeaders(NextResponse.json(updatedUser, { status: 200 }));
    } catch (error) {
        console.error('PUT profile error:', error);
        return addCorsHeaders(NextResponse.json({ message: 'Internal server error' }, { status: 500 }));
    }
}