import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, items, bankAccounts, transactions } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { verifyJWT } from '@/lib/auth';
import { addCorsHeaders, corsOptions } from '@/lib/cors';

export const OPTIONS = corsOptions;

export async function DELETE(req: Request) {
    try {
        const token = req.headers.get('Authorization')?.replace('Bearer ', '');
        if (!token) {
             return addCorsHeaders(NextResponse.json({ message: 'Unauthorized' }, { status: 401 }));
        }
        const payload = await verifyJWT(token);
        if (!payload || typeof payload.userId !== 'number') {
             return addCorsHeaders(NextResponse.json({ message: 'Unauthorized' }, { status: 401 }));
        }
        const userId = payload.userId;

        // Manual Cascade Delete
        // 1. Delete Transactions
        await db.delete(transactions).where(eq(transactions.userId, userId));
        
        // 2. Delete Items (Goals)
        await db.delete(items).where(eq(items.userId, userId));
        
        // 3. Delete Bank Accounts
        await db.delete(bankAccounts).where(eq(bankAccounts.userId, userId));

        // 4. Delete User
        await db.delete(users).where(eq(users.id, userId));

        return addCorsHeaders(NextResponse.json({ message: 'Account deleted successfully' }, { status: 200 }));
    } catch (error) {
        console.error('DELETE user error:', error);
        return addCorsHeaders(NextResponse.json({ message: 'Internal server error' }, { status: 500 }));
    }
}
