'use client';

import { useState, Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';
import { commerce, content, formatPrice, productConfig, type DetailField } from '@/lib/shop-config';

/**
 * Lightweight inline markdown: **bold**, *italic*, and \n line breaks.
 * Used for product metadata values and the detail note.
 */
function renderMarkdown(text: string) {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\n)/g);
  return tokens.map((token, i) => {
    if (token === '\n') return <br key={i} />;
    if (token.startsWith('**') && token.endsWith('**')) {
      return <strong key={i} className="font-semibold">{token.slice(2, -2)}</strong>;
    }
    if (token.startsWith('*') && token.endsWith('*')) {
      return <em key={i}>{token.slice(1, -1)}</em>;
    }
    return <Fragment key={i}>{token}</Fragment>;
  });
}

function renderDetailValue(value: string, field: DetailField) {
  if (field.markdown) return renderMarkdown(value);
  return value;
}

interface ProductPageContentProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductPageContent({ product, relatedProducts }: ProductPageContentProps) {
  const minQty = product.minQuantity ?? 1;
  const [quantity, setQuantity] = useState(minQty);
  const outOfStock = product.stock !== 'unlimited' && product.stock <= 0;

  const decrementQuantity = () => {
    if (quantity > minQty) setQuantity(quantity - 1);
  };

  const incrementQuantity = () => {
    if (quantity < commerce.cart.maxQuantity) setQuantity(quantity + 1);
  };

  const formattedPrice = formatPrice(product.price);

  const visibleFields = productConfig.detailFields.filter(
    (f) => product.metadata[f.key]
  );

  return (
    <>
      <div className="container-custom pt-8">
        <Link
          href="/#shop"
          className="inline-flex items-center gap-2 font-sans text-sm text-espresso-lighter hover:text-copper transition-colors"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Back to Shop
        </Link>
      </div>

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
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-espresso-lighter font-sans">
                  No image
                </div>
              )}
              {outOfStock && (
                <div className="absolute top-4 right-4 bg-espresso/80 text-cream-50 text-sm font-sans font-medium px-4 py-2 rounded-full">
                  Sold Out
                </div>
              )}
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

              {!outOfStock && (
                <>
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

                  {minQty > 1 && (
                    <p className="font-sans text-sm text-espresso-lighter italic mb-6">
                      {(product.metadata.min_order_message || content.products.productMinOrderNote).replace('{minQty}', String(minQty))}
                    </p>
                  )}
                </>
              )}

              <div className="max-w-sm">
                <AddToCartButton product={product} quantity={quantity} variant="large" />
              </div>

              {/* Product Details — driven by productConfig.detailFields */}
              {visibleFields.length > 0 && (
                <div className="mt-8 pt-6 border-t border-cream-300">
                  <h3 className="font-serif text-lg text-espresso mb-4">Product Details</h3>
                  <div className="space-y-4 font-sans text-sm text-espresso-lighter leading-relaxed">
                    {visibleFields.map((field) => (
                      <p key={field.key}>
                        <span className="text-espresso font-medium">{field.label}: </span>
                        {renderDetailValue(product.metadata[field.key], field)}
                      </p>
                    ))}
                    {productConfig.detailNote && (
                      <p>{renderMarkdown(productConfig.detailNote)}</p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

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
