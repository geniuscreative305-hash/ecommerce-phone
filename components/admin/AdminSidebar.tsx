'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getAdminPath } from '@/lib/admin-path';
import {
  LayoutDashboard,
  Store,
  Smartphone,
  ShoppingBag,
  ShieldCheck,
  ArrowUpDown,
  Settings,
  FileText,
} from 'lucide-react';

interface AdminSidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function AdminSidebar({ mobileOpen, setMobileOpen }: AdminSidebarProps) {
  const pathname = usePathname();

  const MENU_ITEMS = [
    { href: getAdminPath(), subpath: '', label: 'Dashboard KPI', icon: LayoutDashboard },
    { href: getAdminPath('/pos'), subpath: '/pos', label: 'Kasir / POS Konter', icon: Store, badge: 'POS' },
    { href: getAdminPath('/products'), subpath: '/products', label: 'Produk & Varian', icon: Smartphone },
    { href: getAdminPath('/orders'), subpath: '/orders', label: 'Pesanan Masuk', icon: ShoppingBag },
    { href: getAdminPath('/imei'), subpath: '/imei', label: 'Data IMEI & Garansi', icon: ShieldCheck },
    { href: getAdminPath('/trade-in'), subpath: '/trade-in', label: 'Aturan Tukar Tambah', icon: ArrowUpDown },
    { href: getAdminPath('/cms'), subpath: '/cms', label: 'Tampilan & Konten (CMS)', icon: Settings },
    { href: getAdminPath('/audit-logs'), subpath: '/audit-logs', label: 'Audit Log & Backup', icon: FileText, badge: 'SEC' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-12 left-0 h-[calc(100vh-3rem)] w-60 bg-[#2C3338] text-slate-300 z-40 transition-transform duration-200 ease-in-out md:translate-x-0 overflow-y-auto ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 pt-4">
          Menu Navigasi
        </div>

        <nav className="p-2 space-y-1">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.subpath === ''
                ? pathname === item.href || pathname === '/admin'
                : pathname.includes(item.subpath);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-[#0066FF] text-white shadow-sm'
                    : 'text-slate-300 hover:bg-[#32373C] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-white/20 text-white' : item.badge === 'SEC' ? 'bg-indigo-500 text-white' : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick System Info Bottom Box */}
        <div className="p-4 mt-6 border-t border-slate-700/60 text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-slate-300">Jaya Cell Enterprise v2.0</div>
          <div>Next.js 14 + Hardened Supabase</div>
          <div className="text-emerald-400">● 3-Gate Protection Active</div>
        </div>
      </aside>
    </>
  );
}
