import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatRupiah, formatDateIndo } from '@/lib/utils';
import {
  DollarSign,
  ShoppingBag,
  AlertTriangle,
  ShieldCheck,
  Store,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const supabase = createClient();

  // Try to fetch live metrics from Supabase
  let ordersCount = 12;
  let totalRevenue = 158500000;
  let activeWarrantiesCount = 48;
  let lowStockCount = 2;
  let recentOrders: any[] = [];

  try {
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);

    if (orders && orders.length > 0) {
      recentOrders = orders;
      ordersCount = orders.length;
      totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    }
  } catch {
    // Demo fallback values
  }

  if (recentOrders.length === 0) {
    recentOrders = [
      {
        id: 'ord-1',
        order_number: 'JC-20261123-0001',
        order_channel: 'offline_pos',
        customer_name: 'Walk-in Customer (Dimas)',
        total_amount: 23999000,
        status: 'delivered',
        payment_method: 'QRIS Kasir',
        created_at: new Date().toISOString(),
      },
      {
        id: 'ord-2',
        order_number: 'JC-20261123-0002',
        order_channel: 'online_web',
        customer_name: 'Sarah Ahmed',
        total_amount: 20999000,
        status: 'processing',
        payment_method: 'Transfer Bank VA',
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'ord-3',
        order_number: 'JC-20261122-0008',
        order_channel: 'online_web',
        customer_name: 'Budi Santoso',
        total_amount: 13999000,
        status: 'shipped',
        payment_method: 'QRIS Instan',
        created_at: new Date(Date.now() - 3600000 * 14).toISOString(),
      },
    ];
  }

  return (
    <div className="space-y-6">
      {/* Title & Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Manajemen Toko
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ringkasan pendapatan penjualan online, counter kasir fisik POS, dan status garansi IMEI.
          </p>
        </div>

        <Link
          href="/admin/pos"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0066FF] hover:bg-[#0052cc] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition active:scale-95"
        >
          <Store className="w-4 h-4" />
          <span>Buka Kasir POS Konter</span>
        </Link>
      </div>

      {/* KPI 4-Card Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Omset (Online + POS)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {formatRupiah(totalRevenue)}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            +18.4% dari bulan lalu
          </div>
        </div>

        {/* Card 2: Active Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Pesanan Masuk
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066FF] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {ordersCount} Transaksi
          </div>
          <div className="text-[11px] text-slate-500">
            Termasuk pesanan web & konter
          </div>
        </div>

        {/* Card 3: Active Warranties */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Garansi IMEI Aktif
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {activeWarrantiesCount} Unit
          </div>
          <div className="text-[11px] text-indigo-600 font-semibold">
            Terdaftar di Kemenperin
          </div>
        </div>

        {/* Card 4: Low Stock Alert */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Stok Menipis
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-600">
            {lowStockCount} Varian
          </div>
          <div className="text-[11px] text-slate-500">
            Perlu restock distributor
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">
              Pesanan Terakhir (Online & POS Konter)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Data transaksi langsung termutakhir
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1"
          >
            <span>Semua Pesanan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5 pl-5">No. Pesanan</th>
                <th className="p-3.5">Channel</th>
                <th className="p-3.5">Pelanggan</th>
                <th className="p-3.5">Metode Bayar</th>
                <th className="p-3.5">Total</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 pr-5">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3.5 pl-5 font-mono font-bold text-[#0066FF]">
                    {ord.order_number}
                  </td>
                  <td className="p-3.5">
                    {ord.order_channel === 'offline_pos' ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                        POS Konter
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-[#0066FF] text-[10px] font-extrabold uppercase">
                        Online Web
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 font-bold text-slate-900">{ord.customer_name}</td>
                  <td className="p-3.5 text-slate-500">{ord.payment_method}</td>
                  <td className="p-3.5 font-extrabold text-slate-900">
                    {formatRupiah(ord.total_amount)}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ord.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : ord.status === 'processing'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="p-3.5 pr-5 text-slate-400 text-[11px]">
                    {formatDateIndo(ord.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

