import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bankAccounts, transactions } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { verifyJWT } from '@/lib/auth';
import { addCorsHeaders, corsOptions } from '@/lib/cors';

export const OPTIONS = corsOptions;

async function getUserIdFromRequest(req: Request): Promise<number | null> {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return null;
    const payload = await verifyJWT(token);
    if (!payload || typeof payload.userId !== 'number') return null;
    return payload.userId;
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) {
            return addCorsHeaders(NextResponse.json({ message: 'Unauthorized' }, { status: 401 }));
        }

        const resolvedParams = await params;
        const bankId = parseInt(resolvedParams.id, 10);
        if (isNaN(bankId)) {
            return addCorsHeaders(NextResponse.json({ message: 'Invalid bank ID' }, { status: 400 }));
        }

        const { name, color, balance, transaction } = await req.json();

        const [updatedBank] = await db.update(bankAccounts)
            .set({
                name,
                color,
                balance: parseInt(balance),
            })
            .where(and(eq(bankAccounts.id, bankId), eq(bankAccounts.userId, userId)))
            .returning();

        if (!updatedBank) {
            return addCorsHeaders(NextResponse.json({ message: 'Bank not found' }, { status: 404 }));
        }

        if (transaction) {
            await db.insert(transactions).values({
                userId,
                amount: transaction.amount,
                type: transaction.type,
                description: transaction.description,
                bankId: updatedBank.id,
                itemId: transaction.itemId || null,
                date: new Date()
            });
        }

        return addCorsHeaders(NextResponse.json(updatedBank, { status: 200 }));
    } catch (error) {
        console.error('PUT bank error:', error);
        return addCorsHeaders(NextResponse.json({ message: 'Internal server error' }, { status: 500 }));
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) {
            return addCorsHeaders(NextResponse.json({ message: 'Unauthorized' }, { status: 401 }));
        }

        const resolvedParams = await params;
        const bankId = parseInt(resolvedParams.id, 10);
        if (isNaN(bankId)) {
            return addCorsHeaders(NextResponse.json({ message: 'Invalid bank ID' }, { status: 400 }));
        }

        const [deletedBank] = await db.delete(bankAccounts)
            .where(and(eq(bankAccounts.id, bankId), eq(bankAccounts.userId, userId)))
            .returning();

        if (!deletedBank) {
            return addCorsHeaders(NextResponse.json({ message: 'Bank not found' }, { status: 404 }));
        }

        return addCorsHeaders(NextResponse.json({ message: 'Bank deleted successfully' }, { status: 200 }));
    } catch (error) {
        console.error('DELETE bank error:', error);
        return addCorsHeaders(NextResponse.json({ message: 'Internal server error' }, { status: 500 }));
    }
}