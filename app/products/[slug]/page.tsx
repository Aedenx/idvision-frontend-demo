"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  RefreshCw,
  Star,
  Zap,
} from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/detail?slug=${resolvedParams.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.data) {
          const prod = data.data;
          setProduct(prod);

          const primaryImgObj =
            prod.images && prod.images.length > 0
              ? prod.images.find((img: any) => img.is_primary) || prod.images[0]
              : null;

          const primaryImg = primaryImgObj
            ? primaryImgObj.image_path
            : prod.image_path;

          setSelectedImage(
            primaryImg
              ? primaryImg.startsWith("http") || primaryImg.startsWith("/")
                ? primaryImg
                : `/uploads/products/${primaryImg}`
              : "/images/placeholder.jpg",
          );

          if (prod.variants && prod.variants.length > 0) {
            setSelectedVariant(prod.variants[0]);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="py-12 text-center text-xs text-zinc-500 dark:text-zinc-400">
        Memuat detail produk...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
          Produk Tidak Ditemukan
        </h2>
        <Link
          href="/products"
          className="mt-3 inline-block rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-black"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const originalPrice = Number(
    selectedVariant?.price || product.base_price || 0,
  );
  const discountPercent = Number(product.discount_percent || 0);
  const finalPrice = product.discount_price
    ? Number(product.discount_price)
    : discountPercent > 0
      ? originalPrice - (originalPrice * discountPercent) / 100
      : originalPrice;

  const currentStock = Number(
    selectedVariant?.stock_quantity ?? product.total_stock ?? 0,
  );

  const handleAddToCart = (redirectAfterAdd = false) => {
    const savedUser = localStorage.getItem("customer_user");

    if (!savedUser) {
      alert("Silakan login terlebih dahulu untuk melanjutkan pembelian.");
      router.push("/login");
      return;
    }

    if (currentStock <= 0) return;

    const cartItemId = selectedVariant?.variant_id
      ? `${product.product_id}-${selectedVariant.variant_id}`
      : String(product.product_id);

    addToCart({
      id: cartItemId,
      name: `${product.name} ${selectedVariant ? `(${selectedVariant.color_name || selectedVariant.sku_variant})` : ""}`,
      price: finalPrice,
      image: selectedImage,
      quantity: 1,
    });

    if (redirectAfterAdd) {
      router.push("/checkout");
    } else {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
      <Link
        href="/products"
        className="mb-4 inline-flex items-center gap-1 text-[11px] font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        <ArrowLeft size={14} /> Kembali
      </Link>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 items-start">
        <div className="space-y-2.5">
          <div className="relative aspect-square w-full max-w-[380px] mx-auto overflow-hidden rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900/60 flex items-center justify-center">
            <img
              src={selectedImage}
              alt={product.name}
              className="h-full w-full object-contain"
            />
            {discountPercent > 0 && (
              <span className="absolute right-2.5 top-2.5 rounded-md bg-red-500 px-1.5 py-0.5 text-[10px] font-black text-white">
                -{discountPercent}%
              </span>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex justify-center gap-2 overflow-x-auto scrollbar-hide">
              {product.images.map((img: any, idx: number) => {
                const imgUrl =
                  img.image_path.startsWith("http") ||
                  img.image_path.startsWith("/")
                    ? img.image_path
                    : `/uploads/products/${img.image_path}`;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`h-12 w-12 shrink-0 rounded-lg border p-0.5 bg-white dark:bg-zinc-900 cursor-pointer ${
                      selectedImage === imgUrl
                        ? "border-emerald-500 ring-1 ring-emerald-500/20"
                        : "border-zinc-200 dark:border-zinc-800 opacity-60"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                {product.category_name || "Unisex"}
              </span>
              <span className="text-[10px] text-zinc-400">
                SKU: {product.sku_base}
              </span>
            </div>

            <h1 className="mt-1.5 text-lg font-extrabold uppercase text-zinc-900 dark:text-white">
              {product.name}
            </h1>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                Rp {finalPrice.toLocaleString("id-ID")}
              </span>
              {discountPercent > 0 && originalPrice > 0 && (
                <span className="text-xs font-semibold text-zinc-400 line-through">
                  Rp {originalPrice.toLocaleString("id-ID")}
                </span>
              )}
            </div>

            <p className="mt-2 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-3">
              {product.description ||
                "Kacamata idvisionstore.web.id dirancang dengan presisi tinggi."}
            </p>
          </div>

          <div className="border-t border-zinc-100 pt-3 dark:border-zinc-800/80">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAddToCart(false)}
                disabled={currentStock <= 0}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold uppercase cursor-pointer border border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
              >
                {isAdded ? <Check size={15} /> : <ShoppingBag size={15} />}
                {isAdded ? "Ditambahkan" : "+ Keranjang"}
              </button>

              <button
                onClick={() => handleAddToCart(true)}
                disabled={currentStock <= 0}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold uppercase cursor-pointer bg-emerald-500 text-black hover:bg-emerald-400"
              >
                <Zap size={15} />
                Beli Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
