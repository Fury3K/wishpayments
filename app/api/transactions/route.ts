import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { transactions } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
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

        const userTransactions = await db.query.transactions.findMany({
            where: eq(transactions.userId, userId),
            orderBy: [desc(transactions.date)],
        });

        // Need to add relation in schema if I want 'with: bank'.
        // For now, let's just fetch raw transactions. The frontend already fetches 'banks' so it can map ID to name.
        
        return addCorsHeaders(NextResponse.json(userTransactions, { status: 200 }));
    } catch (error) {
        console.error('GET transactions error:', error);
        return addCorsHeaders(NextResponse.json({ message: 'Internal server error' }, { status: 500 }));
    }
}
