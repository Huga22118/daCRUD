import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const form = formidable({
      uploadDir: path.join(process.cwd(), "public", "uploads"),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB max
      filename: (name, ext, part, form) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        return `product-${uniqueSuffix}${ext}`;
      },
    });

    // Create uploads directory if not exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Upload error:", err);
        return res.status(500).json({ message: "Upload failed" });
      }

      if (!files.image) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const file = Array.isArray(files.image) ? files.image[0] : files.image;
      
      // Get relative path for URL
      const filePath = `/uploads/${path.basename(file.filepath)}`;

      res.status(200).json({
        success: true,
        url: filePath,
        filename: path.basename(file.filepath),
      });
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
}