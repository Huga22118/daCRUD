import Layout from "../../components/layout/layout";

export default function UserDashboard() {
  return (
    <Layout
      allowedRoles={["user"]}
      footer={
        <>
          <span>User space</span>
          <span>© 2026 MyApp</span>
        </>
      }
    >
      <div className="dashboard-shell">
        <h2>User Dashboard</h2>
      </div>
    </Layout>
  );
}