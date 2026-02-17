import Link from 'next/link';
import Image from 'next/image';
import { brand, images, content } from '@/lib/shop-config';

export default function Footer() {
  const f = content.footer;

  return (
    <footer className="bg-espresso text-cream-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 bg-cream-100 rounded-full p-1">
                <Image
                  src={images.logo}
                  alt={brand.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-serif text-xl text-cream-100 font-semibold">
                {brand.name}
              </span>
            </div>
            <p className="font-sans text-sm leading-relaxed text-cream-300 max-w-xs">
              {f.description}
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-cream-100">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="font-sans text-sm text-cream-300 hover:text-copper-light transition-colors duration-200"
              >
                Shop All
              </Link>
              <Link 
                href="/#about" 
                className="font-sans text-sm text-cream-300 hover:text-copper-light transition-colors duration-200"
              >
                Our Story
              </Link>
              <Link 
                href="/#contact" 
                className="font-sans text-sm text-cream-300 hover:text-copper-light transition-colors duration-200"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact info */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg text-cream-100">Get in Touch</h3>
            <div className="font-sans text-sm text-cream-300 space-y-2">
              <p>{brand.email}</p>
              <p>{f.tagline}</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-espresso-light">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-sans text-xs text-cream-300">
              &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
            </p>
            <p className="font-serif text-sm text-copper-light italic">
              &ldquo;{f.motto}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

