'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, CheckoutItem } from './types';
import { commerce } from './shop-config';

const MAX_QTY = commerce.cart.maxQuantity;

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  isCheckingOut: boolean;
  checkoutError: string | null;
};

type CartActions = {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setCheckingOut: (value: boolean) => void;
  setCheckoutError: (message: string | null) => void;
  buildCheckoutPayload: () => CheckoutItem[];
};

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isCheckingOut: false,
      checkoutError: null,

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              ...state,
              isOpen: true,
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + quantity) }
                  : i
              ),
            };
          }
          const minQty = product.minQuantity ?? 1;
          return {
            ...state,
            isOpen: true,
            items: [...state.items, { product, quantity: Math.min(MAX_QTY, Math.max(minQty, quantity)) }],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          ...state,
          items: state.items.filter((i) => i.product.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          const item = state.items.find((i) => i.product.id === productId);
          const minQty = item?.product.minQuantity ?? 1;
          if (quantity <= 0 || quantity < minQty) {
            return { ...state, items: state.items.filter((i) => i.product.id !== productId) };
          }
          return {
            ...state,
            items: state.items.map((i) =>
              i.product.id === productId
                ? { ...i, quantity: Math.min(MAX_QTY, quantity) }
                : i
            ),
          };
        }),

      clearCart: () => set((state) => ({ ...state, items: [] })),

      openCart: () => set((state) => ({ ...state, isOpen: true })),
      closeCart: () => set((state) => ({ ...state, isOpen: false })),
      toggleCart: () => set((state) => ({ ...state, isOpen: !state.isOpen })),

      setCheckingOut: (value) => set((state) => ({ ...state, isCheckingOut: value })),
      setCheckoutError: (message) => set((state) => ({ ...state, checkoutError: message })),

      buildCheckoutPayload: () =>
        get().items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
    }),
    {
      name: commerce.cart.storageKey,
      partialize: (state) => ({
        items: state.items,
        isOpen: state.isOpen,
      }),
    }
  )
);

export const selectItems = (state: CartStore) => state.items;
export const selectItemCount = (state: CartStore) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectTotal = (state: CartStore) =>
  state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
export const selectIsOpen = (state: CartStore) => state.isOpen;
export const selectIsCheckingOut = (state: CartStore) => state.isCheckingOut;
export const selectCheckoutError = (state: CartStore) => state.checkoutError;

