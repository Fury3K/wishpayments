import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { signJWT } from '@/lib/auth';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.redirect(new URL(`/auth-sync?error=${encodeURIComponent('Facebook login failed: ' + error)}`, req.url));
    }

    if (!code) {
        return NextResponse.redirect(new URL(`/auth-sync?error=${encodeURIComponent('No code provided')}`, req.url));
    }

    const clientId = process.env.FACEBOOK_CLIENT_ID;
    const clientSecret = process.env.FACEBOOK_CLIENT_SECRET;
    const redirectUri = process.env.FACEBOOK_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
         return NextResponse.redirect(new URL(`/auth-sync?error=${encodeURIComponent('Server configuration error')}`, req.url));
    }

    try {
        // Exchange code for access token
        const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
            params: {
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                code: code,
            }
        });

        const accessToken = tokenResponse.data.access_token;

        // Get user data
        const userResponse = await axios.get('https://graph.facebook.com/me', {
            params: {
                fields: 'id,name,email,picture.type(large)',
                access_token: accessToken,
            }
        });

        const userData = userResponse.data;
        const facebookId = userData.id;
        const email = userData.email;
        const name = userData.name;
        const picture = userData.picture?.data?.url;

        if (!email) {
            // Facebook might not return email if user didn't grant permission or signed up with phone
             return NextResponse.redirect(new URL(`/auth-sync?error=${encodeURIComponent('No email found from Facebook account')}`, req.url));
        }

        // Check if user exists by Facebook ID
        let [existingUser] = await db.select().from(users).where(eq(users.facebookId, facebookId));

        if (!existingUser) {
            // Check by email
            const [userByEmail] = await db.select().from(users).where(eq(users.email, email));
            
            if (userByEmail) {
                // Link Facebook ID to existing user
                [existingUser] = await db.update(users)
                    .set({ facebookId: facebookId, profilePicture: userByEmail.profilePicture || picture })
                    .where(eq(users.id, userByEmail.id))
                    .returning();
            } else {
                // Create new user
                [existingUser] = await db.insert(users)
                    .values({
                        email,
                        name,
                        facebookId,
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
        console.error('Facebook Auth Error:', err.response?.data || err.message);
        return NextResponse.redirect(new URL(`/auth-sync?error=${encodeURIComponent('Authentication failed')}`, req.url));
    }
}