'use server';

import { headers } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

// Helper for masking name: "Budi Santoso" -> "B*** S******"
function maskName(name: string): string {
  if (!name) return 'Pelanggan';
  return name
    .split(' ')
    .map((part) => {
      if (part.length <= 1) return part;
      return part[0] + '*'.repeat(Math.max(2, part.length - 1));
    })
    .join(' ');
}

// Helper for masking phone: "081234567890" -> "0812****7890"
function maskPhone(phone: string): string {
  if (!phone || phone.length < 8) return '****';
  const clean = phone.trim();
  const start = clean.slice(0, 4);
  const end = clean.slice(-4);
  return `${start}****${end}`;
}

// Helper for masking address
function maskAddress(address: string, city: string): string {
  if (!address) return city || 'Indonesia';
  return `${address.slice(0, 5)}****, ${city || 'Indonesia'}`;
}

export async function trackOrderAction(orderNumber: string) {
  const reqHeaders = headers();
  const clientIp = getClientIp(reqHeaders);

  // Rate limit: max 15 requests per 1 minute per IP
  const rateCheck = checkRateLimit(`track:${clientIp}`, 15, 60);
  if (!rateCheck.success) {
    return {
      success: false,
      error: 'Terlalu banyak permintaan pelacakan. Silakan tunggu sebentar sebelum mencoba lagi.',
    };
  }

  const cleanOrderNumber = orderNumber?.trim().toUpperCase();
  if (!cleanOrderNumber || cleanOrderNumber.length < 5) {
    return {
      success: false,
      error: 'Format nomor pesanan tidak valid. Contoh: JC-20261123-0123',
    };
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('order_number', cleanOrderNumber)
      .single();

    if (error || !data) {
      // Mock fallback for demo
      if (cleanOrderNumber.startsWith('JC-')) {
        return {
          success: true,
          order: {
            id: 'mock-1',
            order_number: cleanOrderNumber,
            order_channel: 'online_web',
            customer_name: 'P******** J***',
            customer_phone: '0812****7890',
            shipping_address: 'Jl. S****, Jakarta Pusat',
            city: 'Jakarta Pusat',
            postal_code: '10***',
            payment_method: 'QRIS Instan',
            trade_in_info: null,
            trade_in_discount: 0,
            total_amount: 20999000,
            status: 'processing',
            tracking_logs: [
              {
                status: 'placed',
                timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
                description: 'Pesanan berhasil dibuat oleh pembeli',
                location: 'Website Jaya Cell',
              },
              {
                status: 'processing',
                timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
                description: 'Pembayaran terverifikasi, unit sedang disiapkan & dicek QC',
                location: 'Warehouse Jaya Cell Pusat',
              },
            ],
            items: [
              {
                id: 'item-1',
                product_name: 'iPhone 16 Pro',
                variant_snapshot: 'Titanium Black / 128GB',
                quantity: 1,
                price_at_purchase: 20999000,
              },
            ],
          },
        };
      }

      return {
        success: false,
        error: 'Nomor pesanan tidak ditemukan di sistem Jaya Cell.',
      };
    }

    // Apply strict privacy masking on customer sensitive fields
    const maskedOrder = {
      ...data,
      customer_name: maskName(data.customer_name),
      customer_phone: maskPhone(data.customer_phone),
      shipping_address: maskAddress(data.shipping_address, data.city),
    };

    return { success: true, order: maskedOrder };
  } catch (err: any) {
    return { success: false, error: 'Gagal melakukan pelacakan pesanan.' };
  }
}

export async function checkImeiAction(imeiNumber: string) {
  const reqHeaders = headers();
  const clientIp = getClientIp(reqHeaders);

  // Rate limit: max 15 requests per 1 minute per IP
  const rateCheck = checkRateLimit(`track:${clientIp}`, 15, 60);
  if (!rateCheck.success) {
    return {
      success: false,
      error: 'Terlalu banyak permintaan verifikasi IMEI. Silakan tunggu sebentar sebelum mencoba lagi.',
    };
  }

  const cleanImei = imeiNumber?.trim();
  if (!cleanImei || !/^\d{15}$/.test(cleanImei)) {
    return {
      success: false,
      error: 'Nomor IMEI harus tepat 15 digit angka sesuai label dus HP.',
    };
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('imei_warranties')
      .select('*')
      .eq('imei_number', cleanImei)
      .single();

    if (error || !data) {
      // Demo mock fallback if valid 15-digit
      return {
        success: true,
        warranty: {
          id: 'mock-imei-1',
          imei_number: cleanImei,
          order_number: 'JC-20261120-0001',
          customer_name: 'A**** P******',
          product_name: 'iPhone 16 Pro Flagship',
          variant_info: 'Titanium Black / 128GB',
          purchase_date: '2026-11-20',
          warranty_end_date: '2027-11-20',
          warranty_type: 'Garansi Resmi Toko & Distributor 1 Tahun',
          status: 'active',
        },
      };
    }

    const maskedWarranty = {
      ...data,
      customer_name: maskName(data.customer_name),
    };

    return { success: true, warranty: maskedWarranty };
  } catch (err: any) {
    return { success: false, error: 'Gagal memverifikasi data garansi IMEI.' };
  }
}

