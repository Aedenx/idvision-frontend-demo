"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/product/product-card";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedCategory =
    searchParams.get("category") || searchParams.get("gender") || "";
  const selectedSort = searchParams.get("sort") || "latest";
  const search = searchParams.get("search") || "";

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Ambil Kategori dari Internal Route Handler Next.js
  useEffect(() => {
    fetch("/api/categories/index")
      .then((res) => res.json())
      .then((resData) => {
        const catArray = Array.isArray(resData) ? resData : resData?.data || [];
        setCategories(catArray);
      })
      .catch((err) => console.error("Gagal mengambil kategori:", err));
  }, []);

  // 2. Ambil Daftar Produk dengan Query Filter dari Internal Route Handler Next.js
  useEffect(() => {
    setLoading(true);

    const queryParams = new URLSearchParams();
    if (selectedCategory) queryParams.append("category", selectedCategory);
    if (selectedSort) queryParams.append("sort", selectedSort);
    if (search) queryParams.append("search", search);

    const url = `/api/products/index?${queryParams.toString()}`;

    fetch(url)
      .then((res) => res.json())
      .then((resData) => {
        const prodArray = Array.isArray(resData)
          ? resData
          : resData?.data || [];

        // Mapping atribut agar konsisten dengan komponen ProductCard
        const mapped = prodArray.map((p: any) => ({
          id: p.product_id || p.id,
          product_id: p.product_id || p.id,
          name: p.name || "Kacamata IDVISION",
          slug: p.slug || "",
          sku: p.sku_base || "",
          description: p.description || "",
          price: Number(p.base_price || p.price || 0),
          base_price: Number(p.base_price || p.price || 0),
          discount_price: p.discount_price ? Number(p.discount_price) : null,
          discount_percent: Number(p.discount_percent || 0),
          gender: p.category_name || "Unisex",
          category_name: p.category_name || "Unisex",
          category_slug: p.category_slug || "",
          image:
            p.image_url ||
            p.image ||
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600",
          image_url:
            p.image_url ||
            p.image ||
            "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600",
          stock: Number(p.total_stock || 0),
          is_featured: Boolean(p.is_featured),
        }));

        setProducts(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil produk:", err);
        setProducts([]);
        setLoading(false);
      });
  }, [selectedCategory, selectedSort, search]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
      if (key === "category") params.delete("gender");
    } else {
      params.delete(key);
      if (key === "category") params.delete("gender");
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      {/* Header Judul & Bar Filter */}
      <div className="mb-6 flex flex-col gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800/80 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-base font-extrabold uppercase tracking-wider text-zinc-900 dark:text-white md:text-lg">
            {selectedCategory ? `Produk ${selectedCategory}` : "Semua Produk"}
            <span className="ml-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              ({loading ? "..." : products.length})
            </span>
          </h1>
          <p className="mt-0.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            Jelajahi seluruh koleksi kacamata gaya & outdoor terlengkap.
          </p>
        </div>

        {/* KELOMPOK FILTER TERPADU */}
        <div className="flex self-start items-center rounded-xl border border-zinc-200 bg-white p-1 shadow-xs backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/90 md:self-auto">
          {/* Filter Kategori */}
          <select
            value={selectedCategory}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="cursor-pointer bg-transparent px-2.5 py-1 text-[11px] font-bold uppercase text-zinc-800 focus:text-emerald-600 focus:outline-none dark:text-zinc-200 dark:focus:text-emerald-400"
          >
            <option
              value=""
              className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white"
            >
              Semua Kategori
            </option>
            {categories.map((cat) => (
              <option
                key={cat.category_id || cat.id}
                value={cat.slug || cat.name.toLowerCase()}
                className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white"
              >
                {cat.name}
              </option>
            ))}
          </select>

          <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800"></div>

          {/* Filter Pengurutan */}
          <select
            value={selectedSort}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            className="cursor-pointer bg-transparent px-2.5 py-1 text-[11px] font-bold uppercase text-zinc-800 focus:text-emerald-600 focus:outline-none dark:text-zinc-200 dark:focus:text-emerald-400"
          >
            <option
              value="latest"
              className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white"
            >
              Terbaru
            </option>
            <option
              value="price_asc"
              className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white"
            >
              Harga: Terendah → Tertinggi
            </option>
            <option
              value="price_desc"
              className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white"
            >
              Harga: Tertinggi → Terendah
            </option>
            <option
              value="discount_desc"
              className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white"
            >
              Diskon Terbesar
            </option>
          </select>
        </div>
      </div>

      {/* Grid Produk */}
      {loading ? (
        <div className="py-20 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Memuat produk...
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id || product.product_id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
          Tidak ada produk yang ditemukan untuk pilihan ini.
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Memuat...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
