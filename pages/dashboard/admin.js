import Layout from "../../components/layout/layout";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchStats = async () => {
    try{
    const res = await fetch("/api/products/stats");
    if (res.ok){
      const data = await res.json();
      setStats(data);
    }
    }
    catch (error){
    console.error("Failed to fetch stats: ",error);
    }
    finally{
      setLoading(false);
    }
  };
  fetchStats();

  const interval = setInterval(fetchStats, 30000);
  return () => clearInterval(interval);
}, []);

const statCards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: "📦",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      label: "Low Stock",
      value: stats.lowStock,
      icon: "⚠️",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      label: "Out of Stock",
      value: stats.outOfStock,
      icon: "❌",
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
  ];


  const quickActions = [
    {
      title: "Manage Products",
      description: "View, add, edit, and delete products",
      icon: "📦",
      href: "/dashboard/admin/products",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Add New Product",
      description: "Quickly add a new product to inventory",
      icon: "➕",
      href: "/dashboard/admin/products/create",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: "👥",
      href: "#",
      color: "bg-purple-500 hover:bg-purple-600",
      disabled: true,
    },
    {
      title: "Reports",
      description: "View sales and inventory reports",
      icon: "📊",
      href: "#",
      color: "bg-orange-500 hover:bg-orange-600",
      disabled: true,
    },
  ];

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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="dashboard-shell mb-6">
          <div className="dash-header">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="dash-subtitle">Welcome back! Manage your store efficiently.</p>
            </div>
          </div>
        </div>

      {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {loading ? (
            // ✅ Loading state
            <div className="col-span-3 flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            statCards.map((stat, index) => (
              <div
                key={index}
                className={`card rounded-xl p-6 hover:shadow-lg transition-shadow border-l-4 ${
                  stat.color.replace("text-", "border-")
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bgColor} ${stat.color}`}>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>


        {/* Quick Actions */}
        <div className="dashboard-shell">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <p className="dash-subtitle mb-6">Access frequently used features quickly</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className={`${
                  action.disabled
                    ? "pointer-events-none opacity-50"
                    : action.color
                } rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{action.icon}</span>
                  <h3 className="text-lg font-bold">{action.title}</h3>
                </div>
                <p className="text-sm opacity-90">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/*
        <div className="dashboard-shell mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <p className="dash-subtitle mb-4">Latest actions and updates</p>

          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">{i + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Activity {i + 1}</p>
                    <p className="text-sm text-gray-500">Just now</p>
                  </div>
                </div>
                <span className="badge badge--gray">Info</span>
              </div>
            ))}
          </div>
        </div>
        */}
      </div>
    </Layout>
  );
}