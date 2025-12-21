import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const clientId = process.env.FACEBOOK_CLIENT_ID;
    const redirectUri = process.env.FACEBOOK_REDIRECT_URI;

    if (!clientId || !redirectUri) {
        return NextResponse.json({ message: 'Facebook OAuth not configured' }, { status: 500 });
    }

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: 'email,public_profile',
        response_type: 'code',
    });

    return NextResponse.redirect(`https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`);
}