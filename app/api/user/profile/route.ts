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

        const { name, email, password, oldPassword, profilePicture } = await req.json();

        const updateData: any = { name, email };

        if (password && password.trim() !== '') {
            if (!oldPassword) {
                return addCorsHeaders(NextResponse.json({ message: 'Current password is required to set a new password' }, { status: 400 }));
            }

            // Fetch current user password
            const [currentUser] = await db.select({ password: users.password }).from(users).where(eq(users.id, userId));

            if (!currentUser) {
                return addCorsHeaders(NextResponse.json({ message: 'User not found' }, { status: 404 }));
            }

            if (!currentUser.password) {
                return addCorsHeaders(NextResponse.json({ message: 'No password set for this account. If you registered via social login, please use that.' }, { status: 400 }));
            }

            const isPasswordValid = await bcrypt.compare(oldPassword, currentUser.password);
            if (!isPasswordValid) {
                return addCorsHeaders(NextResponse.json({ message: 'Incorrect current password' }, { status: 403 }));
            }

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