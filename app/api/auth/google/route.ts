import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !redirectUri) {
        return NextResponse.json({ message: 'Google OAuth not configured' }, { status: 500 });
    }

    const client = new OAuth2Client(clientId, process.env.GOOGLE_CLIENT_SECRET, redirectUri);

    const authorizeUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
        prompt: 'consent', // Force consent to ensure we get a refresh token if needed (though we mostly need id_token)
    });

    return NextResponse.redirect(authorizeUrl);
}