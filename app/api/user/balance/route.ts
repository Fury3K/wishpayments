import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, transactions } from '@/lib/schema';
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

    const userArray = await db.select({
      balance: users.balance,
      name: users.name,
      email: users.email,
      isWalletHidden: users.isWalletHidden,
    }).from(users).where(eq(users.id, userId));
    const user = userArray[0];

    if (!user) {
      return addCorsHeaders(NextResponse.json({ message: 'User not found' }, { status: 404 }));
    }

    return addCorsHeaders(NextResponse.json({ 
        balance: user.balance, 
        name: user.name, 
        email: user.email,
        isWalletHidden: user.isWalletHidden 
    }, { status: 200 }));
  } catch (error) {
    console.error('GET user balance/profile error:', error);
    return addCorsHeaders(NextResponse.json({ message: 'Internal server error' }, { status: 500 }));
  }
}

export async function PUT(req: Request) {
    try {
      const userId = await getUserIdFromRequest(req);
      if (!userId) {
        return addCorsHeaders(NextResponse.json({ message: 'Unauthorized' }, { status: 401 }));
      }
  
      const body = await req.json();
      const { balance, transaction, isWalletHidden } = body;
      
      const updateData: any = {};
      
      if (typeof balance !== 'undefined') {
          if (isNaN(parseInt(balance))) {
            return addCorsHeaders(NextResponse.json({ message: 'Invalid balance' }, { status: 400 }));
          }
          updateData.balance = parseInt(balance);
      }

      if (typeof isWalletHidden !== 'undefined') {
          updateData.isWalletHidden = isWalletHidden;
      }
  
      const [updatedUser] = await db.update(users)
        .set(updateData)
        .where(eq(users.id, userId))
        .returning({ balance: users.balance, isWalletHidden: users.isWalletHidden });
  
      if (!updatedUser) {
        return addCorsHeaders(NextResponse.json({ message: 'User not found' }, { status: 404 }));
      }

      if (transaction) {
          await db.insert(transactions).values({
              userId,
              amount: transaction.amount,
              type: transaction.type,
              description: transaction.description,
              bankId: null, // Wallet
              itemId: transaction.itemId || null,
              date: new Date()
          });
      }
  
      return addCorsHeaders(NextResponse.json({ balance: updatedUser.balance, isWalletHidden: updatedUser.isWalletHidden }, { status: 200 }));
    } catch (error) {
      console.error('PUT user balance error:', error);
      return addCorsHeaders(NextResponse.json({ message: 'Internal server error' }, { status: 500 }));
    }
  }