'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types';

export async function saveProductAction(productData: {
  id?: string;
  name: string;
  slug: string;
  brand_id: string;
  discount_percent: number;
  is_popular: boolean;
  is_best_deal: boolean;
  images: string[];
  specs_json?: any;
  variants: Array<{
    id?: string;
    color_name: string;
    color_hex: string;
    storage: string;
    price: number;
    stock: number;
  }>;
}) {
  try {
    const supabase = createClient();

    let productId = productData.id;

    if (productId && !productId.startsWith('p-')) {
      // Update existing product with UUID
      const { error: prodErr } = await supabase
        .from('products')
        .update({
          name: productData.name,
          slug: productData.slug,
          brand_id: productData.brand_id,
          discount_percent: productData.discount_percent,
          is_popular: productData.is_popular,
          is_best_deal: productData.is_best_deal,
          images: productData.images,
        })
        .eq('id', productId);

      if (prodErr) {
        return { success: false, error: `Gagal update produk: ${prodErr.message}` };
      }
    } else {
      // Insert new product (let Supabase generate UUID if needed)
      const insertPayload: any = {
        name: productData.name,
        slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        brand_id: productData.brand_id && productData.brand_id.length > 20 ? productData.brand_id : null,
        description: `${productData.name} unit resmi garansi toko Jaya Cell.`,
        discount_percent: productData.discount_percent,
        specs_json: productData.specs_json || {
          screen: '6.3 OLED 120Hz',
          storage: productData.variants[0]?.storage || '128GB',
          chipset: 'Flagship Core',
          network: '5G Ready',
        },
        is_popular: productData.is_popular,
        is_best_deal: productData.is_best_deal,
        images: productData.images,
      };

      const { data: newProd, error: insertErr } = await supabase
        .from('products')
        .insert(insertPayload)
        .select()
        .single();

      if (insertErr) {
        return { success: false, error: `Gagal tambah produk: ${insertErr.message}` };
      }
      productId = newProd.id;
    }

    // Revalidate all catalog & storefront paths
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/shop');
    if (productData.slug) {
      revalidatePath(`/product/${productData.slug}`);
    }

    return { success: true, productId };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteProductAction(id: string) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/shop');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
