'use client';

import { useState, Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';
import { commerce, content, formatPrice } from '@/lib/shop-config';

/**
 * Renders an ingredients string with ALL-CAPS words wrapped in <strong>.
 * Matches words of 2+ uppercase letters (e.g. MILK, WHEAT, SOYA, PECAN NUTS).
 */
function renderIngredients(text: string) {
  const parts = text.split(/(\b[A-Z]{2,}(?:\s+[A-Z]{2,})*\b)/g);
  return parts.map((part, i) =>
    /^[A-Z]{2,}(?:\s+[A-Z]{2,})*$/.test(part) ? (
      <strong key={i} className="font-semibold">
        {part}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}

interface ProductPageContentProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductPageContent({ product, relatedProducts }: ProductPageContentProps) {
  const minQty = product.minQuantity ?? 1;
  const [quantity, setQuantity] = useState(minQty);

  const decrementQuantity = () => {
    if (quantity > minQty) setQuantity(quantity - 1);
  };

  const incrementQuantity = () => {
    if (quantity < commerce.cart.maxQuantity) setQuantity(quantity + 1);
  };

  const formattedPrice = formatPrice(product.price);

  return (
    <>
      {/* Back link */}
      <div className="container-custom pt-8">
        <Link
          href="/#shop"
          className="inline-flex items-center gap-2 font-sans text-sm text-espresso-lighter hover:text-copper transition-colors"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Back to Shop
        </Link>
      </div>

      {/* Product details */}
      <section className="section-padding pt-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Product image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-cream-200"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>

            {/* Product info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <p className="font-sans text-sm tracking-[0.3em] uppercase text-copper mb-3">
                {content.products.categoryLabel}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-light text-espresso mb-4">
                {product.name}
              </h1>
              <p className="font-sans text-2xl text-espresso font-medium mb-6">
                {formattedPrice}
              </p>

              <div className="h-px bg-cream-300 mb-6" />

              <p className="font-sans text-base text-espresso-lighter leading-relaxed mb-8">
                {product.longDescription}
              </p>

              {/* Quantity selector */}
              <div className="mb-6">
                <label className="block font-sans text-sm text-espresso-lighter mb-2">
                  Quantity
                </label>
                <div className="inline-flex items-center border border-cream-300 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    className="p-3 hover:bg-cream-200 rounded-l-lg transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4 text-espresso" strokeWidth={1.5} />
                  </button>
                  <span className="font-sans text-base text-espresso w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="p-3 hover:bg-cream-200 rounded-r-lg transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4 text-espresso" strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Minimum order note */}
              {minQty > 1 && (
                <p className="font-sans text-sm text-espresso-lighter italic mb-6">
                  {content.products.productMinOrderNote.replace('{minQty}', String(minQty))}
                </p>
              )}

              {/* Add to cart button */}
              <div className="max-w-sm">
                <AddToCartButton product={product} quantity={quantity} variant="large" />
              </div>

              {/* Product Details */}
              <div className="mt-8 pt-6 border-t border-cream-300">
                <h3 className="font-serif text-lg text-espresso mb-4">Product Details</h3>
                <div className="space-y-4 font-sans text-sm text-espresso-lighter leading-relaxed">
                  <p>
                    <span className="text-espresso font-medium">Ingredients: </span>
                    {renderIngredients(product.ingredients)}
                  </p>
                  <p>
                    <span className="text-espresso font-medium">Net weight: </span>
                    {product.weight}
                  </p>
                  <p>
                    Allergens in <strong className="font-semibold">BOLD</strong>.
                    Produced in a place that handles{' '}
                    <strong className="font-semibold">all major allergens</strong>.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="section-padding bg-cream-200/50">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="font-serif text-3xl md:text-4xl font-light text-espresso mb-3">
                You Might Also Like
              </h2>
              <p className="font-sans text-sm text-espresso-lighter">
                Discover more of our handcrafted flavours
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
