'use client';

import React, { useState } from 'react';
import { Order } from '@/types';
import { formatRupiah, formatDateIndo } from '@/lib/utils';
import { ShoppingBag, Download, Check, Clock, Truck, CheckCircle2 } from 'lucide-react';

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1',
    order_number: 'JC-20261123-0001',
    order_channel: 'offline_pos',
    customer_name: 'Walk-in Customer (Dimas)',
    customer_phone: '0812-9876-5432',
    shipping_address: 'Konter Fisik Jaya Cell',
    city: 'Jakarta Pusat',
    postal_code: '10310',
    payment_method: 'QRIS Kasir',
    trade_in_info: null,
    trade_in_discount: 0,
    total_amount: 23999000,
    status: 'delivered',
    tracking_logs: [
      {
        status: 'delivered',
        timestamp: new Date().toISOString(),
        description: 'Unit diserahkan di konter POS',
      },
    ],
    created_at: new Date().toISOString(),
    items: [
      {
        id: 'i1',
        order_id: 'ord-1',
        product_id: 'p1',
        variant_id: 'v2',
        product_name: 'iPhone 16 Pro',
        variant_snapshot: 'Desert Titanium / 256GB',
        quantity: 1,
        price_at_purchase: 23999000,
      },
    ],
  },
  {
    id: 'ord-2',
    order_number: 'JC-20261123-0002',
    order_channel: 'online_web',
    customer_name: 'Sarah Ahmed',
    customer_phone: '0813-8888-9999',
    shipping_address: 'Jl. Senopati No. 18',
    city: 'Jakarta Selatan',
    postal_code: '12190',
    payment_method: 'Transfer Bank VA',
    trade_in_info: null,
    trade_in_discount: 0,
    total_amount: 20999000,
    status: 'processing',
    tracking_logs: [
      {
        status: 'placed',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        description: 'Pesanan dibuat di website',
      },
      {
        status: 'processing',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        description: 'Sedang disiapkan & proses segel QC',
      },
    ],
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'ord-3',
    order_number: 'JC-20261122-0008',
    order_channel: 'online_web',
    customer_name: 'Budi Santoso',
    customer_phone: '0857-1111-2222',
    shipping_address: 'Jl. Dago Asri No. 4',
    city: 'Bandung',
    postal_code: '40135',
    payment_method: 'QRIS Instan',
    trade_in_info: null,
    trade_in_discount: 0,
    total_amount: 13999000,
    status: 'shipped',
    tracking_logs: [
      {
        status: 'shipped',
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        description: 'Diserahkan ke kurir JNE Express (Resi: JNE88990011)',
      },
    ],
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const handleUpdateStatus = (
    orderId: string,
    newStatus: 'placed' | 'processing' | 'shipped' | 'delivered'
  ) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const newLog = {
          status: newStatus,
          timestamp: new Date().toISOString(),
          description: `Status diubah menjadi '${newStatus}' oleh admin`,
        };
        return {
          ...ord,
          status: newStatus,
          tracking_logs: [...(ord.tracking_logs || []), newLog],
        };
      })
    );
  };

  const handleExportCSV = () => {
    const headers = ['Order Number', 'Channel', 'Customer', 'Phone', 'Total', 'Status', 'Date'];
    const rows = orders.map((o) => [
      o.order_number,
      o.order_channel,
      o.customer_name,
      o.customer_phone,
      o.total_amount,
      o.status,
      o.created_at,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap-pesanan-jayacell-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pesanan Masuk & Pengiriman
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pantau pesanan web & kasir POS, perbarui status kirim, dan export rekap transaksi.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition"
        >
          <Download className="w-4 h-4" />
          <span>Export Rekap CSV</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5 pl-5">No. Pesanan</th>
                <th className="p-3.5">Channel</th>
                <th className="p-3.5">Penerima & Alamat</th>
                <th className="p-3.5">Metode Bayar</th>
                <th className="p-3.5">Total Bayar</th>
                <th className="p-3.5">Update Status</th>
                <th className="p-3.5 pr-5">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {orders.map((ord) => (
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
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{ord.customer_name}</div>
                    <div className="text-[11px] text-slate-400">
                      {ord.customer_phone} • {ord.city || 'Toko'}
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-600">{ord.payment_method}</td>
                  <td className="p-3.5 font-extrabold text-slate-900">
                    {formatRupiah(ord.total_amount)}
                  </td>
                  <td className="p-3.5">
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateStatus(ord.id, e.target.value as any)}
                      className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none ${
                        ord.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : ord.status === 'shipped'
                          ? 'bg-blue-50 text-[#0066FF] border-blue-300'
                          : ord.status === 'processing'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-slate-50 text-slate-700 border-slate-300'
                      }`}
                    >
                      <option value="placed">Placed (Baru)</option>
                      <option value="processing">Processing (Diproses)</option>
                      <option value="shipped">Shipped (Dikirim)</option>
                      <option value="delivered">Delivered (Selesai)</option>
                    </select>
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

