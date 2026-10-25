"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  X,
  Send,
  Headset,
  Sparkles,
  Bot,
  UserCheck,
} from "lucide-react";

const SUGGESTIONS = [
  "🕶️ Stok & Katalog Kacamata",
  "🚚 Cara Lacak Pesanan",
  "💳 Metode Pembayaran",
  "🧑‍💻 Minta Bantuan Admin",
];

export default function ChatWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleOpenWidget = () => {
    const storedUser = localStorage.getItem("customer_user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      const userPhone = user.phone || user.customer_phone || user.whatsapp;
      const userName = user.name || user.full_name || "Pelanggan";

      if (userPhone) {
        setPhone(userPhone);
        setName(userName);
        setIsRegistered(true);
        setIsOpen(true);
      } else {
        router.push("/login");
      }
    } catch (e) {
      console.error("Gagal membaca data login customer_user", e);
      router.push("/login");
    }
  };

  useEffect(() => {
    if (!isOpen || !isRegistered || !phone) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `/api/chat/messages?phone=${encodeURIComponent(phone)}`,
        );
        const result = await res.json();
        if (result.success || result.status === "success") {
          setMessages(result.data || []);
        }
      } catch (err) {
        console.error("Gagal mengambil data chat:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [isOpen, isRegistered, phone]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    if (!textToSend) setInputMessage("");

    try {
      await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_type: "customer",
          sender_name: name,
          customer_phone: phone,
          message: text,
        }),
      });

      const res = await fetch(
        `/api/chat/messages?phone=${encodeURIComponent(phone)}`,
      );
      const result = await res.json();
      if (result.success || result.status === "success") {
        setMessages(result.data || []);
      }
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={handleOpenWidget}
          className="flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-black font-extrabold shadow-lg hover:bg-emerald-400 transition cursor-pointer"
        >
          <MessageSquare size={20} />
          <span className="text-xs uppercase tracking-wider">Chat Admin</span>
        </button>
      )}

      {isOpen && (
        <div className="w-80 md:w-96 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden flex flex-col h-[480px]">
          {/* HEADER */}
          <div className="bg-zinc-900 p-4 flex justify-between items-center text-white border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Headset size={20} className="text-emerald-400" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">
                  Live Chat IDVISION
                </p>
                <p className="text-[10px] text-zinc-400">
                  {name ? `Halo, ${name}` : "Tim kami siap membantu Anda"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* AREA PESAN */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <Sparkles size={24} className="mx-auto text-emerald-400" />
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  Halo {name}! Ada yang bisa dibantu?
                </p>
                <p className="text-[11px] text-zinc-400 max-w-[220px] mx-auto">
                  Pilih pertanyaan cepat di bawah atau tulis pesan langsung
                  untuk AI & Admin kami.
                </p>
              </div>
            ) : (
              messages.map((m, i) => {
                const isMe = m.sender_type === "customer";
                const isAi =
                  !isMe &&
                  (m.sender_name?.includes("AI") ||
                    m.sender_name?.includes("Bot"));

                return (
                  <div
                    key={i}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        isMe
                          ? "bg-emerald-500 text-black font-medium rounded-br-none"
                          : isAi
                            ? "bg-indigo-950/80 text-indigo-100 border border-indigo-800/60 rounded-bl-none"
                            : "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-bl-none border border-zinc-200 dark:border-zinc-800"
                      }`}
                    >
                      {!isMe && (
                        <div className="flex items-center gap-1 mb-1 text-[10px] font-bold">
                          {isAi ? (
                            <span className="inline-flex items-center gap-1 text-indigo-400">
                              <Bot size={12} /> AI Assistant
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-400">
                              <UserCheck size={12} /> Admin CS
                            </span>
                          )}
                        </div>
                      )}

                      <p className="whitespace-pre-line">{m.message}</p>

                      <span
                        className={`text-[9px] block text-right mt-1 ${
                          isMe ? "text-black/60" : "text-zinc-400"
                        }`}
                      >
                        {m.created_at
                          ? new Date(m.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          {/* QUICK SUGGESTIONS BUTTONS */}
          <div className="px-3 py-1.5 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50 flex gap-1.5 overflow-x-auto no-scrollbar">
            {SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(item)}
                className="whitespace-nowrap rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2.5 py-1 text-[10px] font-medium text-zinc-700 dark:text-zinc-300 hover:border-emerald-500 hover:text-emerald-500 transition cursor-pointer shrink-0"
              >
                {item}
              </button>
            ))}
          </div>

          {/* INPUT PESAN */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex gap-2"
          >
            <input
              type="text"
              placeholder="Ketik pertanyaan atau keluhan..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="rounded-xl bg-emerald-500 p-2 text-black hover:bg-emerald-400 transition cursor-pointer"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
