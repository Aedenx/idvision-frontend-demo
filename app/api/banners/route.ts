import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const [banners]: any = await db.query(
      `SELECT id, title, subtitle, image, cta_label, cta_link, sort_order, is_active 
       FROM banners 
       WHERE is_active = 1 
       ORDER BY sort_order ASC, id DESC`,
    );

    return NextResponse.json({
      success: true,
      status: "success",
      data: banners || [],
    });
  } catch (error: any) {
    console.error("[Banners API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data banner: " + error.message,
      },
      { status: 500 },
    );
  }
}
