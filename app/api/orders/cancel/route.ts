import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    const { order_number } = await request.json();

    if (!order_number) {
      return NextResponse.json(
        { success: false, message: "Nomor pesanan wajib diisi" },
        { status: 400 },
      );
    }

    const [result]: any = await db.query(
      `UPDATE orders SET order_status = 'cancelled' WHERE order_number = ? AND order_status = 'pending'`,
      [order_number],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Pesanan tidak dapat dibatalkan atau tidak ditemukan.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Pesanan berhasil dibatalkan.",
    });
  } catch (error: any) {
    console.error("[Cancel Order API Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
