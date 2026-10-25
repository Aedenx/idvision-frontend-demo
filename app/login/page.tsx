"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff } from "lucide-react";
import { getSiteSettings } from "@/lib/site-data";
import { getImageUrl } from "@/lib/api";

export default function AuthPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    getSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (isRegister) {
          setSuccessMsg("Registrasi berhasil! Silakan login dengan akun Anda.");
          setIsRegister(false);
          setFormData({ name: "", email: "", phone: "", password: "" });
        } else {
          localStorage.setItem(
            "customer_token",
            data.token || "token_idvisionstore.web.id_user",
          );
          localStorage.setItem("customer_user", JSON.stringify(data.user));

          router.push("/account");
        }
      } else {
        setErrorMsg(
          data.message || "Terjadi kesalahan, periksa kembali data Anda.",
        );
      }
    } catch (err) {
      setErrorMsg("Gagal terhubung ke server backend IDVISION.");
    } finally {
      setLoading(false);
    }
  };

  const siteName = siteSettings.site_name || "IDVISION";
  const rawLogo = siteSettings.site_logo || siteSettings.logo;

  // Logika pembacaan URL Logo yang komprehensif
  const getLogoSrc = (path?: string) => {
    if (!path) return "/images/logo.png";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("/")) return path;

    // Gunakan helper getImageUrl atau arahkan ke folder upload
    return getImageUrl(path, "uploads") || `/uploads/${path}`;
  };

  const logoUrl = getLogoSrc(rawLogo);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white text-zinc-900 dark:bg-black dark:text-white transition-colors duration-300 flex items-center justify-center py-12 px-4 md:px-8">
      <main className="w-full max-w-md">
        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="text-center space-y-3">
            <Link
              href="/"
              className="inline-flex flex-col items-center justify-center group py-1"
            >
              <img
                src={logoUrl}
                alt={siteName}
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
                onError={(e) => {
                  // Fallback bertingkat jika gambar gagal di-load
                  const target = e.target as HTMLImageElement;
                  if (target.src.includes("/images/logo.png")) {
                    target.src = "/images/placeholder.jpg";
                  } else {
                    target.src = "/images/logo.png";
                  }
                }}
              />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700 dark:text-zinc-300 mt-1">
                <span className="text-emerald-500">
                  {siteName.substring(0, 2)}
                </span>
                {siteName.substring(2)}
              </span>
            </Link>

            <h1 className="text-2xl font-black uppercase tracking-tight text-zinc-900 dark:text-white">
              {isRegister ? "Buat Akun Baru" : "Masuk ke Akun Anda"}
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isRegister
                ? "Daftar untuk melacak pesanan & riwayat belanja kacamata Anda."
                : "Nikmati kemudahan checkout instan dan riwayat belanja."}
            </p>
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-semibold text-red-600 dark:text-red-400 text-center">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 text-center">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: Deni Setiawan"
                    required
                    className="w-full rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 py-2.5 pl-10 pr-4 text-xs font-medium placeholder-zinc-400 focus:border-emerald-500 focus:outline-none transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  required
                  className="w-full rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 py-2.5 pl-10 pr-4 text-xs font-medium placeholder-zinc-400 focus:border-emerald-500 focus:outline-none transition"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1">
                  Nomor WhatsApp
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="08587766xxxx"
                    required
                    className="w-full rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 py-2.5 pl-10 pr-4 text-xs font-medium placeholder-zinc-400 focus:border-emerald-500 focus:outline-none transition"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Kata Sandi
                </label>
                {!isRegister && (
                  <Link
                    href="/forgot-password"
                    className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Lupa Sandi?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 py-2.5 pl-10 pr-10 text-xs font-medium placeholder-zinc-400 focus:border-emerald-500 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-xs font-black uppercase tracking-wider text-black shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <span>
                  {loading
                    ? "Memproses..."
                    : isRegister
                      ? "Daftar Sekarang"
                      : "Masuk Akun"}
                </span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">
              {isRegister
                ? "Sudah memiliki akun IDVISION?"
                : "Belum punya akun?"}
            </span>{" "}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="font-black uppercase text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer ml-1"
            >
              {isRegister ? "Masuk Disini" : "Daftar Disini"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
