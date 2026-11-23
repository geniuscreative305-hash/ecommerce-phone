-- ==============================================================================
-- JAYA CELL - DATABASE SCHEMA, RLS POLICIES & SEED DATA
-- Fully Idempotent Migration for Supabase PostgreSQL
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLES DEFINITION

-- 2.1 site_settings (WordPress-Style CMS Key-Value Sections)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id SERIAL PRIMARY KEY,
    section_key TEXT UNIQUE NOT NULL,
    content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2.2 brands (Smartphone Brand Master)
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0
);

-- 2.3 products (Catalog Master)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_percent INT DEFAULT 0,
    specs_json JSONB DEFAULT '{}'::jsonb,
    is_popular BOOLEAN DEFAULT false,
    is_best_deal BOOLEAN DEFAULT false,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2.4 product_variants (Color Swatches, Storage & Inventory)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    color_name TEXT NOT NULL,
    color_hex TEXT NOT NULL,
    storage TEXT NOT NULL,
    price NUMERIC NOT NULL,
    stock INT NOT NULL DEFAULT 0
);

-- 2.5 trade_in_rules (Interactive Trade-In Valuation Matrix)
CREATE TABLE IF NOT EXISTS public.trade_in_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name TEXT NOT NULL,
    model_name TEXT NOT NULL,
    storage TEXT NOT NULL,
    base_value NUMERIC NOT NULL,
    condition_multipliers JSONB NOT NULL DEFAULT '{"mulus": 1.0, "lecet_halus": 0.85, "minus_fisik": 0.65}'::jsonb
);

-- 2.6 orders (Online Web & Offline Counter POS Orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    order_channel TEXT NOT NULL CHECK (order_channel IN ('online_web', 'offline_pos')),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT,
    city TEXT,
    postal_code TEXT,
    payment_method TEXT NOT NULL,
    trade_in_info JSONB,
    trade_in_discount NUMERIC DEFAULT 0,
    total_amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'placed' CHECK (status IN ('placed', 'processing', 'shipped', 'delivered', 'cancelled')),
    tracking_logs JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2.7 order_items (Order Line Items Snapshot)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID,
    variant_id UUID,
    product_name TEXT NOT NULL,
    variant_snapshot TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price_at_purchase NUMERIC NOT NULL
);

-- 2.8 imei_warranties (Digital 15-Digit Warranty Ledger)
CREATE TABLE IF NOT EXISTS public.imei_warranties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    imei_number TEXT UNIQUE NOT NULL,
    order_number TEXT,
    customer_name TEXT NOT NULL,
    product_name TEXT NOT NULL,
    variant_info TEXT NOT NULL,
    purchase_date DATE DEFAULT CURRENT_DATE NOT NULL,
    warranty_end_date DATE NOT NULL,
    warranty_type TEXT NOT NULL DEFAULT 'Garansi Resmi' CHECK (warranty_type IN ('Garansi Resmi', 'Garansi Toko Jaya Cell')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired'))
);

-- 3. INDEXES FOR HIGH-SPEED ZERO-DELAY QUERIES
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_popular ON public.products(is_popular);
CREATE INDEX IF NOT EXISTS idx_products_best_deal ON public.products(is_best_deal);
CREATE INDEX IF NOT EXISTS idx_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_imei_number ON public.imei_warranties(imei_number);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_in_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imei_warranties ENABLE ROW LEVEL SECURITY;

-- 4.1 Public Read (SELECT) Policies
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view active brands" ON public.brands;
CREATE POLICY "Public can view active brands" ON public.brands FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view variants" ON public.product_variants;
CREATE POLICY "Public can view variants" ON public.product_variants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view trade-in rules" ON public.trade_in_rules;
CREATE POLICY "Public can view trade-in rules" ON public.trade_in_rules FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can track orders" ON public.orders;
CREATE POLICY "Public can track orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view order items" ON public.order_items;
CREATE POLICY "Public can view order items" ON public.order_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can check IMEI warranties" ON public.imei_warranties;
CREATE POLICY "Public can check IMEI warranties" ON public.imei_warranties FOR SELECT USING (true);

-- 4.2 Insert Policies for Checkout & Orders (Public can create orders)
DROP POLICY IF EXISTS "Public can create orders" ON public.orders;
CREATE POLICY "Public can create orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can create order items" ON public.order_items;
CREATE POLICY "Public can create order items" ON public.order_items FOR INSERT WITH CHECK (true);

-- 4.3 Authenticated Admin Full Mutations
DROP POLICY IF EXISTS "Admin full access site_settings" ON public.site_settings;
CREATE POLICY "Admin full access site_settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access brands" ON public.brands;
CREATE POLICY "Admin full access brands" ON public.brands FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access products" ON public.products;
CREATE POLICY "Admin full access products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access product_variants" ON public.product_variants;
CREATE POLICY "Admin full access product_variants" ON public.product_variants FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access trade_in_rules" ON public.trade_in_rules;
CREATE POLICY "Admin full access trade_in_rules" ON public.trade_in_rules FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access orders" ON public.orders;
CREATE POLICY "Admin full access orders" ON public.orders FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access order_items" ON public.order_items;
CREATE POLICY "Admin full access order_items" ON public.order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access imei_warranties" ON public.imei_warranties;
CREATE POLICY "Admin full access imei_warranties" ON public.imei_warranties FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. STORAGE BUCKET CONFIGURATION (jaya-cell-assets)
INSERT INTO storage.buckets (id, name, public)
VALUES ('jaya-cell-assets', 'jaya-cell-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read storage jaya-cell-assets" ON storage.objects;
CREATE POLICY "Public read storage jaya-cell-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'jaya-cell-assets');

DROP POLICY IF EXISTS "Authenticated admin upload storage jaya-cell-assets" ON storage.objects;
CREATE POLICY "Authenticated admin upload storage jaya-cell-assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'jaya-cell-assets');

DROP POLICY IF EXISTS "Authenticated admin update storage jaya-cell-assets" ON storage.objects;
CREATE POLICY "Authenticated admin update storage jaya-cell-assets"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'jaya-cell-assets');

DROP POLICY IF EXISTS "Authenticated admin delete storage jaya-cell-assets" ON storage.objects;
CREATE POLICY "Authenticated admin delete storage jaya-cell-assets"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'jaya-cell-assets');

-- 6. INITIAL SEED DATA

-- 6.1 Seed site_settings
INSERT INTO public.site_settings (section_key, content_json)
VALUES 
(
    'brand_identity',
    '{
        "brand_name": "Jaya Cell",
        "tagline": "Pusat Smartphone Resmi & Tukar Tambah Terpercaya",
        "logo_url": "",
        "favicon_url": "",
        "phone": "+62 812-3456-7890",
        "email": "halo@jayacell.id",
        "address": "Jl. Gajah Mada No. 88, Menteng, Jakarta Pusat",
        "instagram": "jayacell.id"
    }'::jsonb
),
(
    'hero_banner',
    '{
        "tag": "NEW ARRIVAL",
        "headline": "iPhone 16 Pro",
        "subheadline": "More Power. More Possibilities. Temukan kekuatan chip A18 Pro dengan kamera tercanggih dan daya tahan baterai superior.",
        "cta_text": "Shop Now",
        "cta_link": "/product/iphone-16-pro",
        "badge_highlight": "Garansi Resmi iBox / GDN 1 Tahun",
        "hero_image": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop"
    }'::jsonb
),
(
    'promo_banner',
    '{
        "tag": "LIMITED TIME OFFER",
        "title": "Diskon Hingga 30%",
        "subtitle": "Untuk Smartphone Flagship & Mid-Range Pilihan. Tukar tambah HP lamamu sekarang juga dengan nilai taksir tertinggi!",
        "cta_text": "Lihat Promo",
        "cta_link": "/shop?promo=deals",
        "promo_image": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1000&auto=format&fit=crop"
    }'::jsonb
),
(
    'store_usp',
    '[
        {
            "icon": "ShieldCheck",
            "title": "Garansi Resmi 100%",
            "desc": "Unit resmi TAM, iBox, SEIN & Garansi Toko Terjamin"
        },
        {
            "icon": "CreditCard",
            "title": "Pembayaran Aman",
            "desc": "Transfer Bank, Virtual Account, QRIS & Cicilan 0%"
        },
        {
            "icon": "Headphones",
            "title": "CS & Konsultasi Cepat",
            "desc": "Dukungan teknis ramah dan bantuan klaim garansi kilat"
        },
        {
            "icon": "RefreshCw",
            "title": "Tukar Tambah Mudah",
            "desc": "Taksir instan di web atau langsung di konter fisik"
        }
    ]'::jsonb
),
(
    'newsletter_banner',
    '{
        "title": "Tetap Terhubung dengan Jaya Cell",
        "subtitle": "Dapatkan info promo flash sale eksklusif, cashback tukar tambah, dan peluncuran seri smartphone terbaru langsung ke WhatsApp Anda.",
        "whatsapp_cta": "Chat CS WhatsApp"
    }'::jsonb
),
(
    'footer_info',
    '{
        "about": "Jaya Cell adalah pusat ritel dan distributor smartphone resmi terpercaya. Melayani pembelian online se-Indonesia dan konter fisik dengan jaminan garansi resmi dan kemudahan tukar tambah.",
        "opening_hours": "Senin - Minggu: 09:00 - 21:30 WIB",
        "copyright": "© 2026 Jaya Cell Smartphone Retail & POS. All Rights Reserved."
    }'::jsonb
)
ON CONFLICT (section_key) DO UPDATE 
SET content_json = EXCLUDED.content_json, updated_at = NOW();

-- 6.2 Seed brands
INSERT INTO public.brands (id, name, logo_url, is_active, sort_order)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Apple', 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', true, 1),
('22222222-2222-2222-2222-222222222222', 'Samsung', 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', true, 2),
('33333333-3333-3333-3333-333333333333', 'Google', 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', true, 3),
('44444444-4444-4444-4444-444444444444', 'OnePlus', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/OnePlus_logo_2020.svg/512px-OnePlus_logo_2020.svg.png', true, 4),
('55555555-5555-5555-5555-555555555555', 'Xiaomi', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Xiaomi_logo_%282021-%29.svg/512px-Xiaomi_logo_%282021-%29.svg.png', true, 5),
('66666666-6666-6666-6666-666666666666', 'realme', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Realme_logo.svg/512px-Realme_logo.svg.png', true, 6)
ON CONFLICT (id) DO NOTHING;

-- 6.3 Seed Products
INSERT INTO public.products (id, brand_id, name, slug, description, discount_percent, specs_json, is_popular, is_best_deal, images)
VALUES
(
    'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'iPhone 16 Pro',
    'iphone-16-pro',
    'iPhone 16 Pro hadir dengan material Titanium Grade 5 yang tangguh dan ringan. Ditenagai chip A18 Pro yang dirancang untuk Apple Intelligence, serta sistem kamera profesional dengan tombol Camera Control inovatif.',
    0,
    '{"screen": "6.3 Super Retina XDR OLED 120Hz ProMotion", "storage": "128GB / 256GB / 512GB", "chipset": "Apple A18 Pro (3 nm)", "network": "5G Ready", "battery": "Hingga 27 jam pemutaran video"}',
    true,
    false,
    ARRAY[
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800&auto=format&fit=crop'
    ]
),
(
    'b2222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '22222222-2222-2222-2222-222222222222',
    'Samsung Galaxy S24',
    'samsung-galaxy-s24',
    'Galaxy S24 membawa era baru mobile AI dengan Galaxy AI. Dilengkapi layar Dynamic AMOLED 2X cerah dan bodi Armor Aluminum yang ramping.',
    10,
    '{"screen": "6.2 Dynamic AMOLED 2X 120Hz HDR10+", "storage": "256GB / 512GB", "chipset": "Exynos 2400 / Snapdragon 8 Gen 3", "network": "5G Ready", "battery": "4000 mAh Fast Charging 25W"}',
    true,
    false,
    ARRAY[
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=800&auto=format&fit=crop'
    ]
),
(
    'c3333333-cccc-cccc-cccc-cccccccccccc',
    '33333333-3333-3333-3333-333333333333',
    'Google Pixel 9',
    'google-pixel-9',
    'Smartphone tercerdas dengan chip Tensor G4 dan Google AI terintegrasi Gemini. Kamera jernih natural khas Pixel dalam balutan desain baru yang futuristik.',
    0,
    '{"screen": "6.3 Actua OLED 120Hz 2700 nits", "storage": "128GB / 256GB", "chipset": "Google Tensor G4 (4 nm)", "network": "5G Ready", "battery": "4700 mAh Fast Charging"}',
    true,
    false,
    ARRAY[
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop'
    ]
),
(
    'd4444444-dddd-dddd-dddd-dddddddddddd',
    '44444444-4444-4444-4444-444444444444',
    'OnePlus 12',
    'oneplus-12',
    'Smooth beyond belief. OnePlus 12 mengombinasikan Snapdragon 8 Gen 3 terkuat, kamera Hasselblad Generasi ke-4, dan pengisian daya kilat 100W SUPERVOOC.',
    0,
    '{"screen": "6.82 ProXDR AMOLED 120Hz LTPO", "storage": "256GB / 512GB", "chipset": "Snapdragon 8 Gen 3", "network": "5G Ready", "battery": "5400 mAh 100W SUPERVOOC"}',
    true,
    false,
    ARRAY[
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=800&auto=format&fit=crop'
    ]
),
(
    'e5555555-eeee-eeee-eeee-eeeeeeeeeeee',
    '11111111-1111-1111-1111-111111111111',
    'iPhone 15',
    'iphone-15',
    'Dynamic Island inovatif, kamera utama 48 MP super tajam, dan port USB-C universal dalam desain kaca bagian belakang yang diwarnai secara menyeluruh.',
    15,
    '{"screen": "6.1 Super Retina XDR OLED HDR10", "storage": "128GB / 256GB", "chipset": "Apple A16 Bionic (4 nm)", "network": "5G Ready", "battery": "3349 mAh"}',
    false,
    true,
    ARRAY[
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop'
    ]
),
(
    'f6666666-ffff-ffff-ffff-ffffffffffff',
    '22222222-2222-2222-2222-222222222222',
    'Samsung Galaxy S23',
    'samsung-galaxy-s23',
    'Performa kencang Snapdragon 8 Gen 2 for Galaxy dengan kamera malam Nightography memukau dan baterai tahan seharian.',
    20,
    '{"screen": "6.1 Dynamic AMOLED 2X 120Hz", "storage": "128GB / 256GB", "chipset": "Snapdragon 8 Gen 2", "network": "5G Ready", "battery": "3900 mAh"}',
    false,
    true,
    ARRAY[
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop'
    ]
),
(
    '17777777-1777-1777-1777-177777777777',
    '33333333-3333-3333-3333-333333333333',
    'Google Pixel 8',
    'google-pixel-8',
    'Fitur AI foto canggih seperti Best Take dan Magic Audio Eraser dengan pembaruan software 7 tahun terjamin dari Google.',
    10,
    '{"screen": "6.2 Actua OLED 120Hz", "storage": "128GB / 256GB", "chipset": "Google Tensor G3", "network": "5G Ready", "battery": "4575 mAh"}',
    false,
    true,
    ARRAY[
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop'
    ]
),
(
    '28888888-2888-2888-2888-288888888888',
    '44444444-4444-4444-4444-444444444444',
    'OnePlus Nord 3',
    'oneplus-nord-3',
    'Flagship killer dengan MediaTek Dimensity 9000, kamera Sony IMX890 OIS, dan layar Super Fluid AMOLED 120Hz.',
    12,
    '{"screen": "6.74 Super Fluid AMOLED 120Hz", "storage": "256GB", "chipset": "MediaTek Dimensity 9000", "network": "5G Ready", "battery": "5000 mAh 80W"}',
    false,
    true,
    ARRAY[
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=800&auto=format&fit=crop'
    ]
)
ON CONFLICT (id) DO NOTHING;

-- 6.4 Seed Product Variants
INSERT INTO public.product_variants (product_id, color_name, color_hex, storage, price, stock)
VALUES
-- iPhone 16 Pro Variants
('a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Titanium Black', '#2F3032', '128GB', 20999000, 15),
('a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Titanium White', '#F2F1ED', '256GB', 23999000, 10),
('a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Desert Titanium', '#C5B5A5', '256GB', 23999000, 8),
('a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Titanium Natural', '#9A958E', '512GB', 27999000, 5),

-- Samsung Galaxy S24 Variants
('b2222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Onyx Black', '#1C1C1C', '256GB', 13999000, 12),
('b2222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Marble Gray', '#C8C9CE', '256GB', 13999000, 9),
('b2222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Cobalt Violet', '#4B4254', '512GB', 15999000, 6),

-- Google Pixel 9 Variants
('c3333333-cccc-cccc-cccc-cccccccccccc', 'Obsidian', '#1F2022', '128GB', 14499000, 8),
('c3333333-cccc-cccc-cccc-cccccccccccc', 'Porcelain', '#F2EFEB', '256GB', 16499000, 7),

-- OnePlus 12 Variants
('d4444444-dddd-dddd-dddd-dddddddddddd', 'Silky Black', '#181818', '256GB', 12999000, 10),
('d4444444-dddd-dddd-dddd-dddddddddddd', 'Flowy Emerald', '#1A3F38', '512GB', 14999000, 5),

-- iPhone 15 Variants
('e5555555-eeee-eeee-eeee-eeeeeeeeeeee', 'Black', '#2D2D2D', '128GB', 14249000, 14),
('e5555555-eeee-eeee-eeee-eeeeeeeeeeee', 'Blue', '#D4E0E8', '128GB', 14249000, 11),
('e5555555-eeee-eeee-eeee-eeeeeeeeeeee', 'Pink', '#FAD8D9', '256GB', 16999000, 8),

-- Samsung S23 Variants
('f6666666-ffff-ffff-ffff-ffffffffffff', 'Phantom Black', '#232323', '128GB', 10399000, 7),
('f6666666-ffff-ffff-ffff-ffffffffffff', 'Cream', '#F3EFE0', '256GB', 11999000, 5),

-- Google Pixel 8 Variants
('17777777-1777-1777-1777-177777777777', 'Obsidian', '#222222', '128GB', 10799000, 6),

-- OnePlus Nord 3 Variants
('28888888-2888-2888-2888-288888888888', 'Tempest Gray', '#3B3D40', '256GB', 6150000, 12)
ON CONFLICT DO NOTHING;

-- 6.5 Seed Trade-In Rules
INSERT INTO public.trade_in_rules (brand_name, model_name, storage, base_value, condition_multipliers)
VALUES
('Apple', 'iPhone 15 Pro', '128GB', 12500000, '{"mulus": 1.0, "lecet_halus": 0.85, "minus_fisik": 0.65}'::jsonb),
('Apple', 'iPhone 15 Pro', '256GB', 13800000, '{"mulus": 1.0, "lecet_halus": 0.85, "minus_fisik": 0.65}'::jsonb),
('Apple', 'iPhone 14 Pro', '128GB', 9500000, '{"mulus": 1.0, "lecet_halus": 0.85, "minus_fisik": 0.65}'::jsonb),
('Apple', 'iPhone 14', '128GB', 7200000, '{"mulus": 1.0, "lecet_halus": 0.85, "minus_fisik": 0.65}'::jsonb),
('Apple', 'iPhone 13', '128GB', 5800000, '{"mulus": 1.0, "lecet_halus": 0.85, "minus_fisik": 0.65}'::jsonb),
('Samsung', 'Galaxy S23 Ultra', '256GB', 11000000, '{"mulus": 1.0, "lecet_halus": 0.85, "minus_fisik": 0.65}'::jsonb),
('Samsung', 'Galaxy S23', '128GB', 6500000, '{"mulus": 1.0, "lecet_halus": 0.85, "minus_fisik": 0.65}'::jsonb),
('Samsung', 'Galaxy S22', '128GB', 4800000, '{"mulus": 1.0, "lecet_halus": 0.85, "minus_fisik": 0.65}'::jsonb),
('Google', 'Pixel 8 Pro', '128GB', 8000000, '{"mulus": 1.0, "lecet_halus": 0.85, "minus_fisik": 0.65}'::jsonb),
('OnePlus', 'OnePlus 11', '256GB', 6200000, '{"mulus": 1.0, "lecet_halus": 0.85, "minus_fisik": 0.65}'::jsonb)
ON CONFLICT DO NOTHING;

-- 6.6 Seed Sample IMEI Warranties
INSERT INTO public.imei_warranties (imei_number, order_number, customer_name, product_name, variant_info, purchase_date, warranty_end_date, warranty_type, status)
VALUES
('358912345678901', 'JC-20261120-0001', 'Ahmad Pratama', 'iPhone 16 Pro', 'Titanium Black / 128GB', '2026-11-20', '2027-11-20', 'Garansi Resmi', 'active'),
('357892345678902', 'JC-20261121-0002', 'Budi Santoso', 'Samsung Galaxy S24', 'Onyx Black / 256GB', '2026-11-21', '2027-11-21', 'Garansi Resmi', 'active'),
('356782345678903', 'JC-20251015-0005', 'Citra Dewi', 'iPhone 15', 'Pink / 256GB', '2025-10-15', '2026-10-15', 'Garansi Toko Jaya Cell', 'expired')
ON CONFLICT (imei_number) DO NOTHING;

