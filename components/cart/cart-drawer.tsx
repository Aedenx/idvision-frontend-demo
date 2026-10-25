"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { getImageUrl } from "@/lib/api";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    items: cartItems = [],
    updateQuantity,
    removeFromCart,
    totalPrice,
    totalItems,
  } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const content = (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* OVERLAY */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity cursor-pointer"
      />

      {/* DRAWER CONTAINER */}
      <div className="relative z-10 flex h-screen w-full max-w-md flex-col border-l border-zinc-200 bg-white text-zinc-900 shadow-2xl transition-transform dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-zinc-200 p-4 shrink-0 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <div className="flex items-center gap-2">
            <ShoppingBag
              size={18}
              className="text-emerald-600 dark:text-emerald-400"
            />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-zinc-900 dark:text-white">
              Keranjang Belanja
            </h2>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              {totalItems}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-white transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* DAFTAR ITEM KERANJANG */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50/50 dark:bg-zinc-950 scrollbar-hide">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <ShoppingBag
                size={48}
                className="text-zinc-300 dark:text-zinc-700 mb-3"
              />
              <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                Keranjang belanjaanmu kosong
              </p>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
                Jelajahi produk kacamata IDVISION dan tambahkan ke sini.
              </p>
              <button
                onClick={onClose}
                className="mt-4 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400 transition cursor-pointer"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemImage = getImageUrl(item.image, "products");

              return (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
                >
                  {/* GAMBAR PRODUK */}
                  <div className="relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-950 flex items-center justify-center">
                    <img
                      src={itemImage}
                      alt={item.name}
                      className="h-full w-full object-contain object-center"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/placeholder.jpg";
                      }}
                    />
                  </div>

                  {/* INFO & HARGA PRODUK */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h3 className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1">
                          {item.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-400 hover:text-red-500 transition cursor-pointer p-0.5"
                          title="Hapus item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                        Rp {Number(item.price).toLocaleString("id-ID")}
                      </span>
                    </div>

                    {/* KONTROL JUMLAH (PLUS / MINUS) */}
                    <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800/60 mt-1">
                      <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-0.5 dark:border-zinc-800 dark:bg-zinc-950">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer p-0.5"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold w-4 text-center text-zinc-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white cursor-pointer p-0.5"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
                        Rp{" "}
                        {(item.price * item.quantity).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER TOTAL & CHECKOUT */}
        {cartItems.length > 0 && (
          <div className="border-t border-zinc-200 bg-white p-4 space-y-3 shrink-0 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-zinc-500 dark:text-zinc-400">
                Total Pembayaran:
              </span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                Rp {totalPrice.toLocaleString("id-ID")}
              </span>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:bg-emerald-400 shadow-md shadow-emerald-500/20"
            >
              Lanjut ke Checkout <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
