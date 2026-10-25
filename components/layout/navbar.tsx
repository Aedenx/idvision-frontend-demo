"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Sun,
  Moon,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import CartDrawer from "@/components/cart/cart-drawer";
import { getSiteSettings } from "@/lib/site-data";
import { getProducts } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // State Search & Sugesti
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { totalItems } = useCart();

  const checkLoginStatus = () => {
    const user = localStorage.getItem("customer_user");
    setIsLoggedIn(!!user);
  };

  useEffect(() => {
    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    getSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });

    const savedTheme =
      (localStorage.getItem("theme") as "dark" | "light") || "dark";
    setTheme(savedTheme);

    const root = document.documentElement;
    if (savedTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      getProducts({ search: searchQuery }).then((res) => {
        if (res && res.data) {
          setSuggestions(res.data.slice(0, 5));
        } else {
          setSuggestions([]);
        }
        setIsSearching(false);
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);

    const root = document.documentElement;
    if (nextTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearchOpen(false);
    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
  };

  const handleSelectSuggestion = (slug: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(`/products/${slug}`);
  };

  // PROTEKSI AKSES: Hanya Boleh Diakses Jika Sudah Login
  const handleProtectedAction = (targetPath?: string) => {
    const activeUser = localStorage.getItem("customer_user");

    if (!activeUser) {
      router.push("/login");
      return;
    }

    if (targetPath) {
      router.push(targetPath);
    } else {
      setIsCartOpen(true);
    }
  };

  const siteName = siteSettings.site_name || "IDVISION";
  const logoPath = siteSettings.site_logo || siteSettings.logo;

  const logoUrl = logoPath
    ? logoPath.startsWith("http")
      ? logoPath
      : `/uploads/${logoPath.replace(/^\//, "")}`
    : "/images/logo.png";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="flex flex-col items-center justify-center text-white group py-1"
        >
          <img
            src={logoUrl}
            alt={siteName}
            className="h-6 w-auto object-contain transition-transform group-hover:scale-105 md:h-7"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/logo.png";
            }}
          />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-300 md:text-[10px] mt-0.5">
            <span className="text-emerald-400">{siteName.substring(0, 2)}</span>
            {siteName.substring(2)}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-xs font-bold uppercase tracking-wider text-zinc-300 md:flex">
          <Link href="/" className="transition hover:text-emerald-400">
            Home
          </Link>
          <Link href="/products" className="transition hover:text-emerald-400">
            Produk
          </Link>

          <button
            onClick={() => handleProtectedAction("/promo")}
            className="text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:text-emerald-400 cursor-pointer bg-transparent border-none p-0"
          >
            Promo
          </button>

          <Link href="/about" className="transition hover:text-emerald-400">
            About
          </Link>
          <Link href="/store" className="transition hover:text-emerald-400">
            Store
          </Link>
        </nav>

        <div className="flex items-center gap-4 text-white">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search"
            className="transition hover:text-emerald-400 cursor-pointer text-zinc-300 hover:text-white"
          >
            <Search size={19} />
          </button>

          {/* KERANJANG BELANJA DIPROTEKSI */}
          <button
            onClick={() => handleProtectedAction()}
            aria-label="Cart"
            className="relative transition hover:text-emerald-400 cursor-pointer text-zinc-300 hover:text-white"
          >
            <ShoppingBag size={19} />
            {totalItems > 0 && isLoggedIn && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-black">
                {totalItems}
              </span>
            )}
          </button>

          <Link
            href={isLoggedIn ? "/account" : "/login"}
            aria-label="Account"
            className="hidden transition hover:text-emerald-400 sm:block text-zinc-300 hover:text-white"
            title={isLoggedIn ? "Dashboard Akun Saya" : "Masuk / Daftar"}
          >
            <div className="relative">
              <User size={19} />
              {isLoggedIn && (
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-zinc-950" />
              )}
            </div>
          </Link>

          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="rounded-lg p-1.5 text-zinc-300 transition hover:bg-zinc-800/60 hover:text-emerald-400 cursor-pointer border border-zinc-800 bg-zinc-900/50"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
            className="text-zinc-300 transition hover:text-white md:hidden"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MODAL SEARCH & DROPDOWN SUGESTI HASIL */}
      {isSearchOpen && (
        <div
          ref={searchContainerRef}
          className="absolute top-16 left-0 w-full border-b border-zinc-800 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-xl transition-all"
        >
          <div className="mx-auto max-w-3xl">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center"
            >
              <Search size={18} className="absolute left-4 text-zinc-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kacamata, kategori (Pria, Wanita, Kids)..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 py-2.5 pl-11 pr-10 text-xs font-medium text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 text-zinc-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </form>

            {searchQuery.trim().length >= 2 && (
              <div className="mt-3 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/95 p-2 shadow-lg">
                {isSearching ? (
                  <div className="p-3 text-center text-xs text-zinc-400">
                    Mencari produk...
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="divide-y divide-zinc-800/60">
                    {suggestions.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectSuggestion(item.slug)}
                        className="flex items-center justify-between p-2 hover:bg-zinc-800/50 rounded-lg cursor-pointer transition"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              item.image_url ||
                              item.image ||
                              "/images/placeholder.jpg"
                            }
                            alt={item.name}
                            className="h-9 w-9 rounded-md object-contain bg-zinc-950 p-1 border border-zinc-800"
                          />
                          <div>
                            <div className="text-xs font-bold text-white">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-emerald-400 font-semibold">
                              {item.category_name || item.gender} &bull; Rp{" "}
                              {(
                                item.discount_price ||
                                item.base_price ||
                                item.price
                              ).toLocaleString("id-ID")}
                            </div>
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-zinc-500" />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full pt-2 pb-1 text-center text-[11px] font-bold text-emerald-400 hover:underline"
                    >
                      Lihat semua hasil untuk "{searchQuery}" &rarr;
                    </button>
                  </div>
                ) : (
                  <div className="p-3 text-center text-xs text-zinc-400">
                    Tidak ada produk atau kategori yang cocok dengan "
                    {searchQuery}".
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* DRAWER MENU MOBILE */}
      {isMobileMenuOpen && (
        <div className="border-b border-zinc-800 bg-zinc-950 px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-300 md:hidden">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="transition hover:text-emerald-400"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="transition hover:text-emerald-400"
            >
              Produk
            </Link>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleProtectedAction("/promo");
              }}
              className="text-left text-xs font-bold uppercase tracking-wider text-zinc-300 transition hover:text-emerald-400 cursor-pointer bg-transparent border-none p-0"
            >
              Promo
            </button>

            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="transition hover:text-emerald-400"
            >
              About
            </Link>
            <Link
              href="/store"
              onClick={() => setIsMobileMenuOpen(false)}
              className="transition hover:text-emerald-400"
            >
              Store
            </Link>

            <Link
              href={isLoggedIn ? "/account" : "/login"}
              onClick={() => setIsMobileMenuOpen(false)}
              className="pt-2 border-t border-zinc-800 text-emerald-400 flex items-center justify-between"
            >
              <span>{isLoggedIn ? "Dashboard Akun" : "Masuk / Daftar"}</span>
              <User size={16} />
            </Link>
          </div>
        </div>
      )}

      {isLoggedIn && (
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      )}
    </header>
  );
}
