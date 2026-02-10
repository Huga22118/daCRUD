import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signIn, getSession, useSession } from "next-auth/react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Auto redirect jika sudah login
  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      const userRole = session.user.role;
      if (userRole === 'admin') {
        router.push("/dashboard/admin");
      } else if (userRole === 'user') {
        router.push("/dashboard/user");
      }
    }
  }, [session, status, router]);

  // Check URL params for success message
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("success") === "registered") {
      alert("Registration successful! Please login.");
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      // Get session and redirect
      const session = await getSession();
      const userRole = session?.user?.role;

      if (userRole === 'admin') {
        router.push("/dashboard/admin");
      } else if (userRole === 'user') {
        router.push("/dashboard/user");
      } else {
        setError("Invalid role");
      }
    } else {
      setError("Login failed. Please check your credentials.");
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex-1 flex items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Sign In
          </h2>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="***********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Loading..." : "Sign In"}
            </button>
          </div>

          <p className="text-center text-gray-600 text-sm mt-4">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline font-medium">
              Sign up
            </a>
          </p>
        </form>
      </div>

      <footer className="py-4 text-center text-sm text-gray-500">
        © 2026 MyApp
      </footer>
    </div>
  );
}

export default LoginPage;