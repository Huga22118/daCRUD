import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Daftar halaman public (tidak perlu login)
  const publicPaths = ["/login", "/register", "/unauthorized"];

  // Cek apakah path adalah public
  const isPublicPath = publicPaths.some(path => 
    pathname.startsWith(path)
  );

  // ✅ Tambahkan pengecualian untuk API routes
  const isApiRoute = pathname.startsWith("/api");

  // Jika sudah login dan coba akses halaman public
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard/user", req.url));
  }

  // Jika belum login dan coba akses halaman protected
  if (!token && !isPublicPath && !isApiRoute) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // ✅ Izinkan semua API routes (termasuk /api/auth/signout)
  if (isApiRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};