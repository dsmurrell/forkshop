'use client';

import { ReactNode, useCallback } from 'react';
import {
  useCartStore,
  selectItems,
  selectItemCount,
  selectTotal,
  selectIsOpen,
  selectIsCheckingOut,
  selectCheckoutError,
} from '@/lib/cartStore';

export function CartProvider({ children }: { children: ReactNode }) {
  // Zustand handles state; this component simply renders children.
  return <>{children}</>;
}

export function useCart() {
  const items = useCartStore(selectItems);
  const itemCount = useCartStore(selectItemCount);
  const total = useCartStore(selectTotal);
  const isOpen = useCartStore(selectIsOpen);
  const isCheckingOut = useCartStore(selectIsCheckingOut);
  const checkoutError = useCartStore(selectCheckoutError);

  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const setCheckingOut = useCartStore((state) => state.setCheckingOut);
  const setCheckoutError = useCartStore((state) => state.setCheckoutError);
  const buildCheckoutPayload = useCartStore((state) => state.buildCheckoutPayload);

  const checkout = useCallback(async () => {
    if (items.length === 0) return;

    setCheckingOut(true);
    setCheckoutError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: buildCheckoutPayload() }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Unexpected response from server. Please try again.');
      }

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Checkout failed');
      }

      window.location.href = data.url as string;
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Checkout failed');
      setCheckingOut(false);
    }
  }, [items, buildCheckoutPayload, setCheckingOut, setCheckoutError]);

  return {
    items,
    isOpen,
    isCheckingOut,
    checkoutError,
    itemCount,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    checkout,
    openCart,
    closeCart,
    toggleCart,
  };
}

