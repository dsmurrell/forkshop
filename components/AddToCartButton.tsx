'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from './CartProvider';
import { Product } from '@/lib/types';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  variant?: 'default' | 'large';
  className?: string;
}

export default function AddToCartButton({ 
  product, 
  quantity = 1, 
  variant = 'default',
  className = '' 
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const baseStyles = variant === 'large'
    ? 'w-full py-4 px-6 text-base'
    : 'w-full py-3 px-4 text-sm';

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label={isAdded ? `${product.name} added to cart` : `Add ${product.name} to cart`}
      className={`
        ${baseStyles}
        ${isAdded ? 'bg-sage' : 'bg-copper hover:bg-copper-dark'}
        text-cream-50 font-sans font-medium rounded-lg
        transition-colors duration-200
        flex items-center justify-center gap-2
        ${className}
      `}
      disabled={isAdded}
    >
      {isAdded ? (
        <>
          <Check className="w-4 h-4" strokeWidth={2} />
          <span>Added to Cart</span>
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
          <span>Add to Cart</span>
        </>
      )}
    </motion.button>
  );
}

