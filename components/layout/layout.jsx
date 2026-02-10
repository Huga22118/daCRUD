import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Navbar from "./Navbar";

export default function Layout({ children, allowedRoles = ["user", "admin"], footer = null }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Hanya cek role, tidak perlu cek login (sudah dihandle middleware)
  useEffect(() => {
    if (status === "loading") return;
    if (session && !allowedRoles.includes(session.user.role)) {
      router.push("/unauthorized");
    }
  }, [session, status, allowedRoles, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    // Middleware seharusnya sudah handle ini, tapi fallback tetap ada
    router.push("/unauthorized");
    return null;
  }

  if (session && !allowedRoles.includes(session.user.role)) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <Navbar/>
        <main className="flex-1 p-6">{children}</main>
        {footer ? <footer className="dashboard-footer">{footer}</footer> : null}
      </div>
    </div>
  );
}