import { getToken } from "next-auth/jwt";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  // ✅ Gunakan getToken() untuk API routes (lebih reliable daripada getSession)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (req.method === "GET") {
    // ✅ GET: List all products (public - tidak perlu auth)
    try {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  } else if (req.method === "POST") {
    // ✅ POST: Create new product (admin only)
    
    // Debug: log token untuk diagnosa
    console.log("=== API CREATE PRODUCT DEBUG ===");
    console.log("Token:", token);
    console.log("Token role:", token?.role);
    console.log("===============================");

    // ✅ Cek auth dengan getToken
    if (!token || token.role !== "admin") {
      console.log("❌ Forbidden: Missing token or not admin");
      return res.status(403).json({ message: "Forbidden: Admin only" });
    }

    try {
      const { name, description, stock, image } = req.body;

    if (!name || stock === undefined) {
      return res.status(400).json({ message: "Name and stock are required" });
    }

    const product = await prisma.product.create({
       data: {
        name: name.trim(),
        description: description?.trim() || "",
        stock: parseInt(stock),
        image: image || "https://via.placeholder.com/150",
      },
    });

    console.log("✅ Product created:", product.id);
    res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}