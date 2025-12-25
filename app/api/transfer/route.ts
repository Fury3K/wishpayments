import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bankAccounts, users, transactions } from '@/lib/schema';
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

export async function POST(req: Request) {
    try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) {
            return addCorsHeaders(NextResponse.json({ message: 'Unauthorized' }, { status: 401 }));
        }

        const { sourceId, destinationId, amount } = await req.json();

        // Validation
        if (!sourceId || !destinationId || !amount || amount <= 0) {
             return addCorsHeaders(NextResponse.json({ message: 'Invalid transfer details' }, { status: 400 }));
        }
        if (sourceId === destinationId) {
             return addCorsHeaders(NextResponse.json({ message: 'Cannot transfer to same account' }, { status: 400 }));
        }

        await db.transaction(async (tx) => {
            // 1. Deduct from Source
            let sourceName = '';
            if (sourceId === 'wallet') {
                const userRes = await tx.select().from(users).where(eq(users.id, userId));
                if (!userRes[0] || userRes[0].balance < amount) throw new Error('Insufficient wallet balance');
                await tx.update(users).set({ balance: userRes[0].balance - amount }).where(eq(users.id, userId));
                sourceName = 'WishPay Wallet';
            } else {
                const bankRes = await tx.select().from(bankAccounts).where(and(eq(bankAccounts.id, parseInt(sourceId)), eq(bankAccounts.userId, userId)));
                if (!bankRes[0] || bankRes[0].balance < amount) throw new Error('Insufficient bank balance');
                await tx.update(bankAccounts).set({ balance: bankRes[0].balance - amount }).where(eq(bankAccounts.id, parseInt(sourceId)));
                sourceName = bankRes[0].name;
            }

            // 2. Add to Destination
            let destName = '';
            if (destinationId === 'wallet') {
                const userRes = await tx.select().from(users).where(eq(users.id, userId));
                await tx.update(users).set({ balance: userRes[0].balance + amount }).where(eq(users.id, userId));
                destName = 'WishPay Wallet';
            } else {
                const bankRes = await tx.select().from(bankAccounts).where(and(eq(bankAccounts.id, parseInt(destinationId)), eq(bankAccounts.userId, userId)));
                if (!bankRes[0]) throw new Error('Destination bank not found');
                await tx.update(bankAccounts).set({ balance: bankRes[0].balance + amount }).where(eq(bankAccounts.id, parseInt(destinationId)));
                destName = bankRes[0].name;
            }

            // 3. Log Transactions (Two records: Outgoing and Incoming)
            
            // Outgoing Record
            await tx.insert(transactions).values({
                userId,
                amount,
                type: 'transfer',
                description: `Transferred to ${destName}`,
                bankId: sourceId === 'wallet' ? null : parseInt(sourceId),
                itemId: null,
                date: new Date()
            });
            
            // Incoming Record
            await tx.insert(transactions).values({
                userId,
                amount,
                type: 'transfer', 
                description: `Transferred from ${sourceName}`,
                bankId: destinationId === 'wallet' ? null : parseInt(destinationId),
                itemId: null,
                date: new Date() // Same timestamp
            });
        });

        return addCorsHeaders(NextResponse.json({ message: 'Transfer successful' }, { status: 200 }));

    } catch (error: any) {
        return addCorsHeaders(NextResponse.json({ message: error.message || 'Transfer failed' }, { status: 500 }));
    }
}
