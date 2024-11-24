import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import authConfig from "./config/auth.config"
import NextAuth from "next-auth"
import { decode } from 'next-auth/jwt';

import { 
  publicRoutes, 
  authRoutes, 
  DEFAULT_LOGIN_REDIRECT, 
  apiAuthPrefix 
} from "./routes"
 
// Use only one of the two middleware options below
// 1. Use middleware directly
// export const { auth: middleware } = NextAuth(authConfig)
 
// 2. Wrapped middleware option
const { auth } = NextAuth(authConfig)

export default auth(async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  const method = req.method; // Extract the HTTP method

  if (nextUrl.pathname === '/api/webhook' && method === 'POST') {
    return NextResponse.next({
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = req.cookies.get('authjs.session-token');
  let isLoggedIn = !!req.cookies.get('authjs.session-token'); // Check if token exists


  const secret = process.env.AUTH_SECRET || '';
  if (token) {
    try {
      // Decode and verify the token
      const session = await auth()
      console.log('Decoded Token:', session);
      isLoggedIn = true; // Token is valid
    } catch (err) {
      console.error('Token verification failed:', err);
      isLoggedIn = false; // Token is invalid
    }
  }

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  if (isApiAuthRoute) {
    return NextResponse.next();
  }
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isPublicRoute && !isLoggedIn) {
    return Response.redirect(new URL('/', nextUrl));
  }

  return NextResponse.next();

})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}