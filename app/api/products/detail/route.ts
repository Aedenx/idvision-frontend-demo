import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Slug wajib disertakan" },
        { status: 400 },
      );
    }

    const [products]: any = await db.query(
      `SELECT p.*, c.name as category_name FROM products p 
       LEFT JOIN categories c ON p.category_id = c.category_id 
       WHERE p.slug = ? LIMIT 1`,
      [slug],
    );

    if (!products || products.length === 0) {
      return NextResponse.json(
        { success: false, message: "Produk tidak ditemukan" },
        { status: 404 },
      );
    }

    const product = products[0];

    const [images]: any = await db.query(
      "SELECT image_path, is_primary FROM product_images WHERE product_id = ?",
      [product.product_id],
    );

    const [variants]: any = await db.query(
      "SELECT * FROM product_variants WHERE product_id = ? AND is_active = 1",
      [product.product_id],
    );

    return NextResponse.json({
      success: true,
      data: {
        ...product,
        images,
        variants,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
