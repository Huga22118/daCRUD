import Layout from "../../components/layout/layout";
import ProductTable from "../../components/products/ProductTable";
import SearchBar from "../../components/products/SearchBar";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function UserDashboard() {
  const {  session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setError(null);
      const res = await fetch("/api/products");
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setError("Gagal memuat daftar produk. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      setError(null);
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setFilteredProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to search products:", error);
      setError("Gagal melakukan pencarian. Silakan coba lagi.");
    }
  };

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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="dashboard-shell mb-6">
          <div className="dash-header">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
              <p className="dash-subtitle">
                Welcome back, {session?.user?.name || "User"}! Browse available products.
              </p>
            </div>
          </div>
        </div>

        {/* Product Catalog */}
        <div className="dashboard-shell">
          <div className="dash-header mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Product Catalog</h2>
              <p className="dash-subtitle">Browse all available products</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          <SearchBar onSearch={handleSearch} />
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-600">
                {products.length > 0 
                  ? "Try adjusting your search terms" 
                  : "No products available at the moment"}
              </p>
            </div>
          ) : (
            <ProductTable products={filteredProducts} isAdmin={false} />
          )}
        </div>
      </div>
    </Layout>
  );
}