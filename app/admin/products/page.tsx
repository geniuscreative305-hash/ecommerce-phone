'use client';

import React, { useState } from 'react';
import { DEFAULT_PRODUCTS, DEFAULT_BRANDS } from '@/lib/constants';
import { Product, ProductVariant } from '@/types';
import { formatRupiah } from '@/lib/utils';
import {
  Smartphone,
  Plus,
  Edit2,
  Trash2,
  Star,
  Check,
  X,
  Upload,
  Sparkles,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [brandId, setBrandId] = useState(DEFAULT_BRANDS[0].id);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isPopular, setIsPopular] = useState(false);
  const [isBestDeal, setIsBestDeal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [variants, setVariants] = useState<
    Array<{ id: string; color_name: string; color_hex: string; storage: string; price: number; stock: number }>
  >([
    { id: '1', color_name: 'Hitam', color_hex: '#111827', storage: '128GB', price: 15999000, stock: 10 },
  ]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setBrandId(DEFAULT_BRANDS[0].id);
    setDiscountPercent(0);
    setIsPopular(false);
    setIsBestDeal(false);
    setImageUrl('https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop');
    setVariants([
      { id: '1', color_name: 'Hitam', color_hex: '#111827', storage: '128GB', price: 15999000, stock: 10 },
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSlug(p.slug);
    setBrandId(p.brand_id || DEFAULT_BRANDS[0].id);
    setDiscountPercent(p.discount_percent);
    setIsPopular(p.is_popular);
    setIsBestDeal(p.is_best_deal);
    setImageUrl(p.images[0] || '');
    setVariants(
      p.variants && p.variants.length > 0
        ? p.variants.map((v) => ({ ...v }))
        : [{ id: '1', color_name: 'Hitam', color_hex: '#111827', storage: '128GB', price: 15999000, stock: 10 }]
    );
    setIsModalOpen(true);
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        id: String(Date.now()),
        color_name: 'Silver',
        color_hex: '#E2E8F0',
        storage: '256GB',
        price: 18999000,
        stock: 8,
      },
    ]);
  };

  const handleRemoveVariant = (id: string) => {
    if (variants.length <= 1) return;
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      // Update
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name,
                slug,
                brand_id: brandId,
                discount_percent: discountPercent,
                is_popular: isPopular,
                is_best_deal: isBestDeal,
                images: [imageUrl],
                variants: variants.map((v) => ({ ...v, product_id: p.id })),
              }
            : p
        )
      );
    } else {
      // Create
      const newProd: Product = {
        id: `p-${Date.now()}`,
        brand_id: brandId,
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: `${name} unit resmi garansi toko Jaya Cell.`,
        discount_percent: discountPercent,
        specs_json: {
          screen: '6.3 OLED 120Hz',
          storage: variants[0]?.storage,
          chipset: 'Flagship Core',
          network: '5G Ready',
        },
        is_popular: isPopular,
        is_best_deal: isBestDeal,
        images: [imageUrl],
        created_at: new Date().toISOString(),
        variants: variants.map((v) => ({ ...v, product_id: `p-${Date.now()}` })),
      };
      setProducts([newProd, ...products]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Yakin ingin menghapus produk smartphone ini?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Katalog Produk & Varian
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola master smartphone, warna, storage, harga, dan alokasi stok.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0066FF] hover:bg-[#0052cc] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Smartphone Baru</span>
        </button>
      </div>

      {/* Table List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5 pl-5">Foto</th>
                <th className="p-3.5">Nama Smartphone</th>
                <th className="p-3.5">Varian & Warna</th>
                <th className="p-3.5">Rentang Harga</th>
                <th className="p-3.5">Total Stok</th>
                <th className="p-3.5">Badge Promo</th>
                <th className="p-3.5 pr-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {products.map((p) => {
                const totalStock = (p.variants || []).reduce((acc, v) => acc + v.stock, 0);
                const minPrice = p.variants && p.variants.length > 0 ? Math.min(...p.variants.map((v) => v.price)) : 0;
                const maxPrice = p.variants && p.variants.length > 0 ? Math.max(...p.variants.map((v) => v.price)) : 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5 pl-5">
                      <img
                        src={p.images[0] || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=200&auto=format&fit=crop'}
                        alt={p.name}
                        className="w-12 h-12 object-contain rounded-lg bg-slate-50 border border-slate-200 p-1"
                      />
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">slug: {p.slug}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {(p.variants || []).map((v) => (
                          <span
                            key={v.id}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700 font-semibold"
                          >
                            <span
                              className="w-2 h-2 rounded-full border border-black/10"
                              style={{ backgroundColor: v.color_hex }}
                            />
                            {v.storage}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      {minPrice === maxPrice
                        ? formatRupiah(minPrice)
                        : `${formatRupiah(minPrice)} - ${formatRupiah(maxPrice)}`}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`font-bold ${
                          totalStock < 5 ? 'text-amber-600' : 'text-slate-800'
                        }`}
                      >
                        {totalStock} Unit
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        {p.is_popular && (
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-[#0066FF] text-[10px] font-bold">
                            Best Seller
                          </span>
                        )}
                        {(p.is_best_deal || p.discount_percent > 0) && (
                          <span className="px-2 py-0.5 rounded bg-red-100 text-red-600 text-[10px] font-bold">
                            -{p.discount_percent}%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 pr-5 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-slate-500 hover:text-[#0066FF] transition"
                        title="Edit Produk"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto z-10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-slate-900 text-lg">
                {editingProduct ? 'Edit Smartphone' : 'Tambah Smartphone Baru'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nama Produk *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (!editingProduct) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }
                    }}
                    placeholder="Contoh: iPhone 16 Pro"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">URL Slug Unik *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="iphone-16-pro"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Brand Smartphone</label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                  >
                    {DEFAULT_BRANDS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Diskon (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Foto Smartphone (URL)</label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="rounded text-[#0066FF] w-4 h-4"
                  />
                  <span>Tampilkan di 'Best Seller'</span>
                </label>

                <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestDeal}
                    onChange={(e) => setIsBestDeal(e.target.checked)}
                    className="rounded text-[#0066FF] w-4 h-4"
                  />
                  <span>Tampilkan di 'Best Deals'</span>
                </label>
              </div>

              {/* Dynamic Variant Builder */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">Varian Warna, Storage & Harga</span>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#0066FF] hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Varian</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {variants.map((v, idx) => (
                    <div key={v.id} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        placeholder="Nama Warna"
                        value={v.color_name}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].color_name = e.target.value;
                          setVariants(updated);
                        }}
                        className="w-24 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs"
                      />
                      <input
                        type="color"
                        value={v.color_hex}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].color_hex = e.target.value;
                          setVariants(updated);
                        }}
                        className="w-8 h-8 rounded border border-slate-200 cursor-pointer"
                        title="Pilih Kode Hex"
                      />
                      <input
                        type="text"
                        placeholder="128GB"
                        value={v.storage}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].storage = e.target.value;
                          setVariants(updated);
                        }}
                        className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs"
                      />
                      <input
                        type="number"
                        placeholder="Harga"
                        value={v.price}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].price = Number(e.target.value);
                          setVariants(updated);
                        }}
                        className="w-32 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono font-bold"
                      />
                      <input
                        type="number"
                        placeholder="Stok"
                        value={v.stock}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].stock = Number(e.target.value);
                          setVariants(updated);
                        }}
                        className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold"
                      />
                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(v.id)}
                          className="p-1 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold shadow-md shadow-blue-500/20"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

