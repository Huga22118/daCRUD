import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Unauthorized() {
  const router = useRouter();

  // Auto redirect ke login setelah 3 detik
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center max-w-md">
        {/* Icon Lock */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Akses Dibatasi
        </h1>
        <p className="text-gray-600 mb-6">
          Anda tidak memiliki izin untuk mengakses halaman ini. Silakan login terlebih dahulu.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Login Sekarang
          </button>
          <p className="text-sm text-gray-500">
            Redirecting ke halaman login dalam{" "}
            <span className="font-medium text-blue-600">3 detik</span>...
          </p>
        </div>
      </div>
    </div>
  );
}