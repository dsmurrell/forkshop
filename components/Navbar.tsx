'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { useCart } from './CartProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { brand, images, commerce } from '@/lib/shop-config';

export default function Navbar() {
  const { itemCount, toggleCart } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-cream-100/95 backdrop-blur-sm border-b border-cream-300/50">
      {/* Free shipping banner */}
      <div className="bg-espresso text-cream-100 text-center py-2 px-4">
        <p className="text-sm font-sans tracking-wide">
          {commerce.shipping.bannerText}
        </p>
      </div>
      
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-14 h-14 transition-transform duration-300 group-hover:scale-105">
              <Image
                src={images.logo}
                alt={brand.name}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-serif text-xl text-espresso font-semibold tracking-tight">
                {brand.name}
              </h1>
              <p className="text-xs text-espresso-lighter font-sans tracking-widest uppercase">
                {brand.tagline}
              </p>
            </div>
          </Link>

          {/* Cart button */}
          <button
            onClick={toggleCart}
            className="relative p-3 rounded-full hover:bg-cream-200 transition-colors duration-200 group"
            aria-label={`Shopping cart with ${itemCount} items`}
          >
            <ShoppingBag 
              className="w-6 h-6 text-espresso transition-transform duration-200 group-hover:scale-105" 
              strokeWidth={1.5}
            />
            <AnimatePresence mode="wait">
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-copper text-cream-50 text-xs font-sans font-medium rounded-full flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>
    </header>
  );
}

