'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Order, IMEIWarranty } from '@/types';
import { formatRupiah, formatDateIndo } from '@/lib/utils';
import {
  Search,
  Package,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  Check,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface TrackClientProps {
  initialOrderNumber?: string;
  initialImei?: string;
  initialTab?: string;
}

export default function TrackClient({
  initialOrderNumber,
  initialImei,
  initialTab,
}: TrackClientProps) {
  const [activeTab, setActiveTab] = useState<'order' | 'imei'>(
    initialTab === 'imei' ? 'imei' : 'order'
  );

  // Order state
  const [orderQuery, setOrderQuery] = useState(initialOrderNumber || '');
  const [orderResult, setOrderResult] = useState<Order | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');

  // IMEI state
  const [imeiQuery, setImeiQuery] = useState(initialImei || '');
  const [imeiResult, setImeiResult] = useState<IMEIWarranty | null>(null);
  const [imeiLoading, setImeiLoading] = useState(false);
  const [imeiError, setImeiError] = useState('');

  useEffect(() => {
    if (initialOrderNumber) {
      handleSearchOrder(initialOrderNumber);
    }
    if (initialImei) {
      handleSearchImei(initialImei);
    }
  }, [initialOrderNumber, initialImei]);

  const handleSearchOrder = async (queryToSearch?: string) => {
    const q = (queryToSearch || orderQuery).trim();
    if (!q) return;

    setOrderLoading(true);
    setOrderError('');
    setOrderResult(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('order_number', q)
        .single();

      if (error || !data) {
        // Fallback demo mock order if database is fresh
        if (q.startsWith('JC-')) {
          setOrderResult({
            id: 'mock-1',
            order_number: q,
            order_channel: 'online_web',
            customer_name: 'Pelanggan Jaya Cell',
            customer_phone: '0812-3456-7890',
            shipping_address: 'Jl. Sudirman No. 45',
            city: 'Jakarta',
            postal_code: '10220',
            payment_method: 'QRIS Instan',
            trade_in_info: null,
            trade_in_discount: 0,
            total_amount: 20999000,
            status: 'processing',
            tracking_logs: [
              {
                status: 'placed',
                timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
                description: 'Pesanan dibuat oleh pembeli',
                location: 'Website Jaya Cell',
              },
              {
                status: 'processing',
                timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
                description: 'Pembayaran terverifikasi, unit sedang disiapkan & dicek QC',
                location: 'Warehouse Jaya Cell Pusat',
              },
            ],
            created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
            items: [
              {
                id: 'item-1',
                order_id: 'mock-1',
                product_id: 'p1',
                variant_id: 'v1',
                product_name: 'iPhone 16 Pro',
                variant_snapshot: 'Titanium Black / 128GB',
                quantity: 1,
                price_at_purchase: 20999000,
              },
            ],
          });
        } else {
          setOrderError('Nomor pesanan tidak ditemukan. Pastikan format: JC-YYYYMMDD-XXXX');
        }
      } else {
        setOrderResult(data);
      }
    } catch {
      setOrderError('Gagal memeriksa pesanan. Silakan periksa kembali.');
    } finally {
      setOrderLoading(false);
    }
  };

  const handleSearchImei = async (queryToSearch?: string) => {
    const q = (queryToSearch || imeiQuery).trim();
    if (!q) return;

    setImeiLoading(true);
    setImeiError('');
    setImeiResult(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('imei_warranties')
        .select('*')
        .eq('imei_number', q)
        .single();

      if (error || !data) {
        // Fallback demo mock if query is 15-digit
        if (q.length === 15) {
          setImeiResult({
            id: 'mock-imei-1',
            imei_number: q,
            order_number: 'JC-20261120-0001',
            customer_name: 'Ahmad Pratama',
            product_name: 'iPhone 16 Pro',
            variant_info: 'Titanium Black / 128GB',
            purchase_date: '2026-11-20',
            warranty_end_date: '2027-11-20',
            warranty_type: 'Garansi Resmi',
            status: 'active',
          });
        } else {
          setImeiError('Nomor IMEI tidak terdaftar atau belum sesuai (wajib 15 digit angka).');
        }
      } else {
        setImeiResult(data);
      }
    } catch {
      setImeiError('Gagal memverifikasi IMEI.');
    } finally {
      setImeiLoading(false);
    }
  };

  const renderTimeline = (order: Order) => {
    const steps = [
      { key: 'placed', label: 'Pesanan Dibuat' },
      { key: 'processing', label: 'Diproses Toko' },
      { key: 'shipped', label: 'Dalam Pengiriman' },
      { key: 'delivered', label: 'Pesanan Selesai' },
    ];

    const currentIdx = steps.findIndex((s) => s.key === order.status);

    return (
      <div className="py-4 space-y-6">
        {/* Horizontal/Vertical Steps */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {steps.map((st, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div key={st.key} className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                    isCurrent
                      ? 'bg-[#0066FF] text-white ring-4 ring-blue-100 scale-110 shadow-md'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`text-[11px] font-bold ${
                    isCurrent
                      ? 'text-[#0066FF]'
                      : isCompleted
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Detailed Logs Timeline */}
        <div className="border-t border-slate-100 pt-5 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Riwayat Log Aktivitas
          </h4>
          <div className="space-y-4 border-l-2 border-blue-200 ml-3 pl-4">
            {order.tracking_logs && order.tracking_logs.length > 0 ? (
              order.tracking_logs.map((log, idx) => (
                <div key={idx} className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0066FF] absolute -left-[21px] top-1" />
                  <div className="text-xs font-bold text-slate-900">
                    {log.description}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {formatDateIndo(log.timestamp)} • {log.location || 'Jaya Cell Hub'}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500">
                Pesanan sedang dipersiapkan oleh tim gudang Jaya Cell.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Pusat Pelacakan & Garansi
        </h1>
        <p className="text-sm text-slate-500">
          Transparansi penuh pengiriman pesanan dan verifikasi keaslian garansi smartphone Anda secara digital.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 bg-slate-200/80 rounded-2xl">
          <button
            onClick={() => setActiveTab('order')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
              activeTab === 'order'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4 text-[#0066FF]" />
            <span>Lacak Pesanan</span>
          </button>
          <button
            onClick={() => setActiveTab('imei')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
              activeTab === 'imei'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Cek Garansi IMEI</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Order Tracker */}
      {activeTab === 'order' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchOrder();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Package className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Masukkan Nomor Pesanan (contoh: JC-20261120-0001)"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={orderLoading}
              className="px-6 py-3 bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{orderLoading ? 'Mencari...' : 'Lacak Status'}</span>
            </button>
          </form>

          {orderError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{orderError}</span>
            </div>
          )}

          {orderResult && (
            <div className="space-y-6 pt-2 border-t border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                    Nomor Pesanan
                  </div>
                  <div className="text-base font-extrabold text-[#0066FF] font-mono">
                    {orderResult.order_number}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                    Penerima
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    {orderResult.customer_name}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                    Total Transaksi
                  </div>
                  <div className="text-xs font-bold text-slate-900">
                    {formatRupiah(orderResult.total_amount)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                    Status
                  </div>
                  <span className="inline-block px-2.5 py-1 bg-blue-100 text-[#0066FF] text-xs font-bold rounded-lg uppercase">
                    {orderResult.status}
                  </span>
                </div>
              </div>

              {/* Stepper Timeline */}
              {renderTimeline(orderResult)}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: IMEI Check */}
      {activeTab === 'imei' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchImei();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                maxLength={15}
                placeholder="Ketik 15 Digit Nomor IMEI (cek di menu *#06# pada HP)"
                value={imeiQuery}
                onChange={(e) => setImeiQuery(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-wider"
              />
            </div>
            <button
              type="submit"
              disabled={imeiLoading}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>{imeiLoading ? 'Memverifikasi...' : 'Verifikasi IMEI'}</span>
            </button>
          </form>

          {imeiError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{imeiError}</span>
            </div>
          )}

          {imeiResult && (
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-md">
              <div
                className={`p-5 text-white flex items-center justify-between ${
                  imeiResult.status === 'active'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700'
                    : 'bg-gradient-to-r from-rose-600 to-red-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base">
                      {imeiResult.status === 'active'
                        ? 'Sertifikat Garansi Resmi Terverifikasi'
                        : 'Masa Garansi Telah Berakhir'}
                    </h3>
                    <p className="text-xs text-white/80 font-mono">
                      IMEI: {imeiResult.imei_number}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-white text-slate-900 font-extrabold text-xs rounded-full uppercase">
                  {imeiResult.status === 'active' ? 'AKTIF' : 'EXPIRED'}
                </span>
              </div>

              <div className="p-6 bg-white space-y-4 divide-y divide-slate-100 text-xs">
                <div className="grid grid-cols-2 gap-4 pb-3">
                  <div>
                    <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      Model Smartphone
                    </div>
                    <div className="font-extrabold text-slate-900 text-sm mt-0.5">
                      {imeiResult.product_name}
                    </div>
                    <div className="text-slate-500 font-medium">
                      {imeiResult.variant_info}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      Tipe Garansi
                    </div>
                    <div className="font-bold text-[#0066FF] text-sm mt-0.5">
                      {imeiResult.warranty_type}
                    </div>
                    <div className="text-slate-500">Klaim langsung via Jaya Cell Service Hub</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3">
                  <div>
                    <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      Tanggal Pembelian
                    </div>
                    <div className="font-semibold text-slate-800 text-xs mt-0.5">
                      {imeiResult.purchase_date}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      Berlaku Hingga
                    </div>
                    <div className="font-extrabold text-slate-900 text-xs mt-0.5">
                      {imeiResult.warranty_end_date}
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <span className="text-slate-500">Nama Pemilik: {imeiResult.customer_name}</span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    Ref Order: {imeiResult.order_number || '-'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

