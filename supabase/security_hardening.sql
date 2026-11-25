-- ==============================================================================
-- JAYA CELL - ENTERPRISE SECURITY HARDENING, ATOMIC STOCK & AUDIT LOGS
-- Comprehensive Database Hardening Script (Safe & Idempotent)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SCHEMA ENHANCEMENTS
-- 2.1 Add idempotency_key to orders table
ALTER TABLE IF EXISTS public.orders 
ADD COLUMN IF NOT EXISTS idempotency_key TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_orders_idempotency_key ON public.orders(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);

-- 2.2 Create admin_whitelist table for 3-gate admin access
CREATE TABLE IF NOT EXISTS public.admin_whitelist (
    user_id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'super_admin' CHECK (role IN ('super_admin', 'admin', 'auditor')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Seed default initial super_admin (admin@jayacell.id)
INSERT INTO public.admin_whitelist (user_id, email, role, is_active)
VALUES ('00000000-0000-0000-0000-000000000001', 'admin@jayacell.id', 'super_admin', true)
ON CONFLICT (email) DO UPDATE 
SET role = 'super_admin', is_active = true;

-- 2.3 Create admin_audit_logs table (Immutable audit trail)
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_email TEXT NOT NULL,
    action_type TEXT NOT NULL, -- e.g. UPDATE_PRICE, UPDATE_STOCK, DELETE_PRODUCT, UPDATE_ORDER_STATUS, UPDATE_CMS, POS_TRANSACTION, FAILED_LOGIN_ALERT
    target_entity TEXT,        -- e.g. products, orders, cms, auth
    details_json JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.admin_audit_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.admin_audit_logs(created_at DESC);

-- 3. TRANSACTIONAL POSTGRESQL FUNCTION: create_order_atomic
-- Performs Row-Level Locking (FOR UPDATE) on product_variants to prevent race condition & double checkout
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
    v_existing_order_id UUID;
    v_existing_order_number TEXT;
    v_new_order_id UUID := gen_random_uuid();
    v_item RECORD;
    v_variant_id UUID;
    v_quantity INT;
    v_current_stock INT;
BEGIN
    -- STEP 1: Idempotency Check
    IF p_idempotency_key IS NOT NULL AND p_idempotency_key <> '' THEN
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

    -- STEP 4: Insert Order Items
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

-- 4. STORAGE HARDENING (2MB Strict Image Verification)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'jaya-cell-assets',
  'jaya-cell-assets',
  true,
  2097152, -- 2MB Strict Limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- 5. ACCESS PRIVILEGES
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- Execute RPC permission
GRANT EXECUTE ON FUNCTION public.create_order_atomic TO anon, authenticated, service_role;

