'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, TradeInInfo } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  tradeIn: TradeInInfo | null;
  setTradeIn: (info: TradeInInfo | null) => void;
  clearTradeIn: () => void;
  subtotal: number;
  tradeInDiscount: number;
  total: number;
  totalQuantity: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'jaya_cell_cart_v1';
const TRADEIN_STORAGE_KEY = 'jaya_cell_tradein_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [tradeIn, setTradeInState] = useState<TradeInInfo | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedTradeIn = localStorage.getItem(TRADEIN_STORAGE_KEY);
      if (savedTradeIn) {
        setTradeInState(JSON.parse(savedTradeIn));
      }
    } catch (e) {
      console.error('Failed to parse cart storage', e);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart', e);
      }
    }
  }, [items, mounted]);

  const setTradeIn = (info: TradeInInfo | null) => {
    setTradeInState(info);
    if (info) {
      localStorage.setItem(TRADEIN_STORAGE_KEY, JSON.stringify(info));
    } else {
      localStorage.removeItem(TRADEIN_STORAGE_KEY);
    }
  };

  const clearTradeIn = () => {
    setTradeIn(null);
  };

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.variantId === newItem.variantId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const nextQty = updated[existingIndex].quantity + newItem.quantity;
        updated[existingIndex].quantity = Math.min(nextQty, newItem.maxStock || 99);
        return updated;
      }
      return [...prev, newItem];
    });
    setIsOpen(true);
  };

  const removeItem = (variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.variantId === variantId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setTradeIn(null);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(TRADEIN_STORAGE_KEY);
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tradeInDiscount = tradeIn ? tradeIn.valuation_amount : 0;
  const total = Math.max(0, subtotal - tradeInDiscount);
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        setIsOpen,
        tradeIn,
        setTradeIn,
        clearTradeIn,
        subtotal,
        tradeInDiscount,
        total,
        totalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

