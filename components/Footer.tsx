import React from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { FooterInfo, BrandIdentity } from '@/types';
import { Phone, Mail, MapPin, Instagram, ShieldCheck, CreditCard, Clock } from 'lucide-react';

interface FooterProps {
  footerInfo?: FooterInfo;
  brandIdentity?: BrandIdentity;
}

export default function Footer({ footerInfo, brandIdentity }: FooterProps) {
  const brandName = brandIdentity?.brand_name || 'Jaya Cell';
  const phone = brandIdentity?.phone || '+62 812-3456-7890';
  const email = brandIdentity?.email || 'halo@jayacell.id';
  const address = brandIdentity?.address || 'Jl. Gajah Mada No. 88, Menteng, Jakarta Pusat';
  const about =
    footerInfo?.about ||
    'Jaya Cell adalah pusat ritel dan distributor smartphone resmi terpercaya. Melayani pembelian online se-Indonesia dan konter fisik dengan jaminan garansi resmi dan kemudahan tukar tambah.';
  const openingHours = footerInfo?.opening_hours || 'Senin - Minggu: 09:00 - 21:30 WIB';
  const copyright =
    footerInfo?.copyright || `© ${new Date().getFullYear()} Jaya Cell Smartphone Retail & POS. All Rights Reserved.`;

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Col 1: Brand & About */}
          <div className="space-y-4">
            <BrandLogo
              theme="dark"
              size="md"
              customLogoUrl={brandIdentity?.logo_url}
              brandName={brandName}
            />
            <p className="text-sm text-slate-400 leading-relaxed pr-4">{about}</p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://instagram.com/${brandIdentity?.instagram || 'jayacell.id'}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:bg-slate-700 transition"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:bg-slate-700 transition"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-tight">Navigasi Utama</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" prefetch={true} className="hover:text-white transition">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/shop" prefetch={true} className="hover:text-white transition">
                  Katalog Smartphone
                </Link>
              </li>
              <li>
                <Link href="/trade-in" prefetch={true} className="hover:text-white transition">
                  Kalkulator Tukar Tambah
                </Link>
              </li>
              <li>
                <Link href="/track" prefetch={true} className="hover:text-white transition">
                  Lacak Pesanan Pengiriman
                </Link>
              </li>
              <li>
                <Link href="/track" prefetch={true} className="hover:text-white transition">
                  Cek Garansi IMEI 15-Digit
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Brand Partner */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-tight">Kategori Brand</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/shop?brand=Apple" className="hover:text-white transition">
                  Apple iPhone & Aksesoris
                </Link>
              </li>
              <li>
                <Link href="/shop?brand=Samsung" className="hover:text-white transition">
                  Samsung Galaxy Series
                </Link>
              </li>
              <li>
                <Link href="/shop?brand=Google" className="hover:text-white transition">
                  Google Pixel AI
                </Link>
              </li>
              <li>
                <Link href="/shop?brand=OnePlus" className="hover:text-white transition">
                  OnePlus Flagship
                </Link>
              </li>
              <li>
                <Link href="/shop?brand=Xiaomi" className="hover:text-white transition">
                  Xiaomi & Redmi
                </Link>
              </li>
              <li>
                <Link href="/shop?brand=realme" className="hover:text-white transition">
                  realme Official
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Store Info & Jam Buka */}
          <div className="space-y-3.5">
            <h4 className="text-white font-bold text-base mb-4 tracking-tight">Hubungi Konter</h4>
            <div className="flex items-start gap-3 text-sm text-slate-400">
              <MapPin className="w-5 h-5 text-[#0066FF] flex-shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Phone className="w-4 h-4 text-[#0066FF] flex-shrink-0" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Mail className="w-4 h-4 text-[#0066FF] flex-shrink-0" />
              <span>{email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400 pt-1">
              <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>{openingHours}</span>
            </div>

            <div className="pt-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Pembayaran Resmi & Terverifikasi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{copyright}</p>
          <div className="flex items-center gap-6">
            <span>Garansi Resmi TAM, iBox, SEIN</span>
            <span>Zero-Delay POS System</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
