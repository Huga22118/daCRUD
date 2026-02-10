  import Layout from "../../components/layout/layout";

  export default function AdminDashboard() {
    return (
      <Layout
        allowedRoles={["admin"]}
        footer={
          <>
            <span>Admin panel</span>
            <span>© 2026 MyApp</span>
          </>
        }
      >
        <div className="dashboard-shell">
          <h2>Admin Dashboard</h2>
        </div>
      </Layout>
    );
  }