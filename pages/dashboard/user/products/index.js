import Layout from "../../../../components/layout/layout";
import ProductTable from "../../../../components/products/ProductTable";
import SearchBar from "../../../../components/products/SearchBar";
import { useState, useEffect } from "react";

export default function UserProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  return (
    <Layout allowedRoles={["user", "admin"]}>
      <div className="dashboard-shell">
        <div className="dash-header mb-6">
          <div>
            <h1 className="dash-title">Daftar Produk</h1>
            <p className="dash-subtitle">Lihat semua produk yang tersedia</p>
          </div>
        </div>

        <SearchBar onSearch={handleSearch} />

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : (
          <ProductTable products={filteredProducts} isAdmin={false} />
        )}
      </div>
    </Layout>
  );
}