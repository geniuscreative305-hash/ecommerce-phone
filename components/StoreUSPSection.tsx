import React from 'react';
import { StoreUSPItem } from '@/types';
import { ShieldCheck, CreditCard, Headphones, RefreshCw, Truck } from 'lucide-react';

interface StoreUSPProps {
  items: StoreUSPItem[];
}

export default function StoreUSPSection({ items }: StoreUSPProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#0066FF]" />;
      case 'CreditCard':
        return <CreditCard className="w-6 h-6 text-[#0066FF]" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6 text-[#0066FF]" />;
      case 'RefreshCw':
        return <RefreshCw className="w-6 h-6 text-[#0066FF]" />;
      default:
        return <Truck className="w-6 h-6 text-[#0066FF]" />;
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 sm:p-8">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100/70 flex items-center justify-center flex-shrink-0">
              {getIcon(item.icon)}
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

