'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { useCart } from '@/context/CartContext';
import { Search, ShoppingBag, Heart, Menu, X, ArrowUpDown, ShieldCheck } from 'lucide-react';
import SearchModal from './SearchModal';

interface NavbarProps {
  customLogoUrl?: string | null;
  brandName?: string;
}

export default function Navbar({ customLogoUrl, brandName = 'Jaya Cell' }: NavbarProps) {
  const { setIsOpen, totalQuantity } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 md:h-20 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" prefetch={true} className="flex-shrink-0">
              <BrandLogo customLogoUrl={customLogoUrl} brandName={brandName} size="md" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-700">
              <Link
                href="/"
                prefetch={true}
                className="hover:text-[#0066FF] transition-colors py-1"
              >
                Beranda
              </Link>
              <Link
                href="/shop"
                prefetch={true}
                className="hover:text-[#0066FF] transition-colors py-1"
              >
                Katalog HP
              </Link>
              <Link
                href="/trade-in"
                prefetch={true}
                className="flex items-center gap-1.5 hover:text-[#0066FF] transition-colors py-1"
              >
                <ArrowUpDown className="w-4 h-4 text-[#0066FF]" />
                Tukar Tambah
              </Link>
              <Link
                href="/track"
                prefetch={true}
                className="flex items-center gap-1.5 hover:text-[#0066FF] transition-colors py-1"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Lacak & Garansi IMEI
              </Link>
            </nav>

            {/* Search, Wishlist & Cart Action */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition"
                aria-label="Pencarian"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/shop?filter=popular"
                className="p-2.5 text-slate-600 hover:text-red-500 hover:bg-slate-100 rounded-full transition relative hidden sm:flex"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </Link>

              {/* Cart Slide-Over Trigger */}
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 p-2 sm:px-3.5 sm:py-2 bg-blue-50 text-[#0066FF] hover:bg-blue-100 rounded-full font-bold text-sm transition"
                aria-label="Buka Keranjang"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {totalQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#0066FF] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                      {totalQuantity}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-bold">Keranjang</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-5 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-slate-800 hover:text-[#0066FF]"
            >
              Beranda
            </Link>
            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-slate-800 hover:text-[#0066FF]"
            >
              Katalog HP Lengkap
            </Link>
            <Link
              href="/trade-in"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-slate-800 hover:text-[#0066FF]"
            >
              Kalkulator Tukar Tambah
            </Link>
            <Link
              href="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-slate-800 hover:text-[#0066FF]"
            >
              Lacak Pesanan & Cek Garansi IMEI
            </Link>
            <div className="pt-2 border-t border-slate-100">
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-slate-500 hover:text-slate-800"
              >
                Login Admin & Kasir POS
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
