import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { signJWT } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.redirect(new URL(`/auth-sync?error=${encodeURIComponent('Google login failed: ' + error)}`, req.url));
    }

    if (!code) {
        return NextResponse.redirect(new URL(`/auth-sync?error=${encodeURIComponent('No code provided')}`, req.url));
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
         return NextResponse.redirect(new URL(`/auth-sync?error=${encodeURIComponent('Server configuration error')}`, req.url));
    }

    try {
        const client = new OAuth2Client(clientId, clientSecret, redirectUri);
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token!,
            audience: clientId,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
             throw new Error('Invalid Google user data');
        }

        const googleId = payload.sub;
        const email = payload.email;
        const name = payload.name || email.split('@')[0];
        const picture = payload.picture;

        // Check if user exists by Google ID
        let [existingUser] = await db.select().from(users).where(eq(users.googleId, googleId));

        if (!existingUser) {
            // Check by email
            const [userByEmail] = await db.select().from(users).where(eq(users.email, email));
            
            if (userByEmail) {
                // Link Google ID to existing user
                [existingUser] = await db.update(users)
                    .set({ googleId: googleId, profilePicture: userByEmail.profilePicture || picture })
                    .where(eq(users.id, userByEmail.id))
                    .returning();
            } else {
                // Create new user
                [existingUser] = await db.insert(users)
                    .values({
                        email,
                        name,
                        googleId,
                        profilePicture: picture,
                        // No password for OAuth users
                    })
                    .returning();
            }
        } else if (picture && !existingUser.profilePicture) {
             // Update profile picture if missing
             await db.update(users).set({ profilePicture: picture }).where(eq(users.id, existingUser.id));
        }

        const token = await signJWT({ userId: existingUser.id, email: existingUser.email });

        return NextResponse.redirect(new URL(`/auth-sync?token=${token}`, req.url));

    } catch (err: any) {
        console.error('Google Auth Error:', err);
        return NextResponse.redirect(new URL(`/auth-sync?error=${encodeURIComponent('Authentication failed')}`, req.url));
    }
}