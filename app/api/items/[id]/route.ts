import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { items, transactions } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
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

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return addCorsHeaders(NextResponse.json({ message: 'Unauthorized' }, { status: 401 }));
    }

    const resolvedParams = await params;
    const itemId = parseInt(resolvedParams.id, 10);
    if (isNaN(itemId)) {
      return addCorsHeaders(NextResponse.json({ message: 'Invalid item ID' }, { status: 400 }));
    }

    const item = await db.query.items.findFirst({
        where: and(eq(items.id, itemId), eq(items.userId, userId))
    });

    if (!item) {
      return addCorsHeaders(NextResponse.json({ message: 'Item not found' }, { status: 404 }));
    }

    return addCorsHeaders(NextResponse.json(item, { status: 200 }));
  } catch (error) {
    console.error('GET item error:', error);
    return addCorsHeaders(NextResponse.json({ message: 'Internal server error' }, { status: 500 }));
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return addCorsHeaders(NextResponse.json({ message: 'Unauthorized' }, { status: 401 }));
    }

    const resolvedParams = await params;
    const itemId = parseInt(resolvedParams.id, 10);
    if (isNaN(itemId)) {
      return addCorsHeaders(NextResponse.json({ message: 'Invalid item ID' }, { status: 400 }));
    }

    const { name, price, saved, type, priority, bankId, transaction } = await req.json();

    if (!name || !price || !type || !priority) {
      return addCorsHeaders(NextResponse.json({ message: 'Missing required fields' }, { status: 400 }));
    }

    const [updatedItem] = await db.update(items)
      .set({
        name,
        price: parseInt(price),
        saved: parseInt(saved || '0'),
        type,
        priority,
        bankId: bankId === undefined ? undefined : (bankId ? parseInt(bankId) : null),
      })
      .where(and(eq(items.id, itemId), eq(items.userId, userId)))
      .returning();

    if (!updatedItem) {
      return addCorsHeaders(NextResponse.json({ message: 'Item not found or unauthorized' }, { status: 404 }));
    }

    if (transaction) {
        await db.insert(transactions).values({
            userId,
            amount: transaction.amount,
            type: transaction.type,
            description: transaction.description,
            bankId: transaction.bankId || null,
            itemId: updatedItem.id,
            date: new Date()
        });
    }

    return addCorsHeaders(NextResponse.json(updatedItem, { status: 200 }));
  } catch (error) {
    console.error('PUT item error:', error);
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
    const itemId = parseInt(resolvedParams.id, 10);
    if (isNaN(itemId)) {
      return addCorsHeaders(NextResponse.json({ message: 'Invalid item ID' }, { status: 400 }));
    }

    const [deletedItem] = await db.update(items)
      .set({
        isArchived: true,
        dateArchived: new Date(),
      })
      .where(and(eq(items.id, itemId), eq(items.userId, userId)))
      .returning();

    if (!deletedItem) {
      return addCorsHeaders(NextResponse.json({ message: 'Item not found or unauthorized' }, { status: 404 }));
    }

    return addCorsHeaders(NextResponse.json({ message: 'Item archived successfully' }, { status: 200 }));
  } catch (error) {
    console.error('DELETE item error:', error);
    return addCorsHeaders(NextResponse.json({ message: 'Internal server error' }, { status: 500 }));
  }
}