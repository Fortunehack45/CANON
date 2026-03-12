import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase middleware error: Missing environment variables');
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  try {
    const { data: { user } } = await supabase.auth.getUser();
    const pathname = request.nextUrl.pathname;
    
    console.log('Middleware check:', { pathname, user: user?.email || 'none' });

    // 1. If user is logged in and trying to access /auth, redirect to /
    if (user && pathname.startsWith('/auth')) {
      console.log('User logged in, redirecting from auth to /');
      return NextResponse.redirect(new URL('/', request.url));
    }

    // 2. If user is NOT logged in and trying to access root or protected pages, redirect to /auth/login
    // We explicitly list protected paths or patterns here
    const isProtectedPath = 
      pathname === '/' || 
      pathname.startsWith('/decisions') || 
      pathname.startsWith('/review') || 
      pathname.startsWith('/search') || 
      pathname.startsWith('/team') || 
      pathname.startsWith('/settings');

    if (!user && isProtectedPath) {
      console.log('No user, redirecting to /auth/login from:', pathname);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

  } catch (e) {
    console.error('Supabase middleware auth error:', e);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
