import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    // If no token, redirect to login page for protected routes
    if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/api/items')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  const payload = await verifyJWT(token);

  if (!payload) {
    // If token is invalid, redirect to login page for protected routes
    if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/api/items')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Attach user info to request (if needed for API routes)
  // For Next.js middleware, this is usually done by setting headers or rewriting the request.
  // For now, simply allow access if token is valid.
  const response = NextResponse.next();
  // response.headers.set('x-user-id', payload.userId); // Example: setting user ID in a header

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/items/:path*', '/api/auth/logout'], // Apply middleware to dashboard and item API routes
};