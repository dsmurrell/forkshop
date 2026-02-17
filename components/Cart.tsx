'use client';

import { Fragment, useMemo, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from './CartProvider';
import { commerce, content, createPriceFormatter } from '@/lib/shop-config';

export default function Cart() {
  const {
    items,
    isOpen,
    closeCart,
    total,
    updateQuantity,
    removeItem,
    checkout,
    isCheckingOut,
    checkoutError,
  } = useCart();

  const formatter = useMemo(() => createPriceFormatter(), []);

  const remainingForFreeShipping = Math.max(0, commerce.shipping.freeThreshold - total);

  const panelRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCart();
        return;
      }

      if (e.key !== 'Tab' || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [closeCart]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    // Focus the close button when cart opens
    const timer = setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>('button')?.focus();
    }, 100);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-espresso/40 backdrop-blur-sm z-50"
            onClick={closeCart}
          />

          {/* Cart panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-cream-100 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-cream-300">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-espresso" strokeWidth={1.5} />
                <h2 className="font-serif text-xl text-espresso">Your Cart</h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-cream-200 transition-colors duration-200"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 text-espresso" strokeWidth={1.5} />
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 rounded-full bg-cream-200 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-espresso-lighter" strokeWidth={1.5} />
                  </div>
                  <p className="font-serif text-lg text-espresso mb-2">{content.cart.emptyTitle}</p>
                  <p className="font-sans text-sm text-espresso-lighter">
                    {content.cart.emptyMessage}
                  </p>
                </div>
              ) : (
                <ul className="space-y-6">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.li
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-4"
                      >
                        {/* Product image */}
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-cream-200 flex-shrink-0">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif text-base text-espresso truncate">
                            {item.product.name}
                          </h3>
                          <p className="font-sans text-sm text-espresso-lighter mt-0.5">
                            {formatter.format(item.product.price)}
                          </p>

                          {/* Quantity controls */}
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center border border-cream-300 rounded-full">
                              {item.quantity <= (item.product.minQuantity ?? 1) ? (
                                <button
                                  onClick={() => removeItem(item.product.id)}
                                  className="p-1.5 hover:bg-red-50 rounded-l-full transition-colors"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="p-1.5 hover:bg-cream-200 rounded-l-full transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3.5 h-3.5 text-espresso" />
                                </button>
                              )}
                              <span className="font-sans text-sm text-espresso w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1.5 hover:bg-cream-200 rounded-r-full transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5 text-espresso" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="font-sans text-xs text-espresso-lighter hover:text-copper transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Line total */}
                        <p className="font-sans text-sm font-medium text-espresso">
                          {formatter.format(item.product.price * item.quantity)}
                        </p>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-cream-300 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm text-espresso-lighter">Subtotal</span>
                  <span className="font-serif text-xl text-espresso">
                    {formatter.format(total)}
                  </span>
                </div>
                {checkoutError && (
                  <p className="font-sans text-sm text-red-600">{checkoutError}</p>
                )}
                <p className="font-sans text-xs text-espresso-lighter">
                  Shipping and taxes calculated at checkout
                </p>
                <button
                  onClick={checkout}
                  disabled={isCheckingOut || items.length === 0}
                  className="w-full py-4 bg-copper hover:bg-copper-dark text-cream-50 font-sans font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? 'Processing…' : `Checkout · ${formatter.format(total)}`}
                </button>
                {remainingForFreeShipping > 0 && (
                  <p className="font-sans text-sm text-espresso-lighter text-center">
                    Add {formatter.format(remainingForFreeShipping)} more for free shipping
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}

