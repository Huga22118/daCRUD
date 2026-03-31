import { getToken } from "next-auth/jwt";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { id } = req.query;

  if (req.method === "GET") {
    // ✅ GET: Get product by ID
    try {
      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  } else if (req.method === "PUT") {
    // ✅ PUT: Update product (admin only)
    console.log("=== API UPDATE PRODUCT DEBUG ===");
    console.log("Token:", token);
    console.log("Token role:", token?.role);
    console.log("===============================");

    if (!token || token.role !== "admin") {
      console.log("❌ Forbidden: Missing token or not admin");
      return res.status(403).json({ message: "Forbidden: Admin only" });
    }

    try {
      const { name, description, stock, image } = req.body;

      // Validasi required fields
      if (!name || stock === undefined) {
        return res.status(400).json({ message: "Name and stock are required" });
      }

      const product = await prisma.product.update({
        where: { id },
        data: {
          name: name.trim(),
          description: description?.trim() || "",
          stock: parseInt(stock, 10),
          image: image || "https://via.placeholder.com/150",
        },
      });
    
      console.log("✅ Product updated:", product.id);
      res.status(200).json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  } else if (req.method === "DELETE") {
    // ✅ DELETE: Delete product (admin only)
    console.log("=== API DELETE PRODUCT DEBUG ===");
    console.log("Token:", token);
    console.log("Token role:", token?.role);
    console.log("===============================");

    if (!token || token.role !== "admin") {
      console.log("❌ Forbidden: Missing token or not admin");
      return res.status(403).json({ message: "Forbidden: Admin only" });
    }

    try {
      await prisma.product.delete({
        where: { id },
      });

      console.log("✅ Product deleted:", id);
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(500).json({ message: "Failed to delete product" });
    }
  } else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}