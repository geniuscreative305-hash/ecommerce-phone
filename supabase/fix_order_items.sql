-- ================================================================================
-- QUICK FIX: ORDER ITEMS SCHEMA & ATOMIC CHECKOUT ALIGNMENT
-- Jalankan skrip ini sekali di Supabase Dashboard -> SQL Editor
-- ================================================================================

-- 1. Pastikan kedua kolom harga (price_at_purchase & unit_price) serta snapshot produk ada
ALTER TABLE IF EXISTS public.order_items ADD COLUMN IF NOT EXISTS price_at_purchase NUMERIC;
ALTER TABLE IF EXISTS public.order_items ADD COLUMN IF NOT EXISTS unit_price NUMERIC;
ALTER TABLE IF EXISTS public.order_items ADD COLUMN IF NOT EXISTS product_name TEXT DEFAULT 'Smartphone';
ALTER TABLE IF EXISTS public.order_items ADD COLUMN IF NOT EXISTS variant_snapshot TEXT DEFAULT 'Default';

-- Update nilai kolom jika ada yang bernilai null
UPDATE public.order_items 
SET price_at_purchase = unit_price 
WHERE price_at_purchase IS NULL AND unit_price IS NOT NULL;

UPDATE public.order_items 
SET unit_price = price_at_purchase 
WHERE unit_price IS NULL AND price_at_purchase IS NOT NULL;

-- 2. Perbarui fungsi RPC create_order_atomic agar mendukung kedua kolom
CREATE OR REPLACE FUNCTION public.create_order_atomic(
    p_order_number TEXT,
    p_order_channel TEXT,
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_shipping_address TEXT,
    p_city TEXT,
    p_postal_code TEXT,
    p_payment_method TEXT,
    p_trade_in_info JSONB,
    p_trade_in_discount NUMERIC,
    p_total_amount NUMERIC,
    p_idempotency_key TEXT,
    p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_new_order_id UUID := gen_random_uuid();
    v_existing_order_id UUID;
    v_existing_order_number TEXT;
    v_item RECORD;
    v_variant_id UUID;
    v_quantity INT;
    v_current_stock INT;
BEGIN
    -- STEP 1: Anti-Double Checkout (Idempotency Check)
    IF p_idempotency_key IS NOT NULL AND TRIM(p_idempotency_key) <> '' THEN
        SELECT id, order_number INTO v_existing_order_id, v_existing_order_number
        FROM public.orders
        WHERE idempotency_key = p_idempotency_key;

        IF FOUND THEN
            RETURN jsonb_build_object(
                'success', true,
                'is_idempotent', true,
                'order_id', v_existing_order_id,
                'order_number', v_existing_order_number,
                'message', 'Pesanan ini sudah pernah diproses sebelumnya (Idempotent).'
            );
        END IF;
    END IF;

    -- STEP 2: Stock Validation & Row-Level Locking (FOR UPDATE)
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_variant_id := (v_item.value->>'variant_id')::UUID;
        v_quantity := (v_item.value->>'quantity')::INT;

        -- Lock row explicitly
        SELECT stock INTO v_current_stock
        FROM public.product_variants
        WHERE id = v_variant_id
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'VARIAN_TIDAK_DITEMUKAN';
        END IF;

        IF v_current_stock < v_quantity THEN
            RAISE EXCEPTION 'STOK_HABIS';
        END IF;

        -- Deduct stock atomically
        UPDATE public.product_variants
        SET stock = stock - v_quantity
        WHERE id = v_variant_id;
    END LOOP;

    -- STEP 3: Insert Order
    INSERT INTO public.orders (
        id,
        order_number,
        order_channel,
        customer_name,
        customer_phone,
        shipping_address,
        city,
        postal_code,
        payment_method,
        trade_in_info,
        trade_in_discount,
        total_amount,
        status,
        idempotency_key,
        created_at
    ) VALUES (
        v_new_order_id,
        p_order_number,
        p_order_channel,
        p_customer_name,
        p_customer_phone,
        p_shipping_address,
        p_city,
        p_postal_code,
        p_payment_method,
        p_trade_in_info,
        p_trade_in_discount,
        p_total_amount,
        'placed',
        p_idempotency_key,
        NOW()
    );

    -- STEP 4: Insert Order Items (Mendukung price_at_purchase & unit_price)
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        INSERT INTO public.order_items (
            order_id,
            product_id,
            variant_id,
            product_name,
            variant_snapshot,
            quantity,
            price_at_purchase,
            unit_price
        ) VALUES (
            v_new_order_id,
            (v_item.value->>'product_id')::UUID,
            (v_item.value->>'variant_id')::UUID,
            COALESCE(v_item.value->>'product_name', 'Smartphone'),
            COALESCE(v_item.value->>'variant_snapshot', 'Varian'),
            (v_item.value->>'quantity')::INT,
            COALESCE((v_item.value->>'price_at_purchase')::NUMERIC, (v_item.value->>'unit_price')::NUMERIC, 0),
            COALESCE((v_item.value->>'unit_price')::NUMERIC, (v_item.value->>'price_at_purchase')::NUMERIC, 0)
        );
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'is_idempotent', false,
        'order_id', v_new_order_id,
        'order_number', p_order_number,
        'message', 'Pesanan berhasil dibuat dengan stok terkunci aman.'
    );
EXCEPTION
    WHEN OTHERS THEN
        IF SQLERRM = 'STOK_HABIS' THEN
            RETURN jsonb_build_object(
                'success', false,
                'error_code', 'STOK_HABIS',
                'message', 'Maaf, stok varian ini baru saja habis dibeli pelanggan lain.'
            );
        ELSIF SQLERRM = 'VARIAN_TIDAK_DITEMUKAN' THEN
            RETURN jsonb_build_object(
                'success', false,
                'error_code', 'VARIAN_TIDAK_DITEMUKAN',
                'message', 'Varian produk tidak ditemukan di sistem.'
            );
        ELSE
            RETURN jsonb_build_object(
                'success', false,
                'error_code', 'DB_ERROR',
                'message', SQLERRM
            );
        END IF;
END;
$$;

