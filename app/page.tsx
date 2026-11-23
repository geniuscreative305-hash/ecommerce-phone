import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroBannerSection from '@/components/HeroBannerSection';
import StoreUSPSection from '@/components/StoreUSPSection';
import PromoBannerSection from '@/components/PromoBannerSection';
import BrandsSection from '@/components/BrandsSection';
import NewsletterSection from '@/components/NewsletterSection';
import ProductCard from '@/components/ProductCard';
import { getSiteSettings, getBrands, getProducts } from '@/lib/data';
import { ArrowRight } from 'lucide-react';

export const revalidate = 0; // Ensures fast dynamic updates from CMS

export default async function HomePage() {
  // Parallel data fetching for Zero-Delay standard
  const [settings, brands, products] = await Promise.all([
    getSiteSettings(),
    getBrands(),
    getProducts(),
  ]);

  const popularPhones = products.filter((p) => p.is_popular).slice(0, 4);
  const bestDealPhones = products.filter((p) => p.is_best_deal || p.discount_percent > 0).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navbar */}
      <Navbar
        customLogoUrl={settings.brandIdentity.logo_url}
        brandName={settings.brandIdentity.brand_name}
      />

      <main className="flex-1 space-y-4 pb-12">
        {/* Hero Banner Section */}
        <HeroBannerSection banner={settings.heroBanner} />

        {/* 4-Column Store USP Strip */}
        <StoreUSPSection items={settings.storeUSP} />

        {/* Popular Smartphones Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Popular Smartphones
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Discover the most loved devices by our customers.
              </p>
            </div>
            <Link
              href="/shop?filter=popular"
              prefetch={true}
              className="text-xs sm:text-sm font-bold text-[#0066FF] hover:text-[#0052cc] flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {popularPhones.map((phone) => (
              <ProductCard key={phone.id} product={phone} badgeType="best_seller" />
            ))}
          </div>
        </section>

        {/* Limited Time Offer Banner */}
        <PromoBannerSection banner={settings.promoBanner} />

        {/* Shop by Brand Section */}
        <BrandsSection brands={brands} />

        {/* Best Deals Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Best Deals
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Top offers. Limited time only.
              </p>
            </div>
            <Link
              href="/shop?filter=deals"
              prefetch={true}
              className="text-xs sm:text-sm font-bold text-[#0066FF] hover:text-[#0052cc] flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestDealPhones.map((phone) => (
              <ProductCard key={phone.id} product={phone} badgeType="discount" />
            ))}
          </div>
        </section>

        {/* Stay Connected Banner */}
        <NewsletterSection
          banner={settings.newsletterBanner}
          brandIdentity={settings.brandIdentity}
        />
      </main>

      {/* Footer */}
      <Footer
        footerInfo={settings.footerInfo}
        brandIdentity={settings.brandIdentity}
      />
    </div>
  );
}

