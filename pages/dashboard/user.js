// pages/dashboard/user.js
import Layout from "../../components/layout/layout";
import { useSession } from "next-auth/react";

export default function UserDashboard() {
  const { data: session, status } = useSession();

  // ✅ Debug
  console.log("=== DASHBOARD DEBUG ===");
  console.log("Status:", status);
  console.log("Session:", session);
  console.log("=======================");

  return (
    <Layout allowedRoles={["user"]}
     footer={
          <>
            <span>Admin panel</span>
            <span>© 2026 MyApp</span>
          </>
        }
    >
      <div className="dashboard-shell">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">User Dashboard</h2>
        {session && (
          <div>
            <p>Welcome, {session.user?.name}!</p>
            <p>Role: {session.user?.role}</p>
            <p>Email: {session.user?.email}</p>
          </div>
        )}
      </div>
    </Layout>
  );
} 