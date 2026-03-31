import Layout from "../../../../components/layout/layout";
import ProductTable from "../../../../components/products/ProductTable";
import SearchBar from "../../../../components/products/SearchBar";
import ConfirmationDialog from "../../../../components/products/ConfirmationDialog";
import { useState, useEffect } from "react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

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
      setFilteredProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error searching products:", error);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      const res = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Produk berhasil dihapus!");
        // Refresh list
        fetchProducts();
      } else {
        const data = await res.json();
        alert(data.message || "Gagal menghapus produk");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Terjadi kesalahan");
    }
  };

  return (
    <Layout allowedRoles={["admin"]}>
      <div className="dashboard-shell">
        <div className="dash-header mb-6">
          <div>
            <h1 className="dash-title">Manajemen Produk</h1>
            <p className="dash-subtitle">Kelola produk Anda</p>
          </div>
          <a
            href="/dashboard/admin/products/create"
            className="btn-primary"
          >
            <span>+</span>
            Tambah Produk
          </a>
        </div>

        <SearchBar onSearch={handleSearch} />

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : (
          <ProductTable
            products={filteredProducts}
            isAdmin={true}
            onDelete={(product) => {
              setProductToDelete(product);
              setShowDeleteDialog(true);
            }}
          />
        )}
      </div>

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Hapus Produk"
        message={`Apakah Anda yakin ingin menghapus produk "${productToDelete?.name}"?`}
      />
    </Layout>
  );
}