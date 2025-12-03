import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { items, users } from '@/lib/schema';
import { eq, and, desc } from 'drizzle-orm';
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const isArchived = status === 'archived';

    const userItems = await db.select()
        .from(items)
        .where(and(eq(items.userId, userId), eq(items.isArchived, isArchived)))
        .orderBy(isArchived ? desc(items.dateArchived) : desc(items.dateAdded)); // Sort by archive date if archived, else added date

    return addCorsHeaders(NextResponse.json(userItems, { status: 200 }));
  } catch (error) {
    console.error('GET items error:', error);
    return addCorsHeaders(NextResponse.json({ message: 'Internal server error' }, { status: 500 }));
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return addCorsHeaders(NextResponse.json({ message: 'Unauthorized' }, { status: 401 }));
    }

    const { name, price, saved, type, priority } = await req.json();

    if (!name || !price || !type || !priority) {
      return addCorsHeaders(NextResponse.json({ message: 'Missing required fields' }, { status: 400 }));
    }

    const [newItem] = await db.insert(items).values({
      userId: userId,
      name,
      price: parseInt(price),
      saved: parseInt(saved || '0'),
      type,
      priority,
    }).returning();

    return addCorsHeaders(NextResponse.json(newItem, { status: 201 }));
  } catch (error) {
    console.error('POST item error:', error);
    return addCorsHeaders(NextResponse.json({ message: 'Internal server error' }, { status: 500 }));
  }
}