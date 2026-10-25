import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Nama, email, dan password wajib diisi." },
        { status: 400 },
      );
    }

    // 1. Cek apakah email sudah terdaftar
    const [existingUsers]: any = await db.query(
      `SELECT user_id FROM users WHERE email = ? LIMIT 1`,
      [email],
    );

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Email sudah terdaftar. Gunakan email lain.",
        },
        { status: 400 },
      );
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Simpan user baru ke database
    const [result]: any = await db.query(
      `INSERT INTO users (full_name, email, phone, password_hash, role, is_active) 
       VALUES (?, ?, ?, ?, 'customer', 1)`,
      [name, email, phone || null, hashedPassword],
    );

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil! Silakan login.",
      data: {
        user_id: result.insertId,
        full_name: name,
        email: email,
      },
    });
  } catch (error: any) {
    console.error("[Register API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal melakukan registrasi: " + error.message,
      },
      { status: 500 },
    );
  }
}
