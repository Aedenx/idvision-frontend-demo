"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Search,
  Navigation,
  MessageCircle,
  Store,
  ShieldCheck,
  Clock,
} from "lucide-react";

const STORES = [
  {
    id: 1,
    city: "Pamulang Viktor",
    badge: "Pusat & Service Center",
    address: "Jl. Raya Puspitek, Pamulang Viktor, Tangerang Selatan, Banten",
    phone: "085877669323",
    whatsapp: "6285877669323",
    hours: "Senin - Minggu: 09.00 - 21.00 WIB",
    image: "http://localhost/idvisionstore.web.id/uploads/store1.jpg",
    description:
      "Markas utama IDVISION dengan koleksi frame kacamata terlengkap dan layanan pemeriksaan mata presisi.",
    mapUrl:
      "https://maps.google.com/maps?q=Pamulang+Viktor+Tangerang+Selatan&t=&z=14&ie=UTF8&iwloc=&output=embed",
    isPrimary: true,
  },
  {
    id: 2,
    city: "Magelang",
    badge: "Cabang Resmi",
    address:
      "Desa Sidomulyo, Kecamatan Secang, Kabupaten Magelang, Jawa Tengah",
    phone: "+62 815-7590-6862",
    whatsapp: "6281575906862",
    hours: "Senin - Sabtu: 09.00 - 20.00 WIB",
    image: "http://localhost/idvisionstore.web.id/uploads/store2.jpg",
    description:
      "Outlet resmi cabang Magelang di Desa Sidomulyo, siap melayani kebutuhan kacamata gaya & outdoor.",
    mapUrl:
      "https://maps.google.com/maps?q=Desa+Sidomulyo+Magelang&t=&z=14&ie=UTF8&iwloc=&output=embed",
    isPrimary: false,
  },
];

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [activeStore, setActiveStore] = useState(STORES[0]);

  const filteredStores = STORES.filter((store) => {
    const matchesCity = selectedCity === "all" || store.city === selectedCity;
    const matchesSearch =
      !searchQuery ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-black dark:text-white transition-colors duration-300">
      {/* Header Halaman */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-6 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
              <Store size={22} />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider text-zinc-900 dark:text-white md:text-2xl">
                Official Offline Store
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Kunjungi outlet fisik IDVISION untuk fitting kacamata dan
                konsultasi lensa
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-black uppercase text-emerald-600 dark:text-emerald-400">
            {filteredStores.length} Outlet
          </span>
        </div>
      </header>

      {/* Main Content 2 Kolom */}
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Kolom Kiri: Filters & List Store Cards */}
          <div className="flex flex-col gap-4 lg:col-span-6 xl:col-span-5">
            {/* Filter Search & Select */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari lokasi / alamat..."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 py-2.5 pl-9 pr-3 text-xs font-medium placeholder-zinc-400 focus:border-emerald-500 focus:outline-none transition"
                />
              </div>

              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full cursor-pointer rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 px-3 py-2.5 text-xs font-semibold focus:border-emerald-500 focus:outline-none transition"
              >
                <option value="all">Semua Lokasi</option>
                <option value="Pamulang Viktor">Pamulang Viktor (Pusat)</option>
                <option value="Magelang">Magelang (Sidomulyo)</option>
              </select>
            </div>

            {/* List Store Cards */}
            <div className="max-h-[580px] space-y-4 overflow-y-auto pr-1">
              {filteredStores.length > 0 ? (
                filteredStores.map((store) => (
                  <div
                    key={store.id}
                    onClick={() => setActiveStore(store)}
                    className={`cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${
                      activeStore.id === store.id
                        ? "border-emerald-500 bg-emerald-500/5 shadow-md dark:border-emerald-500 dark:bg-emerald-950/20"
                        : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative h-40 bg-zinc-200 dark:bg-zinc-800 sm:w-36 shrink-0">
                        <img
                          src={store.image}
                          alt={store.city}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            // Fallback jika file gambar belum diunggah
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=600";
                          }}
                        />
                        {store.isPrimary && (
                          <div className="absolute top-2 left-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-black uppercase text-black">
                            Pusat
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col justify-between p-4 flex-1">
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <h3 className="font-black text-sm uppercase text-zinc-900 dark:text-white flex items-center gap-1.5">
                              <MapPin
                                size={15}
                                className="text-emerald-500 shrink-0"
                              />{" "}
                              IDVISION {store.city}
                            </h3>
                            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 shrink-0">
                              {store.badge}
                            </span>
                          </div>

                          <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                            {store.address}
                          </p>

                          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-zinc-400">
                            <Clock size={12} className="text-emerald-500" />
                            <span>{store.hours}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between text-xs font-semibold">
                          <a
                            href={`tel:${store.phone.replace(/\s/g, "")}`}
                            className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition font-mono text-[11px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone size={13} className="text-emerald-500" />
                            <span>{store.phone}</span>
                          </a>

                          <a
                            href={`https://wa.me/${store.whatsapp}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-[11px] font-extrabold uppercase text-black hover:bg-emerald-400 transition"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MessageCircle size={13} />
                            <span>Chat WA</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-xs text-zinc-400">
                  Toko di lokasi ini tidak ditemukan.
                </div>
              )}
            </div>
          </div>

          {/* Kolom Kanan: Google Maps View Interactive */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col space-y-4">
            <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider flex items-center gap-1">
                  <ShieldCheck size={13} /> Peta Lokasi Terverifikasi
                </span>
                <h2 className="text-sm font-black uppercase text-zinc-900 dark:text-white">
                  IDVISION {activeStore.city} ({activeStore.badge})
                </h2>
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(activeStore.address)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black px-4 py-2 text-xs font-black uppercase tracking-wider transition hover:opacity-90 active:scale-95 shrink-0"
              >
                <Navigation size={14} />
                <span>Buka Google Maps</span>
              </a>
            </div>

            <div className="h-[400px] md:h-[480px] w-full overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-xl">
              <iframe
                title={`Map IDVISION ${activeStore.city}`}
                src={activeStore.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                className="h-full w-full rounded-3xl"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
