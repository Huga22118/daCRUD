import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  // ✅ Langkah 1: Cek apakah ini NextAuth route - LANGSUNG IZINKAN
  if (req.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // ✅ Langkah 2: Cek apakah ini API route lain - IZINKAN
  if (req.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // ✅ Langkah 3: Ambil token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // ✅ Langkah 4: Daftar halaman public
  const publicPaths = ['/login', '/register', '/unauthorized', '/forbidden'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // ✅ Langkah 5: Jika sudah login dan coba akses halaman public
  if (token && (pathname === '/login' || pathname === '/register')) {
    const redirectPath = token.role === 'admin' ? '/dashboard/admin' : '/dashboard/user';
    return NextResponse.redirect(new URL(redirectPath, req.url));
  }

  // ✅ Langkah 6: Jika belum login dan coba akses halaman protected
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // ✅ Langkah 7: Jika sudah login tapi coba akses halaman admin-only dengan role bukan admin
  if (token && pathname.startsWith('/dashboard/admin')) {
    if (token.role !== 'admin') {
      return NextResponse.redirect(new URL('/forbidden', req.url));
    }
  }

  // ✅ Langkah 8: Izinkan semua request lainnya
  return NextResponse.next();
}

// ✅ Konfigurasi matcher yang benar
export const config = {
  matcher: [
    // ✅ Match semua kecuali:
    // - NextAuth routes (/api/auth/*)
    // - Static files (_next/static, _next/image)
    // - Favicon
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};