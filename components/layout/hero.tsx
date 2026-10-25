"use client";

import Link from "next/link";
import { ArrowRight, Mountain, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[85vh] lg:min-h-screen items-end overflow-hidden bg-zinc-950 px-6 pb-16 pt-28 text-white lg:px-14 transition-colors duration-300"
    >
      {/* BACKGROUND IMAGE DENGAN GRADIENT BLENDING SEAMLESS */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/Gendon.jpg"
          alt="IDVISION Outdoor Eyewear"
          className="h-full w-full object-cover object-center scale-105 transition-transform duration-1000"
        />

        {/* 1. Overlay Gelap Utama untuk Keterbacaan Teks */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[0.5px]" />

        {/* 2. Gradient Top-to-Bottom: Membuat batas bawah gambar menyatu seamless ke background halaman */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-zinc-950 dark:to-black" />

        {/* 3. Gradient Side-to-Side: Soft fading di sisi kiri dan kanan */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />

        {/* 4. Glow Accent Emerald di Sudut */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(16,185,129,0.18),transparent_60%)]" />
      </div>

      {/* KONTEN UTAMA HERO */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-end gap-14">
        <div className="max-w-3xl">
          {/* Badge Tagline */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[2px] text-emerald-400 backdrop-blur-xl shadow-lg">
            <Mountain className="h-3.5 w-3.5 text-emerald-400" />
            Outdoor Eyewear &bull; Est. 2026
          </div>

          {/* Headline Utama */}
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-lg">
            Built for{" "}
            <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-sky-400 bg-clip-text text-transparent">
              Higher Ground
            </span>
            <br />
            &amp; Bold Exploration
          </h1>

          {/* Subdeskripsi */}
          <p className="mt-6 max-w-xl text-xs font-medium leading-relaxed text-zinc-300 sm:text-sm md:text-base drop-shadow">
            Kacamata outdoor idvisionstore.web.id dirancang khusus untuk
            petualangan ekstrem — frame titanium ultra-ringan, lensa polarized
            UV400, dan karakter tangguh yang siap menaklukkan setiap puncak.
          </p>

          {/* Tombol Aksi (CTA) */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="group inline-flex items-center gap-3 rounded-full bg-emerald-500 px-7 py-3.5 text-xs font-black uppercase tracking-widest text-black transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95"
            >
              Explore Collections
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-xl transition-all hover:bg-white/10 active:scale-95"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              UV400 Guarantee
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
