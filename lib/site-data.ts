import { fetchFromApi } from "./api";

export interface SiteSettings {
  site_name: string;
  site_description: string;
  site_logo: string;
  address: string;
  phone: string;
  email: string;
  whatsapp_number: string;
  [key: string]: string;
}

/**
 * Pengaturan default fallback jika database/API belum siap
 */
export function getDefaultSettings(): SiteSettings {
  return {
    site_name: "IDVISION",
    site_description: "Kacamata Gaya & Outdoor UV400 Protection",
    site_logo: "/images/logo.png",
    address: "Jl. Raya Puspiptek, Pamulang Viktor, Tangerang Selatan, Banten",
    phone: "0858-7766-9323",
    email: "support@idvisionstore.web.id",
    whatsapp_number: "6285877669323",
  };
}

/**
 * Mengambil pengaturan situs (site settings) dari API Route Next.js (`/api/settings`)
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const result = await fetchFromApi("/settings", { cache: "no-store" });
    const rawSettings = result.data || result;

    if (Array.isArray(rawSettings)) {
      const settingsMap: Record<string, string> = {};
      rawSettings.forEach((item: any) => {
        const key = item.key_name || item.key || item.setting_key;
        const val = item.value || item.setting_value;
        if (key) settingsMap[key] = val;
      });
      return { ...getDefaultSettings(), ...settingsMap };
    } else if (typeof rawSettings === "object" && rawSettings !== null) {
      return { ...getDefaultSettings(), ...rawSettings };
    }

    return getDefaultSettings();
  } catch (error) {
    console.error("Gagal mengambil pengaturan situs:", error);
    return getDefaultSettings();
  }
}

/**
 * Statik Banner, Testimoni, & Data Promosi Halaman Utama
 */
export const HERO_BANNERS = [
  {
    id: 1,
    title: "Koleksi Kacamata Outdoor & Anti UV",
    subtitle: "Perlindungan maksimal UV400 dengan desain modern dan elegan.",
    image: "/images/hero-1.jpg",
    cta_text: "Belanja Sekarang",
    cta_link: "/products",
  },
  {
    id: 2,
    title: "Frame Ringan & Tahan Lama",
    subtitle:
      "Material TR90 dan Titanium kualitas tinggi untuk kenyamanan harian.",
    image: "/images/hero-2.jpg",
    cta_text: "Lihat Koleksi",
    cta_link: "/products?category=sunglasses",
  },
];

export const FEATURED_BENEFITS = [
  {
    icon: "ShieldCheck",
    title: "Garansi 100% Original",
    description: "Produk berkualitas tinggi dengan standar proteksi UV400.",
  },
  {
    icon: "Truck",
    title: "Pengiriman Cepat",
    description:
      "Siap kirim ke seluruh daerah Indonesia dengan packing aman bubble wrap.",
  },
  {
    icon: "Headphones",
    title: "Layanan Pelanggan CS",
    description:
      "Tim support responsif siap membantu konsultasi ukuran dan tipe kacamata.",
  },
];
