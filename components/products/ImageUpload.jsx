"use client";

import { useState } from "react";

export default function ImageUpload({ onUpload, initialImage }) {
  const [preview, setPreview] = useState(initialImage || "https://via.placeholder.com/150");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Only JPG, PNG, and WebP files are allowed");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setPreview(data.url);
        onUpload(data.url);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("https://via.placeholder.com/150");
    onUpload("https://via.placeholder.com/150");
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Gambar Produk
      </label>
      
      <div className="flex items-center gap-4">
        {/* Preview Image */}
        <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-300">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Upload Button & Info */}
        <div className="flex-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              {uploading ? "Uploading..." : "Pilih Gambar"}
            </div>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
          <p className="text-sm text-gray-500 mt-1">
            Format: JPG, PNG, WebP | Max: 5MB
          </p>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        {/* Remove Button */}
        {preview !== "https://via.placeholder.com/150" && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}