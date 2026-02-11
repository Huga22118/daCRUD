// pages/_app.js
import "../app/globals.css";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider
      session={pageProps.session}
      // ✅ Tambahkan basePath untuk memastikan NextAuth tahu base URL
      basePath="/api/auth"
      // ✅ Disable auto-refetch untuk menghindari conflict dengan middleware
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      <Component {...pageProps} />
    </SessionProvider>
  );
}