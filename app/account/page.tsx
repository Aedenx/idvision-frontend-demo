"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Package, MapPin, ShieldCheck } from "lucide-react";

import AccountHeader from "./components/account-header";
import OrdersTab from "./components/orders-tab";
import AddressesTab, { Address } from "./components/addresses-tab";
import ProfileTab from "./components/profile-tab";
import { showConfirmAlert } from "@/lib/alert";

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "orders" | "addresses" | "profile"
  >("orders");
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("customer_user");
    if (!savedUser) {
      router.push("/login");
      return;
    }

    try {
      const userData = JSON.parse(savedUser);
      setUser(userData);

      const userKey = userData.user_id || userData.id || userData.email;

      const savedAddresses = localStorage.getItem(
        `customer_addresses_${userKey}`,
      );

      if (savedAddresses) {
        const parsed = JSON.parse(savedAddresses);
        setAddresses(parsed);

        const primary = parsed.find((a: Address) => a.is_primary) || parsed[0];
        if (primary && primary.full_address && !userData.address) {
          const updatedUser = {
            ...userData,
            address: primary.full_address,
            phone: primary.phone || userData.phone,
          };
          setUser(updatedUser);
          localStorage.setItem("customer_user", JSON.stringify(updatedUser));
        }
      } else if (userData.address) {
        const defaultAddr: Address = {
          id: "addr_1",
          label: "Rumah",
          recipient_name:
            userData.full_name || userData.name || "Pelanggan IDVISION",
          phone: userData.phone || "08123456789",
          full_address: userData.address,
          is_primary: true,
        };
        setAddresses([defaultAddr]);
        localStorage.setItem(
          `customer_addresses_${userKey}`,
          JSON.stringify([defaultAddr]),
        );
      }
    } catch (e) {
      console.error("Gagal membaca sesi user", e);
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      const userId = user.user_id || user.id || "";
      if (userId) {
        fetchOrders(userId);
      }
    }
  }, [user]);

  const fetchOrders = async (userId: string) => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`/api/orders/user?user_id=${userId}`);
      const data = await res.json();
      if (data && data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Gagal mengambil pesanan:", err);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSaveAddresses = (newList: Address[]) => {
    setAddresses(newList);
    if (user) {
      const userKey = user.user_id || user.id || user.email;

      localStorage.setItem(
        `customer_addresses_${userKey}`,
        JSON.stringify(newList),
      );

      const primary = newList.find((a) => a.is_primary) || newList[0];

      const updatedUser = {
        ...user,
        address: primary ? primary.full_address : "",
        shipping_address: primary ? primary.full_address : "",
        phone: primary ? primary.phone : user.phone,
      };

      setUser(updatedUser);
      localStorage.setItem("customer_user", JSON.stringify(updatedUser));
    }
  };

  const handleUpdateUser = (updatedUser: any) => {
    setUser(updatedUser);
    localStorage.setItem("customer_user", JSON.stringify(updatedUser));
  };

  const handleLogout = async () => {
    const isConfirmed = await showConfirmAlert(
      "Keluar dari Akun?",
      "Apakah Anda yakin ingin keluar dari akun IDVISION?",
    );

    if (isConfirmed) {
      localStorage.removeItem("customer_user");
      localStorage.removeItem("customer_token");
      router.push("/login");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mb-3" />
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
          Memuat Akun Pengguna...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 space-y-8">
      <AccountHeader
        user={user}
        ordersCount={orders.length}
        addressesCount={addresses.length}
        onLogout={handleLogout}
      />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 items-start">
        <div className="md:col-span-3 rounded-2xl border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-sm space-y-1">
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-black uppercase tracking-wider transition cursor-pointer ${
              activeTab === "orders"
                ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
            }`}
          >
            <div className="flex items-center gap-3">
              <Package size={17} />
              <span>Pesanan Saya</span>
            </div>
            {orders.length > 0 && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  activeTab === "orders"
                    ? "bg-black/20 text-black"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                }`}
              >
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("addresses")}
            className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-black uppercase tracking-wider transition cursor-pointer ${
              activeTab === "addresses"
                ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
            }`}
          >
            <div className="flex items-center gap-3">
              <MapPin size={17} />
              <span>Daftar Alamat</span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                activeTab === "addresses"
                  ? "bg-black/20 text-black"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
              }`}
            >
              {addresses.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-wider transition cursor-pointer ${
              activeTab === "profile"
                ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
            }`}
          >
            <User size={17} />
            <span>Pengaturan Akun</span>
          </button>

          <div className="pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800/80 px-3 pb-2 text-[10px] text-zinc-400 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
            <span>Akun IDVISION Terverifikasi</span>
          </div>
        </div>

        <div className="md:col-span-9">
          {activeTab === "orders" && (
            <OrdersTab orders={orders} loading={loadingOrders} />
          )}
          {activeTab === "addresses" && (
            <AddressesTab
              addresses={addresses}
              onSave={handleSaveAddresses}
              user={user}
            />
          )}
          {activeTab === "profile" && (
            <ProfileTab user={user} onUpdate={handleUpdateUser} />
          )}
        </div>
      </div>
    </div>
  );
}
