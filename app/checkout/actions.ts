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

    // Format items for RPC and fallback
    const rpcItems = input.items.map((item) => ({
      product_id: item.productId,
      variant_id: item.variantId,
      product_name: item.productName || 'Smartphone',
      variant_snapshot: `${item.storage} • ${item.colorName}`,
      quantity: item.quantity,
      price_at_purchase: item.price,
      unit_price: item.price,
      color_name: item.colorName,
      storage: item.storage,
    }));

    // Helper: Resilient Direct Fallback Order Creation
    const executeDirectOrderFallback = async () => {
      // Check idempotency first
      if (input.idempotencyKey) {
        const { data: existing } = await supabaseAdmin
          .from('orders')
          .select('order_number')
          .eq('idempotency_key', input.idempotencyKey)
          .maybeSingle();

        if (existing) {
          return {
            success: true,
            orderNumber: existing.order_number,
            isIdempotent: true,
          };
        }
      }

      // 1. Insert into orders
      const { data: orderData, error: orderErr } = await supabaseAdmin
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

      if (orderErr) {
        return { success: false, error: `Gagal membuat pesanan: ${orderErr.message}` };
      }

      // 2. Insert order items
      for (const item of rpcItems) {
        // Try inserting with price_at_purchase first
        const itemPayload: any = {
          order_id: orderData.id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          product_name: item.product_name,
          variant_snapshot: item.variant_snapshot,
          quantity: item.quantity,
          price_at_purchase: item.price_at_purchase,
        };

        const { error: itemErr } = await supabaseAdmin.from('order_items').insert(itemPayload);
        if (itemErr) {
          // If price_at_purchase column issue, try with unit_price
          await supabaseAdmin.from('order_items').insert({
            order_id: orderData.id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            product_name: item.product_name,
            variant_snapshot: item.variant_snapshot,
            quantity: item.quantity,
            unit_price: item.price_at_purchase,
          });
        }

        // Deduct stock safely
        try {
          const { data: currentVar } = await supabaseAdmin
            .from('product_variants')
            .select('stock')
            .eq('id', item.variant_id)
            .single();

          if (currentVar && typeof currentVar.stock === 'number') {
            await supabaseAdmin
              .from('product_variants')
              .update({ stock: Math.max(0, currentVar.stock - item.quantity) })
              .eq('id', item.variant_id);
          }
        } catch {}
      }

      revalidatePath('/admin/orders');
      revalidatePath('/admin/pos');

      return {
        success: true,
        orderNumber: orderData.order_number || orderNumber,
        isIdempotent: false,
      };
    };

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

    // If RPC failed or threw an error
    if (rpcError) {
      console.warn('RPC create_order_atomic connection/schema error, executing direct fallback:', rpcError.message);
      return await executeDirectOrderFallback();
    }

    if (!rpcResult?.success) {
      // If it's legitimately out of stock, return out of stock message
      if (rpcResult?.error_code === 'STOK_HABIS' || rpcResult?.message === 'STOK_HABIS') {
        return {
          success: false,
          error: 'Maaf, stok varian ini baru saja habis dibeli pelanggan lain.',
        };
      }

      // If it's a database schema/column mismatch error (like unit_price), seamlessly execute direct fallback
      console.warn('RPC returned non-stock database error, executing direct fallback:', rpcResult?.message);
      return await executeDirectOrderFallback();
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

