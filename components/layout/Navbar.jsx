import { useSession } from "next-auth/react";
import { signOut} from "next-auth/react";
import Link from "next/link";
import { useRef, useState } from "react";

export default function Navbar({ onLogout }) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimerRef = useRef(null);

  const handleMenuEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setMenuOpen(true);
  };

// Gunakan signOut langsung dari NextAuth
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  const handleMenuLeave = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setMenuOpen(false);
      closeTimerRef.current = null;
    }, 120);
  };

  // Truncate nama jika terlalu panjang
  const truncateName = (name, maxLength = 15) => {
    if (!name) return "User";
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard/user" className="text-xl font-bold text-blue-600">
              MyApp
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session?.user && (
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
                  onClick={() => setMenuOpen((open) => !open)}
                  onFocus={handleMenuEnter}
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-2 py-1 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
                    {(session.user.name || "U").charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden sm:inline font-medium">
                    {truncateName(session.user.name)}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown menu */}
                <div
                  role="menu"
                  onMouseEnter={handleMenuEnter}
                  onMouseLeave={handleMenuLeave}
                  className={`absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 transition-all ${
                    menuOpen
                      ? "pointer-events-auto opacity-100 translate-y-0"
                      : "pointer-events-none opacity-0 translate-y-1"
                  }`}
                >
                  <div className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-800">{session.user.name || "User"}</div>
                    <div className="text-xs text-gray-500">{session.user.email}</div>
                  </div>
                  <div className="border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      role="menuitem"
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}