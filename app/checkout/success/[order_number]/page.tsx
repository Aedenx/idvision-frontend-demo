"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Copy,
  Check,
  Truck,
  ShoppingBag,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  Star,
  Send,
  AlertTriangle,
  Printer,
  X,
  XCircle,
} from "lucide-react";

import OrderStatusTimeline from "@/components/order-status-timeline";

// FORM ULASAN PRODUK
function ReviewItemForm({
  orderId,
  productId,
  productName,
  customerName,
}: {
  orderId: number;
  productId: number;
  productName: string;
  customerName: string;
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setReviewError(null);

    try {
      const res = await fetch("/api/reviews/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          product_id: productId,
          customer_name: customerName,
          rating,
          comment,
        }),
      });

      const result = await res.json();
      if (result.success || result.status === "success") {
        setSubmitted(true);
      } else {
        setReviewError(result.message || "Gagal mengirimkan ulasan");
      }
    } catch (err) {
      setReviewError("Gagal terhubung ke server ulasan");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2">
        <CheckCircle2 size={16} /> Terima kasih! Ulasan Anda untuk "
        {productName}" berhasil dikirim.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmitReview}
      className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 space-y-3"
    >
      <div className="flex justify-between items-center">
        <p className="text-xs font-bold text-zinc-900 dark:text-white">
          {productName}
        </p>

        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-amber-400 transition transform hover:scale-110 focus:outline-none cursor-pointer"
            >
              <Star
                size={18}
                fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
              />
            </button>
          ))}
        </div>
      </div>

      <textarea
        required
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Bagaimana kualitas frame dan lensa kacamata ini? Tulis ulasan Anda..."
        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 text-xs text-zinc-900 dark:text-white focus:border-emerald-500 focus:outline-none placeholder:text-zinc-400 resize-none"
        rows={2}
      />

      {reviewError && (
        <p className="text-[11px] font-bold text-rose-500">{reviewError}</p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-[11px] font-extrabold uppercase tracking-wider text-black hover:bg-emerald-400 transition cursor-pointer disabled:opacity-50"
        >
          {submitting ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <Send size={14} />
          )}
          Kirim Ulasan
        </button>
      </div>
    </form>
  );
}

// KOMPONEN FAKTUR DENGAN STANDAR INDUSTRI E-COMMERCE
function InvoiceModal({
  order,
  orderNumber,
  onClose,
}: {
  order: any;
  orderNumber: string;
  onClose: () => void;
}) {
  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "LUNAS / PAID";
      case "refund_pending":
        return "REFUND PENDING";
      case "refunded":
        return "REFUNDED / DIKEMBALIKAN";
      case "cancelled":
        return "BATAL / CANCELLED";
      default:
        return status ? status.toUpperCase() : "PENDING";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs print:static print:bg-white print:p-0">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice,
          #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 text-black shadow-2xl dark:bg-zinc-900 dark:text-white print:max-h-none print:overflow-visible">
        {/* ACTION HEADER */}
        <div className="flex items-center justify-between border-b pb-4 dark:border-zinc-800 print:hidden">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            Pratinjau Faktur Pembayaran
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-extrabold text-black hover:bg-emerald-400 cursor-pointer transition"
            >
              <Printer size={14} /> Cetak / Download PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* KONTEN FAKTUR RESMI */}
        <div id="printable-invoice" className="space-y-6 pt-4">
          <div className="flex justify-between items-start border-b-2 border-black pb-6 dark:border-white">
            <div>
              <h1 className="text-3xl font-black tracking-widest text-black dark:text-white">
                IDVISION
              </h1>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Premium Eyewear Store
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                Jl. Raya Puspiptek, Buaran, Serpong, Tangerang Selatan
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-black uppercase text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                INVOICE
              </span>
              <p className="mt-2 text-xs font-mono font-bold text-zinc-900 dark:text-white">
                #{orderNumber}
              </p>
              <p className="text-[11px] text-zinc-500">
                Tanggal: {new Date().toLocaleDateString("id-ID")}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div>
              <p className="text-[11px] font-bold text-zinc-400 uppercase">
                Status Transaksi
              </p>
              <p className="text-sm font-black uppercase text-emerald-600 dark:text-emerald-400">
                {getPaymentStatusText(order.payment_status)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-400 uppercase">
                Metode Pembayaran
              </p>
              <p className="text-xs font-bold uppercase text-zinc-900 dark:text-white">
                {order.payment_method}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-black text-zinc-400 uppercase text-[10px] tracking-wider">
                Diterbitkan Untuk:
              </p>
              <p className="font-bold text-zinc-900 dark:text-white mt-1">
                {order.customer_name}
              </p>
              <p className="text-zinc-600 dark:text-zinc-400">
                {order.customer_email}
              </p>
              <p className="text-zinc-600 dark:text-zinc-400">
                {order.customer_phone}
              </p>
            </div>
            <div>
              <p className="font-black text-zinc-400 uppercase text-[10px] tracking-wider">
                Alamat Pengiriman:
              </p>
              <p className="text-zinc-700 dark:text-zinc-300 mt-1 leading-relaxed">
                {order.shipping_address}
              </p>
            </div>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 uppercase font-black text-[10px]">
                <th className="py-2">Deskripsi Produk</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Harga Satuan</th>
                <th className="py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {order.items?.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="py-3 font-bold text-zinc-900 dark:text-white">
                    {item.product_name}
                  </td>
                  <td className="py-3 text-center text-zinc-600 dark:text-zinc-400">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-right text-zinc-600 dark:text-zinc-400">
                    Rp {Number(item.price).toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 text-right font-bold text-zinc-900 dark:text-white">
                    Rp {Number(item.subtotal).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t-2 border-zinc-200 dark:border-zinc-800 pt-4 space-y-1.5 text-xs">
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Subtotal Produk</span>
              <span>
                Rp {Number(order.total_amount).toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Biaya Pengiriman</span>
              <span>Rp 0</span>
            </div>
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>Diskon</span>
              <span>-Rp 0</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-zinc-200 dark:border-zinc-800 font-black text-sm">
              <span className="uppercase text-zinc-900 dark:text-white">
                Total Bayar
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 text-base">
                Rp {Number(order.total_amount).toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="pt-6 text-center border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400">
            <p>Terima kasih telah berbelanja kacamata di IDVISION.</p>
            <p>Faktur ini sah dan diterbitkan secara elektronik oleh sistem.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ order_number: string }>;
}) {
  const resolvedParams = use(params);
  const orderNumber = resolvedParams.order_number;

  const [copied, setCopied] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const fetchOrderStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/orders/track?order_number=${encodeURIComponent(orderNumber)}`,
      );

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const result = await res.json();

      if (result.success || result.status === "success") {
        setOrder(result.data);
        setError(null);
      } else {
        setError(result.message || "Pesanan tidak ditemukan");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Gagal terhubung ke server (Failed to fetch)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber) {
      fetchOrderStatus();
    }
  }, [orderNumber]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // HANDLER UNTUK MEMBATALKAN PESANAN MANDIRI
  const handleCancelOrder = async () => {
    if (!confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) return;

    setCanceling(true);
    try {
      const res = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_number: orderNumber }),
      });

      const result = await res.json();
      if (result.success || result.status === "success") {
        alert("Pesanan berhasil dibatalkan!");
        fetchOrderStatus();
      } else {
        alert(result.message || "Gagal membatalkan pesanan");
      }
    } catch (err) {
      alert("Gagal terhubung ke server");
    } finally {
      setCanceling(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      {/* HEADER NAVIGASI */}
      <div className="mb-8 flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          <ArrowLeft size={16} />
          Kembali ke Katalog
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrderStatus}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-emerald-500 cursor-pointer transition"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />{" "}
            Refresh Status
          </button>
        </div>
      </div>

      {/* BANNER STATUS PESANAN */}
      <div className="mb-10 text-center">
        <CheckCircle2 size={56} className="mx-auto text-emerald-500 mb-3" />
        <h1 className="text-2xl font-black uppercase tracking-tight text-zinc-900 dark:text-white md:text-3xl">
          Lacak Pesanan
        </h1>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Status dan rincian transaksi pesanan kacamata Anda.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
            Invoice:
          </span>
          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {orderNumber}
          </span>
          <button
            onClick={() => handleCopy(orderNumber)}
            className="ml-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition"
            title="Salin Invoice"
          >
            {copied ? (
              <Check size={14} className="text-emerald-500" />
            ) : (
              <Copy size={14} />
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <RefreshCw className="animate-spin text-emerald-500" size={28} />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-xs text-rose-500 flex items-center justify-center gap-2">
          <AlertCircle size={18} /> {error}
        </div>
      ) : (
        order && (
          <div className="space-y-10">
            {/* TIMELINE STATUS */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-6">
                Status Pengiriman
              </h3>
              <OrderStatusTimeline
                currentStatus={order.order_status || order.status}
              />
            </div>

            {/* BANNER BATALKAN PESANAN (TAMPIL JIKA STATUS PENDING ATAU PROCESSING/DIKEMAS) */}
            {(order.order_status === "pending" ||
              order.order_status === "processing") && (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <XCircle size={22} className="text-rose-500 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      Ingin membatalkan pesanan ini?
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Pembatalan hanya dapat dilakukan selama pesanan belum
                      dikirim.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCancelOrder}
                  disabled={canceling}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-extrabold uppercase tracking-wider transition disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {canceling ? "Membatalkan..." : "Batalkan Pesanan"}
                </button>
              </div>
            )}

            {/* BANNER STATUS REFUND PENDING / REFUNDED */}
            {order.payment_status === "refund_pending" && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-xs text-amber-700 dark:text-amber-400 space-y-1">
                <p className="font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  ⏳ Pengembalian Dana Dalam Proses (Refund Pending)
                </p>
                <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">
                  Pesanan Anda telah dibatalkan. Pengembalian dana sedang
                  diproses oleh tim Admin/Customer Service IDVISION secara
                  manual. Harap tunggu konfirmasi lebih lanjut.
                </p>
              </div>
            )}

            {order.payment_status === "refunded" && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-xs text-emerald-700 dark:text-emerald-400 space-y-1">
                <p className="font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  ✅ Dana Telah Dikembalikan (Refunded)
                </p>
                <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">
                  Pengembalian dana untuk pesanan ini telah selesai diproses
                  oleh Admin IDVISION. Silakan periksa rekening atau akun
                  pembayaran Anda.
                </p>
              </div>
            )}

            {/* NOMOR RESI */}
            {order.tracking_number && (
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400">
                <div className="flex items-center gap-2">
                  <Truck size={18} />
                  <span>
                    Nomor Resi Pengiriman:{" "}
                    <strong className="font-mono">
                      {order.tracking_number}
                    </strong>
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(order.tracking_number)}
                  className="font-bold underline cursor-pointer"
                >
                  Salin Resi
                </button>
              </div>
            )}

            {order.shipping_notes && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3 text-xs text-amber-600 dark:text-amber-400">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold uppercase">
                    Catatan / Kendala Pengiriman:
                  </p>
                  <p className="mt-0.5">{order.shipping_notes}</p>
                </div>
              </div>
            )}

            {/* FITUR ULASAN PRODUK */}
            {order.order_status === "completed" && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-black uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <Star size={18} className="fill-emerald-500" /> Berikan
                    Ulasan Produk
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Pesanan Anda telah diterima! Berikan ulasan untuk kacamata
                    yang Anda beli.
                  </p>
                </div>

                <div className="space-y-4">
                  {order.items?.map((item: any, idx: number) => (
                    <ReviewItemForm
                      key={item.order_item_id || item.id || `review-${idx}`}
                      orderId={order.order_id}
                      productId={item.product_id || item.id}
                      productName={item.product_name}
                      customerName={order.customer_name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* DETIL PESANAN 2 KOLOM */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Kolom Kiri */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
                    Informasi Pengiriman
                  </h3>
                  <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">
                      {order.customer_name}
                    </p>
                    <p>{order.customer_phone}</p>
                    <p>{order.customer_email}</p>
                    <p className="pt-2 text-zinc-500 leading-relaxed">
                      {order.shipping_address}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                  <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
                    Metode Pembayaran
                  </h3>
                  <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-300">
                    <p className="font-bold uppercase text-zinc-900 dark:text-white">
                      {order.payment_method}
                    </p>
                    <p className="capitalize">
                      Status Bayar:{" "}
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">
                        {order.payment_status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-zinc-800 pt-6 lg:pt-0 lg:pl-8">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-4">
                  Rincian Barang & Pembayaran
                </h3>

                <div className="divide-y divide-zinc-200 dark:divide-zinc-800/80">
                  {order.items?.map((item: any, idx: number) => (
                    <div
                      key={item.order_item_id || item.id || `item-${idx}`}
                      className="py-3 flex justify-between items-center text-xs"
                    >
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-white">
                          {item.product_name}
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          {item.quantity} x Rp{" "}
                          {Number(item.price).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <p className="font-extrabold text-zinc-900 dark:text-white">
                        Rp {Number(item.subtotal).toLocaleString("id-ID")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Subtotal Barang</span>
                    <span>
                      Rp {Number(order.total_amount).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Biaya Pengiriman</span>
                    <span>Rp 0</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Diskon</span>
                    <span>-Rp 0</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-zinc-200 dark:border-zinc-800 font-black">
                    <span className="uppercase text-zinc-900 dark:text-white">
                      Total Pembayaran:
                    </span>
                    <span className="text-base text-emerald-600 dark:text-emerald-400">
                      Rp {Number(order.total_amount).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* TOMBOL MEMBUKA FAKTUR */}
                <button
                  onClick={() => setShowInvoiceModal(true)}
                  className="w-full mt-6 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer size={16} /> Lihat / Cetak Faktur Resmi
                </button>
              </div>
            </div>
          </div>
        )
      )}

      {/* MODAL FAKTUR */}
      {showInvoiceModal && order && (
        <InvoiceModal
          order={order}
          orderNumber={orderNumber}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}

      {/* FOOTER ACTION */}
      <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-3 text-xs font-extrabold uppercase tracking-widest text-black hover:bg-emerald-400 transition shadow-md shadow-emerald-500/10"
        >
          <ShoppingBag size={16} /> Belanja Lagi
        </Link>
      </div>
    </div>
  );
}
