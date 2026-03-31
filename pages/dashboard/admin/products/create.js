import Layout from "../../../../components/layout/layout";
import ImageUpload from "../../../../components/products/ImageUpload";
import { useState } from "react";
import { useRouter } from "next/router";

export default function CreateProduct() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stock: "",
    image: "https://via.placeholder.com/150",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (url) => {
    setFormData({ ...formData, image: url });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nama produk wajib diisi";
    }

    if (formData.stock === "" || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = "Stock harus berupa angka positif";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          stock: parseInt(formData.stock),
          image: formData.image,
        }),
      });

      if (res.ok) {
        alert("Produk berhasil ditambahkan!");
        router.push("/dashboard/admin/products");
      } else {
        const data = await res.json();
        alert(data.message || "Gagal menambahkan produk");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout allowedRoles={["admin"]}>
      <div className="dashboard-shell max-w-2xl mx-auto">
        <div className="dash-header mb-6">
          <div>
            <h1 className="dash-title">Tambah Produk Baru</h1>
            <p className="dash-subtitle">Isi form di bawah untuk menambah produk</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nama Produk */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Produk <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Contoh: Laptop Gaming"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Upload Image */}
          <ImageUpload
            onUpload={handleImageUpload}
            initialImage={formData.image}
          />

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Deskripsi produk..."
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.stock ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="0"
              min="0"
            />
            {errors.stock && (
              <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push("/dashboard/admin/products")}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan Produk"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}