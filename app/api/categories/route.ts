import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const [rows]: any = await db.query(
      "SELECT category_id, name, slug, description, image_path FROM categories ORDER BY name ASC",
    );

    const categories = rows.map((cat: any) => {
      // Penanganan path gambar agar sesuai dengan folder public/uploads/categories/
      let imageUrl = "/images/placeholder.jpg"; // Default fallback

      if (cat.image_path) {
        if (
          cat.image_path.startsWith("http://") ||
          cat.image_path.startsWith("https://")
        ) {
          imageUrl = cat.image_path;
        } else if (cat.image_path.startsWith("/")) {
          imageUrl = cat.image_path;
        } else {
          imageUrl = `/uploads/categories/${cat.image_path}`;
        }
      }

      return {
        id: cat.category_id,
        category_id: cat.category_id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: imageUrl,
        image_url: imageUrl, // Sediakan image_url agar konsisten dengan komponen frontend
      };
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error: any) {
    console.error("[GET /api/categories Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memuat daftar kategori: " + error.message,
        data: [],
      },
      { status: 500 },
    );
  }
}
