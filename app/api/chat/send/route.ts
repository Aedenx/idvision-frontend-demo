import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Menerima parameter fleksibel (phone atau customer_phone)
    const phone = body.phone || body.customer_phone;
    const sender_name = body.sender_name || body.name || "Pelanggan";
    const sender_type = body.sender_type || "customer";
    const message = body.message;
    const order_number = body.order_number || "";

    if (!phone || !message) {
      return NextResponse.json(
        { success: false, message: "Nomor telepon dan pesan wajib diisi." },
        { status: 400 },
      );
    }

    // 1. Simpan pesan dari customer
    const [result]: any = await db.query(
      `INSERT INTO chats (customer_phone, sender_name, sender_type, message, order_number, session_status) 
       VALUES (?, ?, ?, ?, ?, 'admin_active')`,
      [phone, sender_name, sender_type, message, order_number],
    );

    // 2. Kirim balasan otomatis sederhana dari AI jika diperlukan (Opsional)
    // Anda bisa mengomentari bagian ini jika hanya fokus pada Admin CS
    const lowerMsg = message.toLowerCase();
    let autoReply = "";

    if (lowerMsg.includes("stok") || lowerMsg.includes("katalog")) {
      autoReply =
        "Halo! Semua kacamata yang tampil di katalog IDVISION ready stock dan siap dikirim. Silakan cek halaman /products ya!";
    } else if (lowerMsg.includes("lacak") || lowerMsg.includes("resi")) {
      autoReply =
        "Untuk melacak pesanan Anda, silakan kunjungi menu Akun / Pesanan Saya atau gunakan fitur Lacak Pesanan dengan memasukkan Nomor Pesanan.";
    } else if (lowerMsg.includes("bayar") || lowerMsg.includes("pembayaran")) {
      autoReply =
        "IDVISION mendukung pembayaran via Bank Transfer, E-Wallet, dan Cash on Delivery (COD).";
    }

    if (autoReply) {
      await db.query(
        `INSERT INTO chats (customer_phone, sender_name, sender_type, message, order_number, session_status) 
         VALUES (?, 'AI Assistant IDVISION', 'ai', ?, ?, 'admin_active')`,
        [phone, autoReply, order_number],
      );
    }

    return NextResponse.json({
      success: true,
      message: "Pesan berhasil terkirim.",
      chat_id: result.insertId,
    });
  } catch (error: any) {
    console.error("[Send Chat API Error]:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengirim pesan: " + error.message },
      { status: 500 },
    );
  }
}
