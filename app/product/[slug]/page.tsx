import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductDetailClient from './ProductDetailClient';
import { getSiteSettings, getProductBySlug } from '@/lib/data';

export const revalidate = 0;

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [settings, product] = await Promise.all([
    getSiteSettings(),
    getProductBySlug(params.slug),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar
        customLogoUrl={settings.brandIdentity.logo_url}
        brandName={settings.brandIdentity.brand_name}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ProductDetailClient product={product} />
      </main>

      <Footer
        footerInfo={settings.footerInfo}
        brandIdentity={settings.brandIdentity}
      />
    </div>
  );
}

