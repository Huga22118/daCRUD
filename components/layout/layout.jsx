"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Navbar from "./Navbar";

export default function Layout({ children, allowedRoles = ["user", "admin"], footer = null }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Debug
  useEffect(() => {
    console.log("Layout - Session:", session);
    console.log("Layout - Status:", status);
    console.log("Layout - Allowed Roles:", allowedRoles);
  }, [session, status, allowedRoles]);

  // ✅ HANYA cek role, tidak perlu cek login (middleware sudah handle)
  useEffect(() => {
    if (status === "loading") return;
    if (session && !allowedRoles.includes(session.user?.role)) {
      console.log("Layout - Role not allowed, redirecting to forbidden");
      router.push("/forbidden");
    }
  }, [session, status, allowedRoles, router]);

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // ✅ JANGAN redirect jika belum login - biarkan middleware handle
  // if (!session) {
  //   return null;
  // }

  // Jika role tidak diizinkan
  if (status === "authenticated" && !allowedRoles.includes(session.user?.role)) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">
          {children}
        </main>
        {footer && (
          <footer className="dashboard-footer">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}