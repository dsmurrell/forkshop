'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useCart } from '@/components/CartProvider';
import { content } from '@/lib/shop-config';

export default function OrderSuccessPage() {
  const { clearCart, closeCart } = useCart();

  useEffect(() => {
    clearCart();
    closeCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const c = content.orderSuccess;

  return (
    <main className="min-h-screen bg-cream-100 flex items-center justify-center px-6">
      <div className="text-center max-w-md space-y-4">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-600" strokeWidth={1.5} />
        </div>

        <h1 className="text-3xl md:text-4xl font-serif text-espresso">{c.title}</h1>

        <p className="text-espresso-lighter">{c.description}</p>

        <Link
          href="/"
          className="inline-block bg-copper text-cream-50 px-8 py-3 rounded-lg font-medium hover:bg-copper-dark transition-colors"
        >
          {c.cta}
        </Link>
      </div>
    </main>
  );
}

