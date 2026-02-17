import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import { CartProvider } from '@/components/CartProvider';
import { brand, seo, images, analytics, getBaseUrl } from '@/lib/shop-config';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const BASE_URL = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: seo.title,
    template: seo.titleTemplate,
  },
  description: seo.description,
  keywords: seo.keywords,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: seo.title,
    description: seo.description,
    type: 'website',
    url: BASE_URL,
    siteName: brand.name,
    images: [
      {
        url: images.ogImage,
        width: 1200,
        height: 630,
        alt: seo.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
    images: [images.ogImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        {analytics.plausibleScript && (
          <>
            <Script
              src={analytics.plausibleScript}
              strategy="afterInteractive"
            />
            <Script id="plausible-init" strategy="afterInteractive">
              {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Cart />
        </CartProvider>
      </body>
    </html>
  );
}

