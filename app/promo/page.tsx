"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Tag,
  Sparkles,
  Percent,
  Clock,
  ArrowRight,
  Flame,
  ShieldCheck,
  Zap,
} from "lucide-react";
import ProductCard from "@/components/product/product-card";

export default function PromoPage() {
  const [discountedProducts, setDiscountedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products/index")
      .then((res) => res.json())
      .then((resData) => {
        const productList = resData?.data || resData?.products || [];
        if (Array.isArray(productList)) {
          const promo = productList.filter(
            (p: any) => Number(p.discount_percent || 0) > 0,
          );
          setDiscountedProducts(
            promo.length > 0 ? promo : productList.slice(0, 8),
          );
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-black dark:text-white transition-colors duration-300 py-10 px-4 md:px-8">
      <main className="mx-auto max-w-7xl w-full space-y-12">
        {/* 1. HERO HEADER */}
        <section className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:border-zinc-800 dark:from-zinc-950 dark:via-zinc-900 dark:to-black p-8 md:p-12 shadow-sm">
          <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <Sparkles size={13} />
                <span>IDVISION Special Offers</span>
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-900 dark:text-white md:text-4xl leading-tight">
                Katalog Diskon & Penawaran Eksklusif
              </h1>
              <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Nikmati penawaran harga terbaik untuk koleksi kacamata premium
                pilihan. Potongan harga langsung diterapkan untuk pengalaman
                belanja yang praktis.
              </p>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-black px-5 py-3 text-xs font-black uppercase tracking-wider shadow-lg">
                <Flame size={16} className="text-emerald-500" />
                Penawaran Terbatas
              </span>
            </div>
          </div>
        </section>

        {/* 2. HIGHLIGHT VALUE PROPOSITION */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 shrink-0">
              <Zap size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                Potongan Harga Otomatis
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Seluruh harga di katalog sudah disesuaikan dengan kalkulasi
                diskon terbaik secara instan.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 shrink-0">
              <Clock size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                Stok & Durasi Terbatas
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Penawaran spesial berlaku selama persediaan alokasi produk promo
                masih tersedia.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                Garansi Originalitas
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Setiap pembelian disertai hardcase eksklusif dan lap pembersih
                microfiber IDVISION.
              </p>
            </div>
          </div>
        </section>

        {/* 3. KATALOG PRODUK PROMO */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
            <div>
              <h2 className="text-base font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <Tag size={18} className="text-emerald-500" />
                Koleksi Kacamata Diskon
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Pilihan kacamata gaya dan outdoor berkualitas tinggi dengan
                penawaran harga spesial.
              </p>
            </div>

            <Link
              href="/products"
              className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="py-20 text-center text-xs text-zinc-400 flex flex-col items-center justify-center space-y-3">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              <span className="font-bold uppercase tracking-wider text-[10px]">
                Memuat Katalog Promo...
              </span>
            </div>
          ) : discountedProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {discountedProducts.map((prod) => (
                <ProductCard key={prod.product_id || prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-xs text-zinc-400 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
              Belum ada produk promo yang tersedia saat ini.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
