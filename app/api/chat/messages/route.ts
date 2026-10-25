import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone =
      searchParams.get("phone") || searchParams.get("customer_phone");

    if (!phone) {
      return NextResponse.json({ success: true, data: [] });
    }

    const [messages]: any = await db.query(
      `SELECT chat_id, order_number, sender_type, sender_name, customer_phone, session_status, message, is_read, created_at 
       FROM chats WHERE customer_phone = ? ORDER BY created_at ASC`,
      [phone],
    );

    return NextResponse.json({
      success: true,
      data: messages,
    });
  } catch (error: any) {
    console.error("[Chat Messages API Error]:", error);
    return NextResponse.json(
      { success: false, message: error.message, data: [] },
      { status: 500 },
    );
  }
}
