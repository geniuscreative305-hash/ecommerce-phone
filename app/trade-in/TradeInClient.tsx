'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TradeInRule, TradeInInfo } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import {
  ArrowUpDown,
  Smartphone,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface TradeInClientProps {
  rules: TradeInRule[];
}

export default function TradeInClient({ rules }: TradeInClientProps) {
  const router = useRouter();
  const { setTradeIn } = useCart();

  // Extract unique brands
  const brands = useMemo(() => Array.from(new Set(rules.map((r) => r.brand_name))), [rules]);

  const [selectedBrand, setSelectedBrand] = useState<string>(brands[0] || 'Apple');

  // Filter models for selected brand
  const models = useMemo(() => {
    const list = rules.filter((r) => r.brand_name === selectedBrand);
    return Array.from(new Set(list.map((r) => r.model_name)));
  }, [rules, selectedBrand]);

  const [selectedModel, setSelectedModel] = useState<string>(models[0] || 'iPhone 15 Pro');

  // Storage capacities for model
  const storages = useMemo(() => {
    return rules
      .filter((r) => r.brand_name === selectedBrand && r.model_name === selectedModel)
      .map((r) => r.storage);
  }, [rules, selectedBrand, selectedModel]);

  const [selectedStorage, setSelectedStorage] = useState<string>(storages[0] || '128GB');
  const [condition, setCondition] = useState<'mulus' | 'lecet_halus' | 'minus_fisik'>('mulus');
  const [applied, setApplied] = useState(false);

  // Active matched rule
  const matchedRule = rules.find(
    (r) =>
      r.brand_name === selectedBrand &&
      r.model_name === selectedModel &&
      r.storage === selectedStorage
  );

  const baseValue = matchedRule ? matchedRule.base_value : 8000000;
  const multipliers = matchedRule
    ? matchedRule.condition_multipliers
    : { mulus: 1.0, lecet_halus: 0.85, minus_fisik: 0.65 };

  const valuationAmount = Math.round(baseValue * (multipliers[condition] || 1.0));

  const handleApplyTradeIn = () => {
    const info: TradeInInfo = {
      rule_id: matchedRule?.id,
      brand_name: selectedBrand,
      model_name: selectedModel,
      storage: selectedStorage,
      condition,
      valuation_amount: valuationAmount,
    };
    setTradeIn(info);
    setApplied(true);
    setTimeout(() => {
      router.push('/shop');
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] text-xs font-bold uppercase tracking-wider">
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Kalkulator Tukar Tambah Instan</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Tukar HP Lamamu, Upgrade Flagship Baru
        </h1>
        <p className="text-sm text-slate-500">
          Dapatkan taksiran harga tertinggi untuk smartphone lamamu dalam 3 langkah mudah. Nilai taksir otomatis memotong total belanja di kasir atau checkout!
        </p>
      </div>

      {/* Main Calculator Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          {/* Step 1: Select Brand */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>1. Pilih Brand HP Lama</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    setSelectedBrand(b);
                    const newModels = rules
                      .filter((r) => r.brand_name === b)
                      .map((r) => r.model_name);
                    if (newModels.length > 0) {
                      setSelectedModel(newModels[0]);
                      const newStorages = rules
                        .filter((r) => r.brand_name === b && r.model_name === newModels[0])
                        .map((r) => r.storage);
                      if (newStorages.length > 0) setSelectedStorage(newStorages[0]);
                    }
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                    selectedBrand === b
                      ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Select Model & Storage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Tipe / Seri HP
              </label>
              <select
                value={selectedModel}
                onChange={(e) => {
                  setSelectedModel(e.target.value);
                  const newStorages = rules
                    .filter(
                      (r) =>
                        r.brand_name === selectedBrand && r.model_name === e.target.value
                    )
                    .map((r) => r.storage);
                  if (newStorages.length > 0) setSelectedStorage(newStorages[0]);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                3. Kapasitas Memori (Storage)
              </label>
              <select
                value={selectedStorage}
                onChange={(e) => setSelectedStorage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {storages.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Step 3: Physical Condition */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              4. Kondisi Fisik & Fungsi
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setCondition('mulus')}
                className={`p-4 rounded-2xl border text-left transition ${
                  condition === 'mulus'
                    ? 'border-[#0066FF] bg-blue-50/50 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-sm">Mulus / Grade A</span>
                  {condition === 'mulus' && (
                    <CheckCircle2 className="w-4 h-4 text-[#0066FF]" />
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Fungsi normal 100%, body mulus tanpa dent/penyok, layar jernih.
                </p>
                <div className="text-[11px] font-bold text-emerald-600 mt-2">
                  Taksiran 100% Penuh
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCondition('lecet_halus')}
                className={`p-4 rounded-2xl border text-left transition ${
                  condition === 'lecet_halus'
                    ? 'border-[#0066FF] bg-blue-50/50 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-sm">Lecet Halus / Grade B</span>
                  {condition === 'lecet_halus' && (
                    <CheckCircle2 className="w-4 h-4 text-[#0066FF]" />
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Fungsi normal, terdapat goresan pemakaian wajar, tidak ada retak.
                </p>
                <div className="text-[11px] font-bold text-blue-600 mt-2">
                  Taksiran ~85%
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCondition('minus_fisik')}
                className={`p-4 rounded-2xl border text-left transition ${
                  condition === 'minus_fisik'
                    ? 'border-[#0066FF] bg-blue-50/50 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 text-sm">Minus Fisik / Grade C</span>
                  {condition === 'minus_fisik' && (
                    <CheckCircle2 className="w-4 h-4 text-[#0066FF]" />
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Terdapat dent/jamur/baret dalam, namun mesin & layar masih menyala normal.
                </p>
                <div className="text-[11px] font-bold text-amber-600 mt-2">
                  Taksiran ~65%
                </div>
              </button>
            </div>
          </div>

          {/* Valuation Output Result Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-[#1E293B] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs text-blue-300 font-semibold flex items-center justify-center sm:justify-start gap-1">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Estimasi Nilai Taksir HP Lamamu</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {formatRupiah(valuationAmount)}
              </div>
              <div className="text-xs text-slate-400">
                Unit: {selectedBrand} {selectedModel} ({selectedStorage})
              </div>
            </div>

            <button
              onClick={handleApplyTradeIn}
              className={`w-full sm:w-auto px-6 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg active:scale-95 ${
                applied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#0066FF] hover:bg-[#0052cc] text-white shadow-blue-500/30'
              }`}
            >
              {applied ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Diskon Diterapkan! Mengalihkan...</span>
                </>
              ) : (
                <>
                  <span>Gunakan Diskon & Pilih HP Baru</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footnote */}
        <div className="bg-slate-50 px-6 sm:px-8 py-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            Estimasi ini berlaku mengikat selama data fisik sesuai saat pemeriksaan unit fisik di konter Jaya Cell atau oleh kurir.
          </span>
        </div>
      </div>
    </div>
  );
}

