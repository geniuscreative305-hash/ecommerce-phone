import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import CartSlideOver from '@/components/CartSlideOver';
import QuickEditButton from '@/components/QuickEditButton';
import { getSiteSettings } from '@/lib/data';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0066FF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(): Promise<Metadata> {
  const { brandIdentity } = await getSiteSettings();
  const title = `${brandIdentity.brand_name} - Pusat Smartphone Resmi, Tukar Tambah & POS`;
  const description =
    brandIdentity.tagline ||
    'Jaya Cell adalah pusat smartphone resmi bergaransi TAM, iBox, SEIN dengan layanan tukar tambah instan & kasir POS konter.';

  return {
    metadataBase: new URL('http://localhost:3000'),
    title,
    description,
    icons: {
      icon: brandIdentity.favicon_url || '/icon.svg',
      shortcut: brandIdentity.favicon_url || '/icon.svg',
      apple: brandIdentity.favicon_url || '/icon.svg',
    },
    manifest: '/manifest.webmanifest',
    openGraph: {
      title,
      description,
      siteName: brandIdentity.brand_name,
      images: [
        {
          url: brandIdentity.logo_url || '/icon.svg',
          width: 512,
          height: 512,
          alt: brandIdentity.brand_name,
        },
      ],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body className="font-sans antialiased bg-white text-slate-900 selection:bg-[#0066FF] selection:text-white min-h-screen flex flex-col">
        <CartProvider>
          {children}
          <CartSlideOver />
          <QuickEditButton />
        </CartProvider>
      </body>
    </html>
  );
}
