'use server';

import { headers } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { generateOrderNumber } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export interface PlaceOrderInput {
  idempotencyKey: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
  tradeInInfo?: any;
  tradeInDiscount: number;
  totalAmount: number;
  items: Array<{
    productId: string;
    variantId: string;
    productName: string;
    colorName: string;
    storage: string;
    quantity: number;
    price: number;
  }>;
}

export async function placeOrderAction(input: PlaceOrderInput) {
  try {
    // 1. IP Rate Limiting (max 5 per minute)
    const reqHeaders = headers();
    const clientIp = getClientIp(reqHeaders);
    const rateCheck = checkRateLimit(`checkout:${clientIp}`, 5, 60);

    if (!rateCheck.success) {
      return {
        success: false,
        error: rateCheck.error || 'Terlalu banyak permintaan checkout. Silakan tunggu 1 menit.',
      };
    }

    // 2. Validate input fields
    if (!input.customerName?.trim()) {
      return { success: false, error: 'Nama penerima wajib diisi.' };
    }
    if (!input.customerPhone?.trim() || input.customerPhone.trim().length < 8) {
      return { success: false, error: 'Nomor WhatsApp / HP tidak valid.' };
    }
    if (!input.shippingAddress?.trim()) {
      return { success: false, error: 'Alamat pengiriman lengkap wajib diisi.' };
    }
    if (!input.items || input.items.length === 0) {
      return { success: false, error: 'Keranjang belanja kosong.' };
    }

    const orderNumber = generateOrderNumber(Math.floor(Math.random() * 900) + 100);

    // Format items for RPC
    const rpcItems = input.items.map((item) => ({
      product_id: item.productId,
      variant_id: item.variantId,
      quantity: item.quantity,
      unit_price: item.price,
      color_name: item.colorName,
      storage: item.storage,
    }));

    // 3. Call PostgreSQL Atomic Transaction RPC `create_order_atomic`
    const { data: rpcResult, error: rpcError } = await supabaseAdmin.rpc(
      'create_order_atomic',
      {
        p_order_number: orderNumber,
        p_order_channel: 'online_web',
        p_customer_name: input.customerName.trim(),
        p_customer_phone: input.customerPhone.trim(),
        p_shipping_address: input.shippingAddress.trim(),
        p_city: input.city?.trim() || 'Jakarta',
        p_postal_code: input.postalCode?.trim() || '10110',
        p_payment_method: input.paymentMethod || 'qris',
        p_trade_in_info: input.tradeInInfo || null,
        p_trade_in_discount: input.tradeInDiscount || 0,
        p_total_amount: input.totalAmount,
        p_idempotency_key: input.idempotencyKey,
        p_items: rpcItems,
      }
    );

    if (rpcError) {
      console.warn('RPC create_order_atomic error:', rpcError.message);
      // Fallback: If RPC not yet installed in Supabase SQL editor, handle gracefully
      const { data: fallbackOrder, error: fallbackError } = await supabaseAdmin
        .from('orders')
        .insert({
          order_number: orderNumber,
          order_channel: 'online_web',
          customer_name: input.customerName.trim(),
          customer_phone: input.customerPhone.trim(),
          shipping_address: input.shippingAddress.trim(),
          city: input.city?.trim() || 'Jakarta',
          postal_code: input.postalCode?.trim() || '10110',
          payment_method: input.paymentMethod || 'qris',
          trade_in_info: input.tradeInInfo || null,
          trade_in_discount: input.tradeInDiscount || 0,
          total_amount: input.totalAmount,
          status: 'placed',
          idempotency_key: input.idempotencyKey,
        })
        .select()
        .single();

      if (fallbackError) {
        return { success: false, error: `Gagal membuat pesanan: ${fallbackError.message}` };
      }

      revalidatePath('/admin/orders');
      return {
        success: true,
        orderNumber: fallbackOrder.order_number,
        isIdempotent: false,
      };
    }

    if (!rpcResult?.success) {
      return {
        success: false,
        error: rpcResult?.message || 'Maaf, terjadi kendala saat memproses pesanan.',
      };
    }

    revalidatePath('/admin/orders');
    revalidatePath('/admin/pos');

    return {
      success: true,
      orderNumber: rpcResult.order_number || orderNumber,
      isIdempotent: rpcResult.is_idempotent || false,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Terjadi kesalahan tidak terduga pada server.',
    };
  }
}

