'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/lib/types';
import AddToCartButton from './AddToCartButton';
import { formatPrice } from '@/lib/shop-config';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const formattedPrice = formatPrice(product.price);
  const outOfStock = product.stock !== 'unlimited' && product.stock <= 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream-200 mb-4">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-espresso-lighter font-sans text-sm">
              No image
            </div>
          )}
          <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/5 transition-colors duration-300" />
          {outOfStock && (
            <div className="absolute top-3 right-3 bg-espresso/80 text-cream-50 text-xs font-sans font-medium px-3 py-1 rounded-full">
              Sold Out
            </div>
          )}
        </div>
      </Link>

      <div className="space-y-2">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-lg text-espresso group-hover:text-copper transition-colors duration-200">
            {product.name}
          </h3>
        </Link>
        <p className="font-sans text-sm text-espresso-lighter line-clamp-1">
          {product.description}
        </p>
        <p className="font-sans text-base font-medium text-espresso">
          {formattedPrice}
        </p>
      </div>

      <div className="mt-4">
        <AddToCartButton product={product} quantity={product.minQuantity} />
      </div>
    </motion.article>
  );
}
