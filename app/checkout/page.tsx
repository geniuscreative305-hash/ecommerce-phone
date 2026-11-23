import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CheckoutClient from './CheckoutClient';
import { getSiteSettings } from '@/lib/data';

export const revalidate = 0;

export default async function CheckoutPage() {
  const { brandIdentity, footerInfo } = await getSiteSettings();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar
        customLogoUrl={brandIdentity.logo_url}
        brandName={brandIdentity.brand_name}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <CheckoutClient />
      </main>

      <Footer footerInfo={footerInfo} brandIdentity={brandIdentity} />
    </div>
  );
}

