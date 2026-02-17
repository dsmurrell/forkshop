'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { content } from '@/lib/shop-config';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  const c = content.error;

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-6 max-w-md">
        <p className="text-6xl mb-4" role="img" aria-label={c.emojiLabel}>
          {c.emoji}
        </p>
        <h1 className="font-serif text-3xl text-espresso mb-3">
          {c.title}
        </h1>
        <p className="font-sans text-base text-espresso-lighter mb-8">
          {c.description}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={reset} className="btn-primary inline-flex">
            Try again
          </button>
          <Link href="/" className="btn-secondary inline-flex">
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
