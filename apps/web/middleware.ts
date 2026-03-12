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
    console.log('Middleware auth check - User:', user ? user.email : 'None', 'Path:', request.nextUrl.pathname);

    // Protect all routes inside /(dashboard)
    const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
    const isApiPage = request.nextUrl.pathname.startsWith('/api');
    
    if (!user && !isAuthPage && !isApiPage) {
      console.log('Middleware: No user, redirecting to /auth/login');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // If the user IS logged in and trying to access the login/signup page, redirect to the dashboard
    if (user && isAuthPage) {
      console.log('Middleware: User logged in, redirecting from auth page to /');
      return NextResponse.redirect(new URL('/', request.url));
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
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
