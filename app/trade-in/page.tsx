import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TradeInClient from './TradeInClient';
import { getSiteSettings, getTradeInRules } from '@/lib/data';

export const revalidate = 0;

export default async function TradeInPage() {
  const [settings, rules] = await Promise.all([
    getSiteSettings(),
    getTradeInRules(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar
        customLogoUrl={settings.brandIdentity.logo_url}
        brandName={settings.brandIdentity.brand_name}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <TradeInClient rules={rules} />
      </main>

      <Footer
        footerInfo={settings.footerInfo}
        brandIdentity={settings.brandIdentity}
      />
    </div>
  );
}

