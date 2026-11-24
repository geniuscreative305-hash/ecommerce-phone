'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product, ProductVariant } from '@/types';
import { formatRupiah } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useUserAuth } from '@/context/UserAuthContext';
import { Star, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  badgeType?: 'best_seller' | 'discount' | 'none';
}

export default function ProductCard({ product, badgeType }: ProductCardProps) {
  const { addItem } = useCart();
  const { user, openAuthModal } = useUserAuth();
  const [added, setAdded] = useState(false);

  const defaultVariant: ProductVariant = product.variants && product.variants.length > 0
    ? product.variants[0]
    : {
        id: `v-${product.id}`,
        product_id: product.id,
        color_name: 'Standard',
        color_hex: '#0066FF',
        storage: '128GB',
        price: 15999000,
        stock: 10,
      };

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVariant);

  const displayPrice = selectedVariant.price;
  const originalPrice =
    product.discount_percent > 0
      ? Math.round(displayPrice / (1 - product.discount_percent / 100))
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const doAdd = () => {
      addItem({
        productId: product.id,
        variantId: selectedVariant.id,
        productName: product.name,
        brandName: product.brand?.name || 'Smartphone',
        image: product.images[0] || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=400&auto=format&fit=crop',
        colorName: selectedVariant.color_name,
        colorHex: selectedVariant.color_hex,
        storage: selectedVariant.storage,
        price: selectedVariant.price,
        quantity: 1,
        maxStock: selectedVariant.stock,
      });

      setAdded(true);
      setTimeout(() => setAdded(false), 1600);
    };

    if (!user) {
      openAuthModal('cart', doAdd);
      return;
    }

    doAdd();
  };

  const showBadge =
    badgeType === 'discount' || product.discount_percent > 0
      ? 'discount'
      : badgeType === 'best_seller' || product.is_popular
      ? 'best_seller'
      : null;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 relative">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
        {showBadge === 'best_seller' && (
          <span className="bg-[#0066FF] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            Best Seller
          </span>
        )}
        {showBadge === 'discount' && product.discount_percent > 0 && (
          <span className="bg-[#EF4444] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            -{product.discount_percent}%
          </span>
        )}
      </div>

      {/* Main Image Link */}
      <Link href={`/product/${product.slug}`} prefetch={true} className="block overflow-hidden rounded-xl pt-2 pb-4">
        <div className="relative aspect-square w-full flex items-center justify-center bg-slate-50/70 rounded-xl p-4 overflow-hidden">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=400&auto=format&fit=crop'}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-sm"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="space-y-2 pt-2">
        <Link href={`/product/${product.slug}`} prefetch={true}>
          <h3 className="font-bold text-slate-900 text-base group-hover:text-[#0066FF] transition line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Storage & Spec snippet */}
        <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
          <span>{selectedVariant.storage}</span>
          <span className="text-slate-300">•</span>
          <span>{selectedVariant.color_name}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="font-bold text-slate-800">4.9</span>
          <span className="text-slate-400">(2.5k ulasan)</span>
        </div>

        {/* Pricing */}
        <div className="pt-1">
          <div className="text-base font-extrabold text-slate-900">
            {formatRupiah(displayPrice)}
          </div>
          {originalPrice && (
            <div className="text-xs text-slate-400 line-through">
              {formatRupiah(originalPrice)}
            </div>
          )}
        </div>

        {/* Color variants switchers */}
        {product.variants && product.variants.length > 1 && (
          <div className="flex items-center gap-1.5 pt-1">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                title={`${v.color_name} (${v.storage})`}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedVariant.id === v.id
                    ? 'ring-2 ring-[#0066FF] ring-offset-1 scale-110'
                    : 'border-slate-300 hover:scale-105'
                }`}
                style={{ backgroundColor: v.color_hex }}
                aria-label={v.color_name}
              />
            ))}
          </div>
        )}

        {/* Add to Cart Button */}
        <div className="pt-3">
          <button
            onClick={handleAddToCart}
            disabled={selectedVariant.stock <= 0}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition duration-200 ${
              added
                ? 'bg-emerald-600 text-white'
                : selectedVariant.stock <= 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-[#0066FF] hover:bg-[#0052cc] text-white shadow-md shadow-blue-500/20 active:scale-[0.98]'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>Masuk Keranjang!</span>
              </>
            ) : selectedVariant.stock <= 0 ? (
              <span>Stok Habis</span>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>+ Keranjang</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

