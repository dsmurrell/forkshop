'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/ProductGrid';
import { Product } from '@/lib/types';
import { brand, images as img, content, commerce } from '@/lib/shop-config';

interface HomeContentProps {
  products: Product[];
}

export default function HomeContent({ products }: HomeContentProps) {
  const searchParams = useSearchParams();
  const [showCanceledMessage, setShowCanceledMessage] = useState(
    () => searchParams.get('canceled') === 'true'
  );

  useEffect(() => {
    if (showCanceledMessage) {
      window.history.replaceState({}, '', '/');
      const timer = setTimeout(() => setShowCanceledMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showCanceledMessage]);

  const hero = content.hero;
  const prod = content.products;
  const about = content.about;
  const contact = content.contact;

  return (
    <>
      {showCanceledMessage && (
        <div className="bg-espresso text-cream-50 text-center py-3 px-4">
          Checkout canceled. Your cart has been saved.
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={img.heroBanner}
            alt={img.heroAlt}
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cream-100/70 via-cream-100/50 to-cream-100" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="font-sans text-sm tracking-[0.3em] uppercase text-copper mb-6">
              {hero.eyebrow}
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-espresso mb-6 text-balance leading-tight"
          >
            {hero.heading}
            <br />
            <span className="italic font-normal">{hero.headingAccent}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-sans text-lg md:text-xl text-espresso-lighter max-w-2xl mx-auto mb-10"
          >
            {hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <a href="#shop" className="inline-flex items-center gap-2 btn-primary text-base">
              {hero.cta}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.a
            href="#shop"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-espresso-lighter hover:text-espresso transition-colors"
          >
            <span className="font-sans text-xs tracking-widest uppercase">Discover</span>
            <ArrowDown className="w-4 h-4" strokeWidth={1.5} />
          </motion.a>
        </motion.div>
      </section>

      {/* Products Section */}
      <section id="shop" className="section-padding bg-cream-100">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="font-sans text-sm tracking-[0.3em] uppercase text-copper mb-4">
              {prod.eyebrow}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-espresso mb-4">
              {prod.heading}
            </h2>
            <p className="font-sans text-base text-espresso-lighter max-w-xl mx-auto">
              {prod.description}
            </p>
            {commerce.cart.defaultMinQuantity > 1 && (
              <p className="font-sans text-sm text-espresso-lighter/80 max-w-lg mx-auto mt-3 italic">
                {prod.minOrderNote.replace('{minQty}', String(commerce.cart.defaultMinQuantity))}
              </p>
            )}
          </motion.div>

          <ProductGrid products={products} />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-cream-200/50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square rounded-2xl overflow-hidden"
            >
              <Image src={img.aboutImage} alt={img.aboutImageAlt} fill className="object-cover" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="font-sans text-sm tracking-[0.3em] uppercase text-copper mb-4">{about.eyebrow}</p>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-espresso mb-6">
                {about.heading}
              </h2>
              <div className="space-y-4 font-sans text-base text-espresso-lighter leading-relaxed">
                {about.paragraphs.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding bg-cream-100">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <p className="font-sans text-sm tracking-[0.3em] uppercase text-copper mb-4">{contact.eyebrow}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-espresso mb-6">
              {contact.heading}
            </h2>
            <p className="font-sans text-base text-espresso-lighter mb-8">
              {contact.description}
            </p>
            <a href={`mailto:${brand.email}`} className="inline-flex btn-primary text-base">
              {brand.email}
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
