import Link from 'next/link';
import { content } from '@/lib/shop-config';

export default function NotFound() {
  const c = content.notFound;

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-6 max-w-md">
        <h1 className="font-serif text-7xl text-espresso mb-2">404</h1>
        <h2 className="font-serif text-2xl text-espresso mb-4">
          {c.title}
        </h2>
        <p className="font-sans text-base text-espresso-lighter mb-8">
          {c.description}
        </p>
        <Link href="/#shop" className="btn-primary inline-flex">
          {c.cta}
        </Link>
      </div>
    </div>
  );
}
