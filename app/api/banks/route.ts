import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bankAccounts } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { verifyJWT } from '@/lib/auth';
import { addCorsHeaders, corsOptions } from '@/lib/cors';

export const OPTIONS = corsOptions;

// Helper function to get user ID from token
async function getUserIdFromRequest(req: Request): Promise<number | null> {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return null;
    }
    const payload = await verifyJWT(token);
    if (!payload || typeof payload.userId !== 'number') {
        return null;
    }
    return payload.userId;
}

export async function GET(req: Request) {
    try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) {
            return addCorsHeaders(NextResponse.json({ message: 'Unauthorized' }, { status: 401 }));
        }

        const userBanks = await db.select().from(bankAccounts).where(eq(bankAccounts.userId, userId));
        return addCorsHeaders(NextResponse.json(userBanks, { status: 200 }));
    } catch (error) {
        console.error('GET banks error:', error);
        return addCorsHeaders(NextResponse.json({ message: 'Internal server error' }, { status: 500 }));
    }
}

export async function POST(req: Request) {
    try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) {
            return addCorsHeaders(NextResponse.json({ message: 'Unauthorized' }, { status: 401 }));
        }

        const { name, color, balance } = await req.json();

        if (!name) {
            return addCorsHeaders(NextResponse.json({ message: 'Missing required fields' }, { status: 400 }));
        }

        const [newBank] = await db.insert(bankAccounts).values({
            userId,
            name,
            color: color || 'blue',
            balance: parseInt(balance || '0'),
        }).returning();

        return addCorsHeaders(NextResponse.json(newBank, { status: 201 }));
    } catch (error) {
        console.error('POST bank error:', error);
        return addCorsHeaders(NextResponse.json({ message: 'Internal server error' }, { status: 500 }));
    }
}