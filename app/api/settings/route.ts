import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const [rows]: any = await db.query("SELECT * FROM settings");

    const settingsMap: Record<string, string> = {};
    if (Array.isArray(rows)) {
      rows.forEach((item: any) => {
        const key = item.key_name || item.key || item.setting_key;
        const val = item.value || item.setting_value;
        if (key) settingsMap[key] = val;
      });
    }

    return NextResponse.json({
      success: true,
      data: settingsMap,
    });
  } catch (error: any) {
    // Fallback jika tabel settings belum ada / error
    return NextResponse.json({
      success: true,
      data: {
        site_name: "IDVISION",
        site_description: "Kacamata Gaya & Outdoor UV400 Protection",
        site_logo: "/images/logo.png",
        address:
          "Jl. Raya Puspiptek, Pamulang Viktor, Tangerang Selatan, Banten",
        phone: "0858-7766-9323",
        email: "support@idvisionstore.web.id",
        whatsapp_number: "6285877669323",
      },
    });
  }
}
