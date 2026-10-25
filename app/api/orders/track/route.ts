import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("order_number");

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, message: "Nomor pesanan tidak ditemukan" },
        { status: 400 },
      );
    }

    const [orders]: any = await db.query(
      `SELECT * FROM orders WHERE order_number = ? LIMIT 1`,
      [orderNumber],
    );

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { success: false, message: "Pesanan tidak ditemukan" },
        { status: 404 },
      );
    }

    const order = orders[0];

    const [items]: any = await db.query(
      `SELECT * FROM order_items WHERE order_id = ?`,
      [order.order_id],
    );

    order.items = items || [];

    return NextResponse.json({
      success: true,
      status: "success",
      data: order,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
