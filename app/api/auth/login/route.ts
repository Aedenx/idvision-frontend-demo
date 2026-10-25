import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password wajib diisi." },
        { status: 400 },
      );
    }

    const [users]: any = await db.query(
      `SELECT user_id, full_name, email, phone, password_hash, role FROM users WHERE email = ? LIMIT 1`,
      [email],
    );

    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, message: "Email atau password salah." },
        { status: 401 },
      );
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Email atau password salah." },
        { status: 401 },
      );
    }

    const { password_hash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      message: "Login berhasil",
      token: `token_idvision_${user.user_id}_${Date.now()}`,
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error("[Login API Error]:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memproses login: " + error.message },
      { status: 500 },
    );
  }
}
