"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin, Globe, MessageCircle } from "lucide-react";
import { getSiteSettings } from "@/lib/site-data";

export default function Footer() {
  const pathname = usePathname();
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    getSiteSettings().then((data) => {
      if (data) {
        setSiteSettings(data);
      }
    });
  }, []);

  // JIKA SEDANG DI HALAMAN LOGIN, JANGAN TAMPILKAN FOOTER
  if (pathname === "/login") {
    return null;
  }

  const siteName = siteSettings.site_name || "IDVISION";
  const siteDescription =
    siteSettings.site_description || "Kacamata Gaya & Outdoor IDVISION";
  const address =
    siteSettings.address ||
    "Jl. Raya Puspiptek, Buaran, Serpong, Tangerang Selatan";
  const phone = siteSettings.phone || "0858-7766-9323";
  const email = siteSettings.email || "support@idvision.com";
  const whatsappNumber = siteSettings.whatsapp_number || "6285877669323";

  // URL Logo disesuaikan ke folder public Next.js
  const logoPath =
    siteSettings.footer_logo || siteSettings.site_logo || siteSettings.logo;
  const logoFooterUrl = logoPath
    ? logoPath.startsWith("http") || logoPath.startsWith("/")
      ? logoPath
      : `/uploads/${logoPath.replace(/^\//, "")}`
    : "/images/logo.png";

  const defaultMessage = encodeURIComponent(
    `Halo ${siteName}, saya ingin bertanya tentang produk kacamata gaya.`,
  );
  const waUrl = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;

  return (
    <footer className="border-t border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-800/80 dark:bg-zinc-950 dark:text-zinc-400 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Kolom 1: Brand & Slogan Kacamata Gaya Dinamis */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex flex-col items-start gap-1 group"
            >
              <img
                src={logoFooterUrl}
                alt={siteName}
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/logo.png";
                }}
              />
              <span className="text-xs font-black uppercase tracking-[0.25em] text-zinc-900 dark:text-zinc-200 mt-1">
                <span className="text-emerald-500 dark:text-emerald-400">
                  {siteName.substring(0, 2)}
                </span>
                {siteName.substring(2)}
              </span>
            </Link>

            <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {siteDescription}
            </p>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Koleksi kacamata gaya modern dengan perlindungan UV400 penuh dan
              lensa polarized. Tampil confident di setiap momen gaya hidup urban
              dan petualangan outdoor Anda.
            </p>

            <div className="flex gap-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 transition hover:text-emerald-500 dark:hover:text-emerald-400"
                aria-label="Instagram"
              >
                <svg
                  className="h-[18px] w-[18px] fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 transition hover:text-emerald-500 dark:hover:text-emerald-400"
                aria-label="Facebook"
              >
                <svg
                  className="h-[18px] w-[18px] fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 transition hover:text-emerald-500 dark:hover:text-emerald-400"
                aria-label="Website"
              >
                <Globe size={18} />
              </a>
            </div>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white">
              Navigasi Halaman
            </h3>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link
                  href="/"
                  className="transition hover:text-emerald-500 dark:hover:text-emerald-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="transition hover:text-emerald-500 dark:hover:text-emerald-400"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="transition hover:text-emerald-500 dark:hover:text-emerald-400"
                >
                  Produk
                </Link>
              </li>
              <li>
                <Link
                  href="/promo"
                  className="transition hover:text-emerald-500 dark:hover:text-emerald-400"
                >
                  Promo
                </Link>
              </li>
              <li>
                <Link
                  href="/store"
                  className="transition hover:text-emerald-500 dark:hover:text-emerald-400"
                >
                  Store
                </Link>
              </li>
              <li>
                <Link
                  href="/track"
                  className="transition hover:text-emerald-500 dark:hover:text-emerald-400"
                >
                  Lacak Pesanan
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kategori Produk */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white">
              Kategori Kacamata
            </h3>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link
                  href="/products?category=men"
                  className="transition hover:text-emerald-500 dark:hover:text-emerald-400"
                >
                  Pria
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=women"
                  className="transition hover:text-emerald-500 dark:hover:text-emerald-400"
                >
                  Wanita
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=unisex"
                  className="transition hover:text-emerald-500 dark:hover:text-emerald-400"
                >
                  Unisex
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=kids"
                  className="transition hover:text-emerald-500 dark:hover:text-emerald-400"
                >
                  Kids / Anak
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Kontak & WhatsApp Dinamis */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-white">
              Layanan Pelanggan
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li className="flex items-start gap-2">
                <MapPin
                  size={15}
                  className="mt-0.5 shrink-0 text-emerald-500 dark:text-emerald-400"
                />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone
                  size={15}
                  className="shrink-0 text-emerald-500 dark:text-emerald-400"
                />
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-emerald-500 dark:hover:text-emerald-400"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail
                  size={15}
                  className="shrink-0 text-emerald-500 dark:text-emerald-400"
                />
                <span>{email}</span>
              </li>
            </ul>

            {/* Tombol Direct Chat WhatsApp */}
            <div className="pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-black transition hover:bg-emerald-400 active:scale-95 shadow-md shadow-emerald-500/10"
              >
                <MessageCircle size={16} />
                <span>Chat WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Garis Pembatas & Copyright */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-zinc-200 dark:border-zinc-800/80 pt-6 text-[11px] text-zinc-500 dark:text-zinc-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteName} Eyewear. All rights
            reserved.
          </p>
          <p className="font-semibold text-zinc-600 dark:text-zinc-400">
            Pusat Kacamata Gaya & Proteksi Lensa UV400 Terpercaya
          </p>
        </div>
      </div>
    </footer>
  );
}
