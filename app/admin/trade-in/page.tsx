'use client';

import React, { useState } from 'react';
import { DEFAULT_TRADE_IN_RULES } from '@/lib/constants';
import { TradeInRule } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { ArrowUpDown, Plus, Edit2, Trash2, Check } from 'lucide-react';

export default function AdminTradeInPage() {
  const [rules, setRules] = useState<TradeInRule[]>(DEFAULT_TRADE_IN_RULES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<TradeInRule | null>(null);

  const [brand, setBrand] = useState('Apple');
  const [model, setModel] = useState('');
  const [storage, setStorage] = useState('128GB');
  const [baseValue, setBaseValue] = useState(8000000);

  const handleOpenCreate = () => {
    setEditingRule(null);
    setBrand('Apple');
    setModel('');
    setStorage('128GB');
    setBaseValue(8000000);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRule) {
      setRules(
        rules.map((r) =>
          r.id === editingRule.id
            ? {
                ...r,
                brand_name: brand,
                model_name: model,
                storage,
                base_value: baseValue,
              }
            : r
        )
      );
    } else {
      const newRule: TradeInRule = {
        id: `tr-${Date.now()}`,
        brand_name: brand,
        model_name: model,
        storage,
        base_value: baseValue,
        condition_multipliers: {
          mulus: 1.0,
          lecet_halus: 0.85,
          minus_fisik: 0.65,
        },
      };
      setRules([newRule, ...rules]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus aturan taksir tukar tambah ini?')) {
      setRules(rules.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Aturan Taksir Tukar Tambah (Trade-In)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola matriks harga dasar dan pengali kondisi fisik (Mulus 100%, Lecet 85%, Minus 65%).
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0066FF] hover:bg-[#0052cc] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tipe HP Tukar Tambah</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5 pl-5">Brand</th>
                <th className="p-3.5">Seri Smartphone</th>
                <th className="p-3.5">Storage</th>
                <th className="p-3.5">Harga Dasar (Mulus 100%)</th>
                <th className="p-3.5">Taksir Lecet (85%)</th>
                <th className="p-3.5">Taksir Minus (65%)</th>
                <th className="p-3.5 pr-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {rules.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3.5 pl-5 font-bold text-slate-900">{r.brand_name}</td>
                  <td className="p-3.5 font-extrabold text-[#0066FF]">{r.model_name}</td>
                  <td className="p-3.5 font-mono">{r.storage}</td>
                  <td className="p-3.5 font-extrabold text-emerald-700">
                    {formatRupiah(r.base_value)}
                  </td>
                  <td className="p-3.5 text-slate-600 font-semibold">
                    {formatRupiah(r.base_value * 0.85)}
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {formatRupiah(r.base_value * 0.65)}
                  </td>
                  <td className="p-3.5 pr-5 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingRule(r);
                        setBrand(r.brand_name);
                        setModel(r.model_name);
                        setStorage(r.storage);
                        setBaseValue(r.base_value);
                        setIsModalOpen(true);
                      }}
                      className="p-1 text-slate-500 hover:text-[#0066FF]"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 p-4 flex items-center justify-center">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 z-10 text-xs">
            <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-2">
              {editingRule ? 'Edit Taksir Trade-In' : 'Tambah Aturan Trade-In'}
            </h2>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Brand</label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tipe / Seri HP *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: iPhone 14 Pro"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Storage *</label>
                <input
                  type="text"
                  required
                  value={storage}
                  onChange={(e) => setStorage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Harga Dasar Kondisi Mulus (Rp) *</label>
                <input
                  type="number"
                  required
                  step={100000}
                  value={baseValue}
                  onChange={(e) => setBaseValue(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono font-bold"
                />
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
                  Simpan Aturan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

