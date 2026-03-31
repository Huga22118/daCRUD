"use client";

import Link from "next/link";

export default function ProductTable({ products, isAdmin = false, onDelete }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Tidak ada produk</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            {/* <th>ID</th> */}
            <th>Gambar</th>
            <th>Nama Produk</th>
            <th>Deskripsi</th>
            <th>Stock</th>
            <th>Tanggal Dibuat</th>
            {isAdmin && <th>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              {/* <td className="font-mono text-sm">{product.id.substring(0, 8)}</td> */}
              <td>
                <div className="avatar">
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </td>
              <td className="font-medium">{product.name}</td>
              <td className="max-w-xs truncate">{product.description || "-"}</td>
              <td>
                <span className={`badge ${
                  product.stock > 0 ? "badge--green" : "badge--red"
                }`}>
                  {product.stock}
                </span>
              </td>
              <td className="text-sm text-gray-500">
                {new Date(product.createdAt).toLocaleDateString("id-ID")}
              </td>
              {isAdmin && (
                <td>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/admin/products/edit/${product.id}`}
                      className="action-btn"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => onDelete && onDelete(product)}
                      className="action-btn text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}