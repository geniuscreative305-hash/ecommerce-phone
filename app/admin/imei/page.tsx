'use client';

import React, { useState } from 'react';
import { IMEIWarranty } from '@/types';
import { ShieldCheck, Plus, Search, Check, AlertCircle } from 'lucide-react';

const INITIAL_WARRANTIES: IMEIWarranty[] = [
  {
    id: 'w1',
    imei_number: '358912345678901',
    order_number: 'JC-20261120-0001',
    customer_name: 'Ahmad Pratama',
    product_name: 'iPhone 16 Pro',
    variant_info: 'Titanium Black / 128GB',
    purchase_date: '2026-11-20',
    warranty_end_date: '2027-11-20',
    warranty_type: 'Garansi Resmi',
    status: 'active',
  },
  {
    id: 'w2',
    imei_number: '357892345678902',
    order_number: 'JC-20261121-0002',
    customer_name: 'Budi Santoso',
    product_name: 'Samsung Galaxy S24',
    variant_info: 'Onyx Black / 256GB',
    purchase_date: '2026-11-21',
    warranty_end_date: '2027-11-21',
    warranty_type: 'Garansi Resmi',
    status: 'active',
  },
  {
    id: 'w3',
    imei_number: '356782345678903',
    order_number: 'JC-20251015-0005',
    customer_name: 'Citra Dewi',
    product_name: 'iPhone 15',
    variant_info: 'Pink / 256GB',
    purchase_date: '2025-10-15',
    warranty_end_date: '2026-10-15',
    warranty_type: 'Garansi Toko Jaya Cell',
    status: 'expired',
  },
];

export default function AdminIMEIPage() {
  const [warranties, setWarranties] = useState<IMEIWarranty[]>(INITIAL_WARRANTIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New warranty form
  const [imei, setImei] = useState('');
  const [customer, setCustomer] = useState('');
  const [productName, setProductName] = useState('iPhone 16 Pro');
  const [variantInfo, setVariantInfo] = useState('Titanium Black / 128GB');
  const [warrantyType, setWarrantyType] = useState<'Garansi Resmi' | 'Garansi Toko Jaya Cell'>('Garansi Resmi');
  const [warrantyYears, setWarrantyYears] = useState(1);

  const filtered = warranties.filter(
    (w) =>
      w.imei_number.includes(searchQuery) ||
      w.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateWarranty = (e: React.FormEvent) => {
    e.preventDefault();
    const purchaseDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(purchaseDate.getFullYear() + Number(warrantyYears));

    const newRecord: IMEIWarranty = {
      id: `w-${Date.now()}`,
      imei_number: imei,
      order_number: `JC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-MANUAL`,
      customer_name: customer,
      product_name: productName,
      variant_info: variantInfo,
      purchase_date: purchaseDate.toISOString().split('T')[0],
      warranty_end_date: endDate.toISOString().split('T')[0],
      warranty_type: warrantyType,
      status: 'active',
    };

    setWarranties([newRecord, ...warranties]);
    setIsModalOpen(false);
    setImei('');
    setCustomer('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Data IMEI & Garansi Digital
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Daftar nomor IMEI smartphone yang terjual dan masa aktif garansi resminya.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0066FF] hover:bg-[#0052cc] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Terbitkan Garansi IMEI Manual</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 flex items-center gap-2 max-w-md">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari no IMEI 15 digit / nama pelanggan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs bg-transparent focus:outline-none font-semibold text-slate-800"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5 pl-5">Nomor IMEI</th>
                <th className="p-3.5">Smartphone & Varian</th>
                <th className="p-3.5">Pelanggan</th>
                <th className="p-3.5">Tipe Garansi</th>
                <th className="p-3.5">Tgl Beli</th>
                <th className="p-3.5">Garansi Berakhir</th>
                <th className="p-3.5 pr-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((w) => (
                <tr key={w.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3.5 pl-5 font-mono font-bold text-slate-900 tracking-wider">
                    {w.imei_number}
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{w.product_name}</div>
                    <div className="text-[11px] text-slate-400">{w.variant_info}</div>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-800">{w.customer_name}</td>
                  <td className="p-3.5 text-[#0066FF] font-semibold">{w.warranty_type}</td>
                  <td className="p-3.5 text-slate-500">{w.purchase_date}</td>
                  <td className="p-3.5 font-bold text-slate-900">{w.warranty_end_date}</td>
                  <td className="p-3.5 pr-5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        w.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 p-4 flex items-center justify-center">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 z-10 text-xs">
            <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-2">
              Terbitkan Garansi IMEI
            </h2>
            <form onSubmit={handleCreateWarranty} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nomor IMEI (15 Digit) *</label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  value={imei}
                  onChange={(e) => setImei(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                  placeholder="358912345678901"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Pemilik *</label>
                <input
                  type="text"
                  required
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tipe Smartphone</label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Varian & Warna</label>
                <input
                  type="text"
                  required
                  value={variantInfo}
                  onChange={(e) => setVariantInfo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Durasi Garansi</label>
                <select
                  value={warrantyYears}
                  onChange={(e) => setWarrantyYears(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                >
                  <option value={1}>1 Tahun (Standar)</option>
                  <option value={2}>2 Tahun (Extended)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold rounded-xl shadow-md"
                >
                  Simpan & Terbitkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

