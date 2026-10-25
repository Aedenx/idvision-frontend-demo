import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID wajib diisi" },
        { status: 400 },
      );
    }

    const [orders]: any = await db.query(
      `SELECT order_id, order_number, total_amount, order_status, payment_status, created_at 
       FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId],
    );

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error: any) {
    console.error("[Get User Orders API Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
