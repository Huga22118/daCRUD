"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimerRef = useRef(null);

  // Debug: log session dan status
  useEffect(() => {
    console.log("Navbar - Session:", session);
    console.log("Navbar - Status:", status);
    console.log("Navbar - Menu Open:", menuOpen);
  }, [session, status, menuOpen]);

  // Jangan render navbar jika session masih loading
  if (status === "loading") {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-xl font-bold text-blue-600">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  // Jika session null (belum login), jangan render dropdown
  if (status !== "authenticated") {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              MyApp
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  const handleMenuEnter = () => {
    console.log("Menu enter");
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setMenuOpen(true);
  };

  const handleMenuLeave = () => {
    console.log("Menu leave");
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setMenuOpen(false);
      closeTimerRef.current = null;
    }, 120);
  };

  const truncateName = (name, maxLength = 15) => {
    if (!name) return "User";
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    window.location.href = "/api/auth/signout?callbackUrl=/login";
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link
              href={session?.user?.role === "admin" ? "/dashboard/admin" : "/dashboard/user"}
              className="text-xl font-bold text-blue-600"
            >
              MyApp
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div
              className="relative"
              onMouseEnter={handleMenuEnter}
              onMouseLeave={handleMenuLeave}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setMenuOpen(false);
                }
              }}
            >
              <button
                type="button"
                onClick={() => {
                  console.log("Button clicked - toggling menu");
                  setMenuOpen((open) => !open);
                }}
                onFocus={handleMenuEnter}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-2 py-1 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
                  {(session.user?.name || "U").charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline font-medium">
                  {truncateName(session.user?.name)}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu - selalu render, tapi sembunyikan jika menuOpen=false */}
              <div
                role="menu"
                onMouseEnter={handleMenuEnter}
                onMouseLeave={handleMenuLeave}
                className={`absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 transition-all duration-200 ease-in-out ${
                  menuOpen
                    ? "pointer-events-auto opacity-100 translate-y-0"
                    : "pointer-events-none opacity-0 translate-y-1"
                }`}
                style={{ zIndex: 50 }}
              >
                <div className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-800">
                    {session.user?.name || "User"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {session.user?.email}
                  </div>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      session.user?.role === "admin" 
                        ? "bg-purple-100 text-purple-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {session.user?.role === "admin" ? "👑 Admin" : "👤 User"}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogout();
                    }}
                    role="menuitem"
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    🔑 Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}