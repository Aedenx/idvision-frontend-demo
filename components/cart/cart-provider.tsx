"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("idvisionstore.web.id_cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error("Gagal memuat keranjang:", e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("idvisionstore.web.id_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (newItem: CartItem) => {
    const targetId = String(newItem.id);
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => String(item.id) === targetId,
      );
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += newItem.quantity || 1;
        return updated;
      }
      return [
        ...prevItems,
        { ...newItem, id: targetId, quantity: newItem.quantity || 1 },
      ];
    });
  };

  const removeFromCart = (id: string) => {
    const targetId = String(id);
    setItems((prevItems) =>
      prevItems.filter((item) => String(item.id) !== targetId),
    );
  };

  const updateQuantity = (id: string, quantity: number) => {
    const targetId = String(id);
    if (quantity <= 0) {
      removeFromCart(targetId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        String(item.id) === targetId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0,
  );

  const totalItems = items.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart harus digunakan di dalam CartProvider");
  }
  return context;
}
