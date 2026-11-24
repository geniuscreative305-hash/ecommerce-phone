'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getAdminPath } from '@/lib/admin-path';
import { ShieldAlert, AlertTriangle, X, ArrowRight } from 'lucide-react';

interface AlertBannersProps {
  failedLoginsCount: number;
  outOfStockItems: Array<{ id: string; name: string; variant: string }>;
}

export default function DashboardAlertBanners({
  failedLoginsCount,
  outOfStockItems,
}: AlertBannersProps) {
  const [showSecurityAlert, setShowSecurityAlert] = useState(failedLoginsCount > 0);
  const [showStockAlert, setShowStockAlert] = useState(outOfStockItems.length > 0);

  return (
    <div className="space-y-3">
      {/* 1. Security Alert: Failed Login Spikes (Last 24h) */}
      {showSecurityAlert && failedLoginsCount > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-sm flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-100 rounded-lg text-red-600 flex-shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="font-extrabold text-red-900 text-sm flex items-center gap-2">
                <span>Peringatan Keamanan Sistem</span>
                <span className="px-2 py-0.5 rounded-full bg-red-200 text-red-800 text-[10px] font-bold">
                  {failedLoginsCount} Percobaan Gagal (24 Jam)
                </span>
              </div>
              <p className="text-red-700 leading-relaxed">
                Terdeteksi aktivitas login admin gagal atau lonjakan brute force pada sistem. Seluruh percobaan telah dicegat oleh Rate Limiter.
              </p>
              <div className="pt-1">
                <Link
                  href={getAdminPath('/audit-logs')}
                  className="font-bold text-red-800 hover:text-red-900 underline inline-flex items-center gap-1"
                >
                  <span>Tinjau Riwayat Audit Log & IP Penyerang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowSecurityAlert(false)}
            className="text-red-400 hover:text-red-700 p-1 rounded-lg transition"
            title="Tutup Peringatan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Inventory Alert: Stock Hit 0 (Out of Stock) */}
      {showStockAlert && outOfStockItems.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl shadow-sm flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600 flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="font-extrabold text-amber-900 text-sm flex items-center gap-2">
                <span>Peringatan Stok Habis (Out of Stock)</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">
                  {outOfStockItems.length} Varian Kosong
                </span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                Terdapat unit varian smartphone yang stok fisiknya telah mencapai 0 unit akibat transaksi kasir POS atau pesanan online.
              </p>
              <div className="pt-1">
                <Link
                  href={getAdminPath('/products')}
                  className="font-bold text-amber-900 hover:text-amber-950 underline inline-flex items-center gap-1"
                >
                  <span>Buka Kelola Produk & Tambah Stok Masuk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowStockAlert(false)}
            className="text-amber-400 hover:text-amber-700 p-1 rounded-lg transition"
            title="Tutup Peringatan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

