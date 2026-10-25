import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      user_id,
      customer_name,
      customer_email,
      customer_phone,
      address,
      payment_method,
      items,
    } = body;

    const orderNumber = `IDV-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const totalAmount = items.reduce(
      (sum: number, item: any) =>
        sum + Number(item.price) * Number(item.quantity),
      0,
    );

    // 1. Simpan Header Pesanan
    const [orderResult]: any = await db.query(
      `INSERT INTO orders (order_number, user_id, customer_name, customer_email, customer_phone, shipping_address, total_amount, payment_method, payment_status, order_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
      [
        orderNumber,
        user_id ? parseInt(user_id, 10) : null,
        customer_name,
        customer_email,
        customer_phone,
        address,
        totalAmount,
        payment_method || "cod",
      ],
    );

    const orderId = orderResult.insertId;

    // 2. Simpan Detail Item Pesanan
    for (const item of items) {
      // Ekstrak ID murni jika formatnya kombinasi string "productId-variantId" (misal: "12-5")
      const rawId = String(item.product_id || item.id || "");
      const cleanProductId = parseInt(rawId.split("-")[0], 10);

      if (isNaN(cleanProductId)) {
        throw new Error(`ID Produk tidak valid: ${rawId}`);
      }

      const productName = item.name || item.product_name || "Kacamata IDVISION";

      // INSERT menyertakan kolom product_name
      await db.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          cleanProductId,
          productName,
          Number(item.quantity),
          Number(item.price),
          Number(item.price) * Number(item.quantity),
        ],
      );

      // Kurangi stok varian / produk
      await db.query(
        `UPDATE product_variants SET stock_quantity = GREATEST(stock_quantity - ?, 0) WHERE product_id = ? LIMIT 1`,
        [Number(item.quantity), cleanProductId],
      );
    }

    return NextResponse.json({
      success: true,
      status: "success",
      order_number: orderNumber,
      order_id: orderId,
      message: "Pesanan berhasil dibuat!",
    });
  } catch (error: any) {
    console.error("[Checkout Error]:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memproses pesanan: " + error.message },
      { status: 500 },
    );
  }
}
