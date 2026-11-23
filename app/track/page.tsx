import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TrackClient from './TrackClient';
import { getSiteSettings } from '@/lib/data';

export const revalidate = 0;

export default async function TrackPage({
  searchParams,
}: {
  searchParams: { order?: string; imei?: string; tab?: string };
}) {
  const { brandIdentity, footerInfo } = await getSiteSettings();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar
        customLogoUrl={brandIdentity.logo_url}
        brandName={brandIdentity.brand_name}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <TrackClient
          initialOrderNumber={searchParams.order}
          initialImei={searchParams.imei}
          initialTab={searchParams.tab}
        />
      </main>

      <Footer footerInfo={footerInfo} brandIdentity={brandIdentity} />
    </div>
  );
}

