import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/account']; // Allow guest checkout

// Routes that should redirect to account if already authenticated
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path starts with any protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Get the auth token from cookies
  const authCookie = request.cookies.get('auth-storage');
  let isAuthenticated = false;

  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie.value);
      isAuthenticated = authData.state?.isAuthenticated && authData.state?.token;
    } catch (error) {
      // Invalid cookie data
      isAuthenticated = false;
    }
  }

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to account if accessing auth routes while already authenticated
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  return NextResponse.next();
}

// Configure which routes should trigger the middleware
export const config = {
  matcher: [
    '/account/:path*',
    '/login',
    '/register',
  ],
};
