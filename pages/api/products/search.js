import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { q } = req.query; // q = query search

    if (!q) {
      // Jika tidak ada query, return semua products
      const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(products);
    }

    // ✅ Search by name (case-insensitive)
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive", // Case-insensitive search
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Failed to search products" });
  }
}