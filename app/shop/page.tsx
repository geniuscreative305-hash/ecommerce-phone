import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ShopClient from './ShopClient';
import { getSiteSettings, getBrands, getProducts } from '@/lib/data';

export const revalidate = 0;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { brand?: string; q?: string; filter?: string; sort?: string };
}) {
  const [settings, brands, products] = await Promise.all([
    getSiteSettings(),
    getBrands(),
    getProducts(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar
        customLogoUrl={settings.brandIdentity.logo_url}
        brandName={settings.brandIdentity.brand_name}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ShopClient
          initialProducts={products}
          brands={brands}
          initialBrand={searchParams.brand}
          initialQuery={searchParams.q}
          initialFilter={searchParams.filter}
          initialSort={searchParams.sort}
        />
      </main>

      <Footer
        footerInfo={settings.footerInfo}
        brandIdentity={settings.brandIdentity}
      />
    </div>
  );
}

