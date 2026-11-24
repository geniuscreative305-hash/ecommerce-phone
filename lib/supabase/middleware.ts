import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const secretAdminPath = process.env.NEXT_PUBLIC_ADMIN_PATH || '/admin';
  const hasCustomAdminPath = secretAdminPath !== '/admin';

  const pathname = request.nextUrl.pathname;

  // 1. Stealth Routing: Block automated scanner probing /admin or /wp-admin when custom path is active
  if (hasCustomAdminPath) {
    if (pathname.startsWith('/admin') || pathname.startsWith('/wp-admin')) {
      return new NextResponse('404 Not Found', { status: 404 });
    }
  }

  // 2. Check Auth Session
  let hasAuth = false;
  const adminCookie = request.cookies.get('admin_session')?.value;
  if (adminCookie === 'authenticated') {
    hasAuth = true;
  }

  if (!hasAuth && supabaseUrl && supabaseKey) {
    try {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        hasAuth = true;
      }
    } catch {
      // Ignored
    }
  }

  // Determine if requesting admin panel
  const isTargetingAdmin = hasCustomAdminPath
    ? pathname.startsWith(secretAdminPath)
    : pathname.startsWith('/admin');

  const loginRoute = hasCustomAdminPath ? `${secretAdminPath}/login` : '/admin/login';
  const isLoginPage = pathname === loginRoute || pathname === '/admin/login';

  // 3. Strict 3-Gate Access Protection
  if (isTargetingAdmin && !isLoginPage && !hasAuth) {
    const url = request.nextUrl.clone();
    url.pathname = loginRoute;
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // 4. Internal Rewrite for Custom Secret Admin Path
  if (hasCustomAdminPath && pathname.startsWith(secretAdminPath)) {
    const subpath = pathname.substring(secretAdminPath.length) || '/';
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/admin${subpath === '/' ? '' : subpath}`;
    return NextResponse.rewrite(rewriteUrl, {
      headers: supabaseResponse.headers,
    });
  }

  return supabaseResponse;
}
