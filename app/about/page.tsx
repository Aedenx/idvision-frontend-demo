"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Code2,
  Layout,
  Mountain,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Truck,
  Target,
  GraduationCap,
  ArrowDown,
  Database,
  Smartphone,
  Cpu,
  Layers,
  Check,
} from "lucide-react";

// Hook Animasi Intersection Observer
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function StoryBlock({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-12 scale-95"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function AboutPage() {
  const [stats, setStats] = useState({
    productsCount: 0,
  });

  useEffect(() => {
    fetch("/api/products/index")
      .then((res) => res.json())
      .then((resData) => {
        const productList = resData?.data || resData?.products || [];
        if (Array.isArray(productList)) {
          setStats({
            productsCount: productList.length || 12,
          });
        }
      })
      .catch(() => {
        setStats({ productsCount: 12 });
      });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white transition-colors duration-300 overflow-x-hidden selection:bg-emerald-500 selection:text-black">
      {/* ================= SECTION 1: HERO STORE & METRICS ================= */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 md:px-8 py-16 border-b border-zinc-200/80 dark:border-zinc-800/80">
        {/* Glow Ambient Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Kolom Teks Kiri */}
          <StoryBlock
            className="lg:col-span-6 space-y-6 text-center lg:text-left"
            delay={100}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-md">
              <Mountain className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                IDVISION Eyewear &bull; Est. 2026
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-[0.92]">
              VISION <br />
              WITHOUT <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                LIMITS
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Pusat e-commerce kacamata gaya dan outdoor kelas premium dengan
              proteksi{" "}
              <strong className="text-zinc-900 dark:text-white">
                UV400 penuh
              </strong>{" "}
              dan{" "}
              <strong className="text-zinc-900 dark:text-white">
                lensa polarized anti-glare
              </strong>
              . Didesain untuk kenyamanan harian hingga medan ekstrem.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                href="/products"
                className="inline-flex items-center gap-2.5 rounded-full bg-emerald-500 px-8 py-4 text-xs font-black uppercase tracking-wider text-black shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:scale-105 active:scale-95"
              >
                <span>Jelajahi Produk</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </StoryBlock>

          {/* Kolom Banner & Stats Kanan */}
          <StoryBlock className="lg:col-span-6 relative" delay={300}>
            <div className="relative mx-auto max-w-lg lg:max-w-none rounded-3xl border border-zinc-200/80 bg-white/60 dark:border-zinc-800 dark:bg-zinc-900/60 p-4 shadow-2xl backdrop-blur-xl">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-800 group">
                <img
                  src="/images/summit-model.jpg"
                  alt="IDVISION Featured Eyewear"
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800";
                  }}
                />

                <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center gap-2 shadow-md">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <Truck size={13} className="text-emerald-500" /> Siap Kirim
                    Hari Ini &bull; COD
                  </span>
                </div>
              </div>

              {/* Grid Metrik Utama */}
              <div className="grid grid-cols-3 gap-3 mt-4 text-center border-t border-zinc-200/80 dark:border-zinc-800/80 pt-4">
                <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/50">
                  <p className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                    {stats.productsCount > 0
                      ? `${stats.productsCount}+`
                      : "12+"}
                  </p>
                  <p className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase mt-0.5">
                    Koleksi Ready
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/50">
                  <p className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                    100%
                  </p>
                  <p className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase mt-0.5">
                    UV Protection
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/50">
                  <p className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                    4
                  </p>
                  <p className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase mt-0.5">
                    Kategori Utama
                  </p>
                </div>
              </div>
            </div>
          </StoryBlock>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-zinc-400 animate-bounce hidden md:flex">
          <span className="text-[10px] font-extrabold uppercase tracking-widest">
            Scroll Cerita
          </span>
          <ArrowDown size={14} />
        </div>
      </section>

      {/* ================= SECTION 2: BENTO GRID VISI & MISI ================= */}
      <section className="py-20 px-4 md:px-8 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-6xl w-full mx-auto space-y-12">
          <StoryBlock className="text-center space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-black uppercase text-emerald-600 dark:text-emerald-400">
              <Sparkles size={15} /> Fondasi IDVISION
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
              Visi & Misi Utama
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Komitmen kami dalam menghadirkan kacamata perlindungan optimal
              dengan aksesibilitas transaksi e-commerce modern.
            </p>
          </StoryBlock>

          {/* Bento Grid Visi & Misi */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Bento Visi (Kolom 5) */}
            <StoryBlock className="md:col-span-5" delay={150}>
              <div className="h-full rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <Target size={24} />
                  </div>
                  <h3 className="text-xl font-black uppercase text-zinc-900 dark:text-white tracking-wide">
                    Visi Utama
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    Menjadi pilihan nomor satu brand kacamata lokal yang
                    memadukan keamanan fungsional lensa proteksi matahari tinggi
                    dengan estetika fashion pria, wanita, dan anak-anak.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-400 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                  <ShieldCheck size={16} /> 100% Quality & Style Driven
                </div>
              </div>
            </StoryBlock>

            {/* Bento Misi (Kolom 7) */}
            <StoryBlock className="md:col-span-7" delay={300}>
              <div className="h-full rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <Award size={24} />
                  </div>
                  <h3 className="text-xl font-black uppercase text-zinc-900 dark:text-white tracking-wide">
                    Misi Strategis
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/60">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                        <Check size={12} />
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        Menyediakan lensa polarized UV400 berkualitas dengan
                        material frame titanium & acetate ultra-ringan.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/60">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                        <Check size={12} />
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        Sistem pesanan otomatis dengan konfirmasi WhatsApp dan
                        opsi pembayaran COD ke seluruh wilayah Indonesia.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/60">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                        <Check size={12} />
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        Jaminan kepuasan pelanggan melalui garansi ganti baru
                        dan layanan responsif.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-400 pt-2">
                  <CheckCircle2 size={16} /> Customer Experience Guaranteed
                </div>
              </div>
            </StoryBlock>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: ACADEMIC BACKGROUND ================= */}
      <section className="py-20 px-4 md:px-8 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-4xl w-full mx-auto">
          <StoryBlock className="rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-950 dark:to-black p-8 md:p-12 shadow-xl space-y-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                <GraduationCap size={28} />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                  Akademik & Pengawasan
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-zinc-900 dark:text-white">
                  Latar Belakang Proyek
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm md:text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
              Platform e-commerce{" "}
              <strong className="text-zinc-900 dark:text-white">
                IDVISION
              </strong>{" "}
              dirancang dan dikembangkan secara intensif pada{" "}
              <strong className="text-emerald-600 dark:text-emerald-400">
                Awal Semester 8
              </strong>{" "}
              sebagai pemenuhan tugas proyek mata kuliah utama yang diampu oleh
              dosen pembimbing:
            </p>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400 tracking-widest">
                  Dosen Pengampu Mata Kuliah
                </p>
                <h3 className="text-xl font-black uppercase text-zinc-900 dark:text-white">
                  Ibu Rahmawati, M.Kom
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Pembimbing Pengembangan E-Commerce
                </p>
              </div>

              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider shrink-0">
                Semester 8 Awal
              </span>
            </div>
          </StoryBlock>
        </div>
      </section>

      {/* ================= SECTION 4: TEAM MEMBERS (DEV PROFILES) ================= */}
      <section className="py-20 px-4 md:px-8 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-6xl w-full mx-auto space-y-16">
          <StoryBlock className="text-center space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-black uppercase text-emerald-600 dark:text-emerald-400">
              <Cpu size={15} /> Engineering Team
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
              Pengembang Platform
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              Kolaborasi teknis pengembangan arsitektur backend dan antarmuka
              frontend.
            </p>
          </StoryBlock>

          {/* DENI SETIAWAN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <StoryBlock
              className="lg:col-span-5 flex justify-center"
              delay={150}
            >
              <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden border-2 border-emerald-500/30 bg-zinc-200 dark:bg-zinc-800 shadow-xl group">
                <img
                  src="/images/deni.jpg"
                  alt="Deni Setiawan - Backend Developer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black">
                    Lead Backend
                  </span>
                  <p className="text-xl font-black uppercase mt-1.5 tracking-tight">
                    Deni Setiawan
                  </p>
                </div>
              </div>
            </StoryBlock>

            <StoryBlock className="lg:col-span-7 space-y-6" delay={300}>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-black uppercase text-emerald-600 dark:text-emerald-400">
                <Code2 size={16} /> Backend & System Architect
              </div>

              <h3 className="text-3xl sm:text-4xl font-black uppercase text-zinc-900 dark:text-white">
                Deni Setiawan
              </h3>

              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Bertanggung jawab penuh atas arsitektur sistem backend, relasi
                database MySQL, keamanan data, serta kestabilan endpoint REST
                API platform IDVISION.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-900/60 p-5 shadow-sm">
                  <Database size={22} className="text-emerald-500 mb-2" />
                  <h4 className="text-xs font-black uppercase text-zinc-900 dark:text-white">
                    REST API & Database
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    Pengelolaan struktur tabel produk, varian stok otomatis, dan
                    endpoint JSON berkecepatan tinggi.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-900/60 p-5 shadow-sm">
                  <Smartphone size={22} className="text-emerald-500 mb-2" />
                  <h4 className="text-xs font-black uppercase text-zinc-900 dark:text-white">
                    Payment & WhatsApp
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    Integrasi payment gateway Midtrans dan notifikasi pesanan
                    realtime via WhatsApp API Fonnte.
                  </p>
                </div>
              </div>
            </StoryBlock>
          </div>

          <hr className="border-zinc-200 dark:border-zinc-800/80" />

          {/* MUHAMMAD IKHWAN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <StoryBlock
              className="lg:col-span-7 space-y-6 order-2 lg:order-1"
              delay={150}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs font-black uppercase text-sky-600 dark:text-sky-400">
                <Layout size={16} /> Frontend & UI/UX Specialist
              </div>

              <h3 className="text-3xl sm:text-4xl font-black uppercase text-zinc-900 dark:text-white">
                Muhammad Ikhwan
              </h3>

              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Bertanggung jawab pada perancangan antarmuka pengguna yang
                responsif, modern, intuitif, dan performatif di seluruh
                perangkat desktop maupun mobile.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-900/60 p-5 shadow-sm">
                  <Layers size={22} className="text-sky-500 mb-2" />
                  <h4 className="text-xs font-black uppercase text-zinc-900 dark:text-white">
                    Next.js & TypeScript
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    Pengembangan komponen arsitektur Next.js 16, TypeScript
                    murni, serta state management Cart Context.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200/80 bg-white dark:border-zinc-800/80 dark:bg-zinc-900/60 p-5 shadow-sm">
                  <Sparkles size={22} className="text-sky-500 mb-2" />
                  <h4 className="text-xs font-black uppercase text-zinc-900 dark:text-white">
                    Dual Theme & Modern UI
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    Implementasi Dark/Light mode dinamis, Hero Banner bergaya
                    Eiger, dan mikro-animasi antarmuka.
                  </p>
                </div>
              </div>
            </StoryBlock>

            <StoryBlock
              className="lg:col-span-5 flex justify-center order-1 lg:order-2"
              delay={300}
            >
              <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden border-2 border-sky-500/30 bg-zinc-200 dark:bg-zinc-800 shadow-xl group">
                <img
                  src="/images/ikhwan.jpg"
                  alt="Muhammad Ikhwan - Frontend Engineer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="rounded-full bg-sky-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black">
                    Frontend Specialist
                  </span>
                  <p className="text-xl font-black uppercase mt-1.5 tracking-tight">
                    Muhammad Ikhwan
                  </p>
                </div>
              </div>
            </StoryBlock>
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: CALL TO ACTION FOOTER ================= */}
      <section className="py-24 px-4 md:px-8 bg-zinc-900 text-white dark:bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />

        <StoryBlock className="max-w-3xl w-full mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            Siap Menemukan Kacamata Pilihan Anda?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Nikmati kemudahan belanja kacamata gaya dan outdoor dengan
            pengiriman cepat, konfirmasi WhatsApp, dan metode COD.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/products"
              className="rounded-full bg-emerald-500 px-8 py-4 text-xs font-black uppercase tracking-wider text-black shadow-xl transition-all hover:bg-emerald-400 hover:scale-105 active:scale-95"
            >
              Katalog Produk
            </Link>
            <Link
              href="/store"
              className="rounded-full border border-zinc-700 bg-zinc-800/80 px-8 py-4 text-xs font-black uppercase tracking-wider text-white transition-all hover:bg-zinc-700 hover:scale-105 active:scale-95"
            >
              Lokasi Toko
            </Link>
          </div>
        </StoryBlock>
      </section>
    </div>
  );
}
