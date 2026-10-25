"use client";

import Link from "next/link";
import { Star } from "lucide-react";

interface ProductProps {
  id: number;
  product_id?: number;
  name: string;
  slug: string;
  price?: number;
  base_price?: number;
  discount_percent?: number;
  discount_price?: number;
  stock?: number;
  total_stock?: number;
  image?: string;
  image_url?: string;
  gender?: string;
  category_name?: string;
  average_rating?: number;
  total_reviews?: number;
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const imageUrl =
    product.image_url ||
    (product.image && product.image.startsWith("http")
      ? product.image
      : product.image
        ? `http://localhost/idvisionstore.web.id/backend/uploads/products/${product.image}`
        : "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600");

  const originalPrice = Number(product.price || product.base_price || 0);
  const discountPercent = Number(product.discount_percent || 0);
  const stock = Number(product.stock ?? product.total_stock ?? 0);

  const finalPrice = product.discount_price
    ? Number(product.discount_price)
    : discountPercent > 0
      ? originalPrice - (originalPrice * discountPercent) / 100
      : originalPrice;

  const categoryLabel = product.gender || product.category_name;
  const rating = Number(product.average_rating || 0);
  const totalReviews = Number(product.total_reviews || 0);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition-all duration-300 hover:border-emerald-500/60 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:hover:bg-zinc-900"
    >
      {/* Container Gambar */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-50 p-2 dark:bg-zinc-950 flex items-center justify-center">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600";
          }}
        />

        {/* Badge Kategori */}
        {categoryLabel && (
          <span className="absolute left-2 top-2 rounded-md border border-zinc-200 bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 shadow-xs backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-emerald-400">
            {categoryLabel}
          </span>
        )}

        {/* Badge Diskon Merah */}
        {discountPercent > 0 && (
          <span className="absolute right-2 top-2 rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-black text-white shadow-md">
            -{discountPercent}%
          </span>
        )}

        {/* Overlay Jika Stok Habis */}
        {stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
            <span className="rounded-md bg-red-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
              Stok Habis
            </span>
          </div>
        )}
      </div>

      {/* Informasi Produk & Stok */}
      <div className="mt-3 flex flex-1 flex-col justify-between space-y-2">
        <div>
          <h3 className="text-xs font-bold text-zinc-900 transition group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400 line-clamp-1">
            {product.name}
          </h3>

          {/* RATING BINTANG & JUMLAH ULASAN */}
          <div className="mt-1 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star
                size={12}
                className={
                  rating > 0
                    ? "fill-amber-400 text-amber-400"
                    : "text-zinc-300 dark:text-zinc-700"
                }
              />
              <span className="text-[11px] font-extrabold text-zinc-800 dark:text-zinc-200">
                {rating > 0 ? rating.toFixed(1) : "Baru"}
              </span>
              {totalReviews > 0 && (
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                  ({totalReviews})
                </span>
              )}
            </div>

            {/* INFO STOK */}
            {stock > 0 && stock <= 5 ? (
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                Sisa {stock}
              </span>
            ) : stock > 5 ? (
              <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                Stok: {stock}
              </span>
            ) : null}
          </div>
        </div>

        {/* Harga & Detail */}
        <div className="flex items-end justify-between border-t border-zinc-100 pt-1.5 dark:border-zinc-800/60">
          <div className="flex flex-col">
            {discountPercent > 0 && originalPrice > 0 && (
              <span className="text-[10px] font-medium text-zinc-400 line-through dark:text-zinc-500">
                Rp {originalPrice.toLocaleString("id-ID")}
              </span>
            )}
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
              {finalPrice > 0
                ? `Rp ${finalPrice.toLocaleString("id-ID")}`
                : "Hubungi Admin"}
            </span>
          </div>

          <span className="text-[10px] font-semibold text-zinc-400 transition group-hover:text-zinc-900 dark:group-hover:text-white pb-0.5">
            Detail &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
