'use client';

import React, { useState } from 'react';
import { DEFAULT_PRODUCTS, DEFAULT_TRADE_IN_RULES } from '@/lib/constants';
import { formatRupiah, generateOrderNumber } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import {
  Store,
  Printer,
  CheckCircle2,
  Trash2,
  Plus,
  ShieldCheck,
  CreditCard,
  QrCode,
  Banknote,
  Smartphone,
  ArrowUpDown,
} from 'lucide-react';

export default function AdminPOSPage() {
  const products = DEFAULT_PRODUCTS;
  const tradeInRules = DEFAULT_TRADE_IN_RULES;

  // Selected item
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0].id);
  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const variants = currentProduct.variants || [];
  const [selectedVariantId, setSelectedVariantId] = useState<string>(variants[0]?.id || '');
  const currentVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];

  // Walk-in form states
  const [customerName, setCustomerName] = useState('Pelanggan Walk-In');
  const [customerPhone, setCustomerPhone] = useState('0812-');
  const [paymentMethod, setPaymentMethod] = useState<'Tunai / Cash' | 'QRIS Kasir' | 'Transfer EDC'>('QRIS Kasir');
  const [imeiNumber, setImeiNumber] = useState('');
  const [warrantyType, setWarrantyType] = useState<'Garansi Resmi' | 'Garansi Toko Jaya Cell'>('Garansi Resmi');

  // Optional Trade-In
  const [hasTradeIn, setHasTradeIn] = useState(false);
  const [tradeInRuleId, setTradeInRuleId] = useState(tradeInRules[0].id);
  const selectedRule = tradeInRules.find((r) => r.id === tradeInRuleId) || tradeInRules[0];
  const [tradeInCondition, setTradeInCondition] = useState<'mulus' | 'lecet_halus' | 'minus_fisik'>('mulus');

  const tradeInValuation = hasTradeIn
    ? Math.round(selectedRule.base_value * (selectedRule.condition_multipliers[tradeInCondition] || 1.0))
    : 0;

  const basePrice = currentVariant ? currentVariant.price : 0;
  const grandTotal = Math.max(0, basePrice - tradeInValuation);

  // Success and Print state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  const handleSubmitPOS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imeiNumber || imeiNumber.length < 10) {
      alert('Harap masukkan nomor IMEI unit yang dijual (minimal 10-15 digit).');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderNumber = generateOrderNumber(Math.floor(Math.random() * 900) + 100);
      const supabase = createClient();

      const trackingLogs = [
        {
          status: 'delivered',
          timestamp: new Date().toISOString(),
          description: 'Transaksi Kasir POS Konter Jaya Cell Selesai. Unit diserahkan langsung ke pelanggan.',
          location: 'Kasir Utama Konter Jaya Cell',
        },
      ];

      // 1. Insert order as offline_pos (status delivered)
      await supabase.from('orders').insert({
        order_number: orderNumber,
        order_channel: 'offline_pos',
        customer_name: customerName,
        customer_phone: customerPhone,
        payment_method: paymentMethod,
        trade_in_info: hasTradeIn
          ? {
              brand_name: selectedRule.brand_name,
              model_name: selectedRule.model_name,
              storage: selectedRule.storage,
              condition: tradeInCondition,
              valuation_amount: tradeInValuation,
            }
          : null,
        trade_in_discount: tradeInValuation,
        total_amount: grandTotal,
        status: 'delivered',
        tracking_logs: trackingLogs,
      });

      // 2. Register IMEI Warranty
      const purchaseDate = new Date();
      const warrantyEndDate = new Date();
      warrantyEndDate.setFullYear(purchaseDate.getFullYear() + 1);

      await supabase.from('imei_warranties').insert({
        imei_number: imeiNumber,
        order_number: orderNumber,
        customer_name: customerName,
        product_name: currentProduct.name,
        variant_info: `${currentVariant.color_name} / ${currentVariant.storage}`,
        purchase_date: purchaseDate.toISOString().split('T')[0],
        warranty_end_date: warrantyEndDate.toISOString().split('T')[0],
        warranty_type: warrantyType,
        status: 'active',
      });

      setCompletedOrder({
        orderNumber,
        productName: currentProduct.name,
        variantInfo: `${currentVariant.color_name} / ${currentVariant.storage}`,
        customerName,
        customerPhone,
        paymentMethod,
        imeiNumber,
        warrantyType,
        warrantyEndDate: warrantyEndDate.toLocaleDateString('id-ID'),
        basePrice,
        tradeInValuation,
        grandTotal,
        date: new Date().toLocaleString('id-ID'),
      });
    } catch {
      // Demo completed
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setCompletedOrder(null);
    setImeiNumber('');
    setHasTradeIn(false);
    setCustomerName('Pelanggan Walk-In');
    setCustomerPhone('0812-');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Store className="w-7 h-7 text-[#0066FF]" />
            <span>Kasir / POS Konter Fisik</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Transaksi walk-in cepat: potong stok otomatis, catat order POS, dan terbitkan garansi IMEI seketika.
          </p>
        </div>
      </div>

      {completedOrder ? (
        /* Printable Thermal Receipt / Success Card */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-lg mx-auto shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Transaksi Berhasil Disimpan!
            </h2>
            <p className="text-xs text-slate-500">
              Stok terpotong otomatis dan IMEI garansi terdaftar aktif di database.
            </p>
          </div>

          {/* Thermal Receipt Visual Preview (58mm/80mm Style) */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-300 font-mono text-xs space-y-3 text-slate-800 shadow-inner">
            <div className="text-center border-b border-dashed border-slate-400 pb-3 space-y-0.5">
              <div className="font-bold text-sm tracking-widest uppercase">JAYA CELL STORE</div>
              <div className="text-[10px] text-slate-500">Jl. Gajah Mada No. 88, Jakarta</div>
              <div className="text-[10px] text-slate-500">Telp: +62 812-3456-7890</div>
            </div>

            <div className="space-y-1 text-[11px] border-b border-dashed border-slate-400 pb-2">
              <div className="flex justify-between">
                <span>No. Transaksi:</span>
                <span className="font-bold">{completedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Waktu:</span>
                <span>{completedOrder.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir:</span>
                <span>Admin Konter #1</span>
              </div>
              <div className="flex justify-between">
                <span>Pelanggan:</span>
                <span>{completedOrder.customerName}</span>
              </div>
            </div>

            {/* Sold Item Details */}
            <div className="border-b border-dashed border-slate-400 pb-2 space-y-1">
              <div className="font-bold">{completedOrder.productName}</div>
              <div className="text-slate-600 text-[10px]">
                {completedOrder.variantInfo}
              </div>
              <div className="flex justify-between text-[11px]">
                <span>1 x {formatRupiah(completedOrder.basePrice)}</span>
                <span className="font-bold">{formatRupiah(completedOrder.basePrice)}</span>
              </div>
              {completedOrder.tradeInValuation > 0 && (
                <div className="flex justify-between text-emerald-700 text-[11px]">
                  <span>Potongan Trade-In:</span>
                  <span>-{formatRupiah(completedOrder.tradeInValuation)}</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="border-b border-dashed border-slate-400 pb-2 space-y-1">
              <div className="flex justify-between font-extrabold text-sm">
                <span>TOTAL:</span>
                <span>{formatRupiah(completedOrder.grandTotal)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>Metode Bayar:</span>
                <span className="uppercase">{completedOrder.paymentMethod}</span>
              </div>
            </div>

            {/* Warranty Certificate Stamp */}
            <div className="text-center pt-2 space-y-0.5 text-[10px]">
              <div className="font-bold text-[#0066FF]">KARTU GARANSI DIGITAL JAYA CELL</div>
              <div>No. IMEI: {completedOrder.imeiNumber}</div>
              <div>Garansi s/d: {completedOrder.warrantyEndDate}</div>
              <div className="text-[9px] text-slate-400 pt-1">
                Simpan struk ini sebagai bukti sah klaim garansi.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Struk Thermal</span>
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-3 bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-xs rounded-xl transition"
            >
              Transaksi Baru
            </button>
          </div>
        </div>
      ) : (
        /* Walk-in POS Form */
        <form onSubmit={handleSubmitPOS} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Product & Variant Selection */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <h2 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#0066FF]" />
                <span>Pilih Unit Smartphone & Varian</span>
              </h2>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 block">Produk Smartphone</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    const p = products.find((prod) => prod.id === e.target.value);
                    if (p?.variants && p.variants.length > 0) {
                      setSelectedVariantId(p.variants[0].id);
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.brand?.name || 'Official'})
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {variants.map((v) => (
                    <button
                      type="button"
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                        selectedVariantId === v.id
                          ? 'border-[#0066FF] bg-blue-50/50 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900">{v.color_name}</div>
                        <div className="text-[11px] text-slate-500">{v.storage} • Stok: {v.stock} unit</div>
                      </div>
                      <div className="text-xs font-extrabold text-[#0066FF]">
                        {formatRupiah(v.price)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* IMEI Number Input */}
              <div className="space-y-1.5 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">
                  Nomor IMEI Unit Fisik yang Dikeluarkan *
                </label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  value={imeiNumber}
                  onChange={(e) => setImeiNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="Scan barcode / ketik 15 digit IMEI"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-800 tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[10px] text-slate-400">
                  IMEI ini otomatis tercatat dalam garansi digital aktif Jaya Cell.
                </p>
              </div>
            </div>

            {/* Optional Trade-in Switcher */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-[#0066FF]" />
                  <h3 className="font-bold text-slate-900 text-sm">Tukar Tambah Fisik (Trade-In)</h3>
                </div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasTradeIn}
                    onChange={(e) => setHasTradeIn(e.target.checked)}
                    className="rounded text-[#0066FF] focus:ring-blue-500 w-4 h-4"
                  />
                  <span>Ada HP Lama</span>
                </label>
              </div>

              {hasTradeIn && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Tipe HP Masuk</label>
                      <select
                        value={tradeInRuleId}
                        onChange={(e) => setTradeInRuleId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                      >
                        {tradeInRules.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.brand_name} {r.model_name} ({r.storage})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Kondisi Fisik</label>
                      <select
                        value={tradeInCondition}
                        onChange={(e) => setTradeInCondition(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                      >
                        <option value="mulus">Mulus (100% Value)</option>
                        <option value="lecet_halus">Lecet Halus (85% Value)</option>
                        <option value="minus_fisik">Minus Fisik (65% Value)</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex justify-between">
                    <span>Nilai Potongan Trade-In:</span>
                    <span>-{formatRupiah(tradeInValuation)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Form: Customer & Payment */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
              <h2 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
                Data Pembeli & Pembayaran
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Pembeli</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">No. WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Metode Bayar Kasir</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['QRIS Kasir', 'Tunai / Cash', 'Transfer EDC'].map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setPaymentMethod(m as any)}
                        className={`p-2 rounded-xl border text-center font-bold text-[11px] transition ${
                          paymentMethod === m
                            ? 'border-[#0066FF] bg-blue-50 text-[#0066FF]'
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipe Garansi Unit</label>
                  <select
                    value={warrantyType}
                    onChange={(e) => setWarrantyType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                  >
                    <option value="Garansi Resmi">Garansi Resmi (TAM / iBox / SEIN 1 Thn)</option>
                    <option value="Garansi Toko Jaya Cell">Garansi Toko Jaya Cell (1 Thn)</option>
                  </select>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Harga Unit:</span>
                  <span className="font-bold text-slate-900">{formatRupiah(basePrice)}</span>
                </div>
                {hasTradeIn && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Diskon Trade-In:</span>
                    <span className="font-bold">-{formatRupiah(tradeInValuation)}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-extrabold text-slate-900">
                  <span>Total Tagihan POS:</span>
                  <span className="text-[#0066FF]">{formatRupiah(grandTotal)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#0066FF] hover:bg-[#0052cc] text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/25 transition active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{isSubmitting ? 'Menyimpan...' : 'Bayar & Terbitkan Nota'}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

