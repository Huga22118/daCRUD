import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Forbidden() {
  const router = useRouter();

  // Auto redirect ke dashboard user setelah 3 detik
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard/user");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center max-w-md">
        {/* Icon Forbidden */}
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Akses Ditolak
        </h1>
        <p className="text-gray-600 mb-6">
          Anda tidak memiliki izin untuk mengakses halaman ini. Halaman ini hanya dapat diakses oleh admin.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/dashboard/user")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Kembali ke Dashboard
          </button>
          <p className="text-sm text-gray-500">
            Redirecting ke dashboard dalam{" "}
            <span className="font-medium text-blue-600">3 detik</span>...
          </p>
        </div>
      </div>
    </div>
  );
}