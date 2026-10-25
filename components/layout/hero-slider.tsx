"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/lib/api";

export default function HeroSlider() {
  const [banners, setBanners] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    fetch("/api/banners")
      .then((res) => res.json())
      .then((resData) => {
        const data = resData.data || resData;
        if (Array.isArray(data) && data.length > 0) {
          setBanners(data);
        } else {
          setBanners([
            {
              id: 1,
              title: "Banner Promo IDVISION 1",
              image:
                "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200",
              cta_link: "/products",
            },
            {
              id: 2,
              title: "Banner Promo IDVISION 2",
              image:
                "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200",
              cta_link: "/products?collection=SUMMIT",
            },
          ]);
        }
      })
      .catch(() => {
        setBanners([
          {
            id: 1,
            title: "Banner Promo IDVISION 1",
            image:
              "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200",
            cta_link: "/products",
          },
        ]);
      });
  }, []);

  const next = useCallback(() => {
    if (banners.length === 0) return;
    setCurrent((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    if (banners.length === 0) return;
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next, banners.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;

    if (distance > 50) next();
    else if (distance < -50) prev();

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (banners.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 md:px-10 py-4">
      {/* WRAPPER RELATIVE AGAR PANAH BISA SIMETRIS DI BATAS LUAR & DALAM */}
      <div className="relative w-full">
        {/* CONTAINER SLIDER BANNER */}
        <div
          className="relative w-full overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs select-none touch-pan-y group"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative aspect-[21/9] sm:aspect-[24/9] min-h-[220px] sm:min-h-[320px] md:min-h-[400px] w-full flex items-center">
            {banners.map((s, i) => {
              const imgUrl = getImageUrl(s.image, "banners");
              const destinationUrl = s.cta_link || "/products";

              return (
                <div
                  key={s.id || i}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    i === current
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <Link
                    href={destinationUrl}
                    className="block h-full w-full cursor-pointer overflow-hidden"
                    title={s.title || "Lihat Promo"}
                  >
                    <img
                      src={imgUrl}
                      alt={s.title || "IDVISION Banner Promo"}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.01]"
                    />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* INDIKATOR GARIS TIPIS (PAGINATION BARS) */}
          {banners.length > 1 && (
            <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 gap-1.5">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === current
                      ? "w-7 bg-white shadow-xs"
                      : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* TOMBOL PANAH SETENGAH DI LUAR - SETENGAH DI DALAM (POSISI SIMETRIS ELEGAN ALA EIGER) */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="absolute -left-2.5 md:-left-4 top-1/2 z-40 flex h-9 w-9 md:h-11 md:w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-zinc-900 shadow-xl border border-zinc-200/80 transition hover:bg-zinc-50 active:scale-90"
            >
              <ChevronLeft size={22} className="-ml-0.5 text-zinc-800" />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="absolute -right-2.5 md:-right-4 top-1/2 z-40 flex h-9 w-9 md:h-11 md:w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white text-zinc-900 shadow-xl border border-zinc-200/80 transition hover:bg-zinc-50 active:scale-90"
            >
              <ChevronRight size={22} className="-mr-0.5 text-zinc-800" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
