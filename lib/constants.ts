import {
  BrandIdentity,
  HeroBanner,
  PromoBanner,
  StoreUSPItem,
  NewsletterBanner,
  FooterInfo,
  PaymentSettings,
  Brand,
  Product,
  TradeInRule,
} from '@/types';

export const DEFAULT_BRAND_IDENTITY: BrandIdentity = {
  brand_name: 'Jaya Cell',
  tagline: 'Pusat Smartphone Resmi & Tukar Tambah Terpercaya',
  logo_url: '',
  favicon_url: '',
  phone: '+62 812-3456-7890',
  email: 'halo@jayacell.id',
  address: 'Jl. Gajah Mada No. 88, Menteng, Jakarta Pusat',
  instagram: 'jayacell.id',
};

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  qris_image_url: '',
  bank_name: 'BCA (Bank Central Asia)',
  bank_account_number: '8830-1234-5678',
  bank_account_holder: 'JAYA CELL INDONESIA',
  payment_instructions: 'Silakan transfer tepat sesuai total nominal dan konfirmasi via WhatsApp atau cek status pesanan berkala.',
};

export const DEFAULT_HERO_BANNER: HeroBanner = {
  tag: 'NEW ARRIVAL',
  headline: 'iPhone 16 Pro',
  subheadline:
    'More Power. More Possibilities. Temukan kekuatan chip A18 Pro dengan kamera tercanggih dan daya tahan baterai superior.',
  cta_text: 'Shop Now',
  cta_link: '/product/iphone-16-pro',
  badge_highlight: 'Garansi Resmi iBox / GDN 1 Tahun',
  hero_image:
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1200&auto=format&fit=crop',
};

export const DEFAULT_PROMO_BANNER: PromoBanner = {
  tag: 'LIMITED TIME OFFER',
  title: 'Diskon Hingga 30%',
  subtitle:
    'Untuk Smartphone Flagship & Mid-Range Pilihan. Tukar tambah HP lamamu sekarang juga dengan nilai taksir tertinggi!',
  cta_text: 'Lihat Promo',
  cta_link: '/shop?promo=deals',
  promo_image:
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1000&auto=format&fit=crop',
};

export const DEFAULT_STORE_USP: StoreUSPItem[] = [
  {
    icon: 'ShieldCheck',
    title: 'Garansi Resmi 100%',
    desc: 'Unit resmi TAM, iBox, SEIN & Garansi Toko Terjamin',
  },
  {
    icon: 'CreditCard',
    title: 'Pembayaran Aman',
    desc: 'Transfer Bank, Virtual Account, QRIS & Cicilan 0%',
  },
  {
    icon: 'Headphones',
    title: 'CS & Konsultasi Cepat',
    desc: 'Dukungan teknis ramah dan bantuan klaim garansi kilat',
  },
  {
    icon: 'RefreshCw',
    title: 'Tukar Tambah Mudah',
    desc: 'Taksir instan di web atau langsung di konter fisik',
  },
];

export const DEFAULT_NEWSLETTER: NewsletterBanner = {
  title: 'Tetap Terhubung dengan Jaya Cell',
  subtitle:
    'Dapatkan info promo flash sale eksklusif, cashback tukar tambah, dan peluncuran seri smartphone terbaru langsung ke WhatsApp Anda.',
  whatsapp_cta: 'Chat CS WhatsApp',
};

export const DEFAULT_FOOTER_INFO: FooterInfo = {
  about:
    'Jaya Cell adalah pusat ritel dan distributor smartphone resmi terpercaya. Melayani pembelian online se-Indonesia dan konter fisik dengan jaminan garansi resmi dan kemudahan tukar tambah.',
  opening_hours: 'Senin - Minggu: 09:00 - 21:30 WIB',
  copyright: '© 2026 Jaya Cell Smartphone Retail & POS. All Rights Reserved.',
};

export const DEFAULT_BRANDS: Brand[] = [
  { id: '1', name: 'Apple', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', is_active: true, sort_order: 1 },
  { id: '2', name: 'Samsung', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', is_active: true, sort_order: 2 },
  { id: '3', name: 'Google', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', is_active: true, sort_order: 3 },
  { id: '4', name: 'OnePlus', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/OnePlus_logo_2020.svg/512px-OnePlus_logo_2020.svg.png', is_active: true, sort_order: 4 },
  { id: '5', name: 'Xiaomi', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Xiaomi_logo_%282021-%29.svg/512px-Xiaomi_logo_%282021-%29.svg.png', is_active: true, sort_order: 5 },
  { id: '6', name: 'realme', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Realme_logo.svg/512px-Realme_logo.svg.png', is_active: true, sort_order: 6 },
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'p1',
    brand_id: '1',
    name: 'iPhone 16 Pro',
    slug: 'iphone-16-pro',
    description: 'Titanium Grade 5, Chip Apple A18 Pro, Camera Control Button & Apple Intelligence.',
    discount_percent: 0,
    specs_json: {
      screen: '6.3 Super Retina XDR OLED 120Hz ProMotion',
      storage: '128GB / 256GB / 512GB',
      chipset: 'Apple A18 Pro',
      network: '5G Ready',
      battery: 'Hingga 27 jam video',
    },
    is_popular: true,
    is_best_deal: false,
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop'],
    created_at: new Date().toISOString(),
    variants: [
      { id: 'v1', product_id: 'p1', color_name: 'Titanium Black', color_hex: '#2F3032', storage: '128GB', price: 20999000, stock: 15 },
      { id: 'v2', product_id: 'p1', color_name: 'Desert Titanium', color_hex: '#C5B5A5', storage: '256GB', price: 23999000, stock: 8 },
      { id: 'v3', product_id: 'p1', color_name: 'Titanium Natural', color_hex: '#9A958E', storage: '512GB', price: 27999000, stock: 5 },
    ],
  },
  {
    id: 'p2',
    brand_id: '2',
    name: 'Samsung Galaxy S24',
    slug: 'samsung-galaxy-s24',
    description: 'Galaxy AI terdepan dengan Dynamic AMOLED 2X dan Armor Aluminum body.',
    discount_percent: 10,
    specs_json: {
      screen: '6.2 Dynamic AMOLED 2X 120Hz',
      storage: '256GB / 512GB',
      chipset: 'Exynos 2400 / Snapdragon 8 Gen 3',
      network: '5G Ready',
      battery: '4000 mAh',
    },
    is_popular: true,
    is_best_deal: false,
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop'],
    created_at: new Date().toISOString(),
    variants: [
      { id: 'v4', product_id: 'p2', color_name: 'Onyx Black', color_hex: '#1C1C1C', storage: '256GB', price: 13999000, stock: 12 },
      { id: 'v5', product_id: 'p2', color_name: 'Cobalt Violet', color_hex: '#4B4254', storage: '512GB', price: 15999000, stock: 6 },
    ],
  },
  {
    id: 'p3',
    brand_id: '3',
    name: 'Google Pixel 9',
    slug: 'google-pixel-9',
    description: 'AI Tercerdas dari Google Tensor G4 dengan kamera naturalistik tak tertandingi.',
    discount_percent: 0,
    specs_json: {
      screen: '6.3 Actua OLED 120Hz',
      storage: '128GB / 256GB',
      chipset: 'Google Tensor G4',
      network: '5G Ready',
      battery: '4700 mAh',
    },
    is_popular: true,
    is_best_deal: false,
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop'],
    created_at: new Date().toISOString(),
    variants: [
      { id: 'v6', product_id: 'p3', color_name: 'Obsidian', color_hex: '#1F2022', storage: '128GB', price: 14499000, stock: 8 },
      { id: 'v7', product_id: 'p3', color_name: 'Porcelain', color_hex: '#F2EFEB', storage: '256GB', price: 16499000, stock: 7 },
    ],
  },
  {
    id: 'p4',
    brand_id: '4',
    name: 'OnePlus 12',
    slug: 'oneplus-12',
    description: 'Snapdragon 8 Gen 3, Kamera Hasselblad Generasi ke-4, dan baterai 5400 mAh 100W.',
    discount_percent: 0,
    specs_json: {
      screen: '6.82 ProXDR AMOLED 120Hz',
      storage: '256GB / 512GB',
      chipset: 'Snapdragon 8 Gen 3',
      network: '5G Ready',
      battery: '5400 mAh 100W',
    },
    is_popular: true,
    is_best_deal: false,
    images: ['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=800&auto=format&fit=crop'],
    created_at: new Date().toISOString(),
    variants: [
      { id: 'v8', product_id: 'p4', color_name: 'Silky Black', color_hex: '#181818', storage: '256GB', price: 12999000, stock: 10 },
      { id: 'v9', product_id: 'p4', color_name: 'Flowy Emerald', color_hex: '#1A3F38', storage: '512GB', price: 14999000, stock: 5 },
    ],
  },
  {
    id: 'p5',
    brand_id: '1',
    name: 'iPhone 15',
    slug: 'iphone-15',
    description: 'Dynamic Island, kamera 48 MP, USB-C dengan desain kaca belakang premium.',
    discount_percent: 15,
    specs_json: {
      screen: '6.1 Super Retina XDR OLED',
      storage: '128GB / 256GB',
      chipset: 'Apple A16 Bionic',
      network: '5G Ready',
      battery: '3349 mAh',
    },
    is_popular: false,
    is_best_deal: true,
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop'],
    created_at: new Date().toISOString(),
    variants: [
      { id: 'v10', product_id: 'p5', color_name: 'Black', color_hex: '#2D2D2D', storage: '128GB', price: 14249000, stock: 14 },
      { id: 'v11', product_id: 'p5', color_name: 'Blue', color_hex: '#D4E0E8', storage: '128GB', price: 14249000, stock: 11 },
    ],
  },
  {
    id: 'p6',
    brand_id: '2',
    name: 'Samsung Galaxy S23',
    slug: 'samsung-galaxy-s23',
    description: 'Flagship compact tangguh Snapdragon 8 Gen 2 for Galaxy dan Nightography.',
    discount_percent: 20,
    specs_json: {
      screen: '6.1 Dynamic AMOLED 2X 120Hz',
      storage: '128GB / 256GB',
      chipset: 'Snapdragon 8 Gen 2',
      network: '5G Ready',
      battery: '3900 mAh',
    },
    is_popular: false,
    is_best_deal: true,
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=800&auto=format&fit=crop'],
    created_at: new Date().toISOString(),
    variants: [
      { id: 'v12', product_id: 'p6', color_name: 'Phantom Black', color_hex: '#232323', storage: '128GB', price: 10399000, stock: 7 },
      { id: 'v13', product_id: 'p6', color_name: 'Cream', color_hex: '#F3EFE0', storage: '256GB', price: 11999000, stock: 5 },
    ],
  },
  {
    id: 'p7',
    brand_id: '3',
    name: 'Google Pixel 8',
    slug: 'google-pixel-8',
    description: 'Best Take & Magic Eraser canggih dengan update sistem Google 7 tahun.',
    discount_percent: 10,
    specs_json: {
      screen: '6.2 Actua OLED 120Hz',
      storage: '128GB / 256GB',
      chipset: 'Google Tensor G3',
      network: '5G Ready',
      battery: '4575 mAh',
    },
    is_popular: false,
    is_best_deal: true,
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop'],
    created_at: new Date().toISOString(),
    variants: [
      { id: 'v14', product_id: 'p7', color_name: 'Obsidian', color_hex: '#222222', storage: '128GB', price: 10799000, stock: 6 },
    ],
  },
  {
    id: 'p8',
    brand_id: '4',
    name: 'OnePlus Nord 3',
    slug: 'oneplus-nord-3',
    description: 'MediaTek Dimensity 9000, kamera Sony IMX890 OIS & layar 120Hz Super Fluid.',
    discount_percent: 12,
    specs_json: {
      screen: '6.74 Super Fluid AMOLED 120Hz',
      storage: '256GB',
      chipset: 'MediaTek Dimensity 9000',
      network: '5G Ready',
      battery: '5000 mAh 80W',
    },
    is_popular: false,
    is_best_deal: true,
    images: ['https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=800&auto=format&fit=crop'],
    created_at: new Date().toISOString(),
    variants: [
      { id: 'v15', product_id: 'p8', color_name: 'Tempest Gray', color_hex: '#3B3D40', storage: '256GB', price: 6150000, stock: 12 },
    ],
  },
];

export const DEFAULT_TRADE_IN_RULES: TradeInRule[] = [
  { id: 'tr1', brand_name: 'Apple', model_name: 'iPhone 15 Pro', storage: '128GB', base_value: 12500000, condition_multipliers: { mulus: 1.0, lecet_halus: 0.85, minus_fisik: 0.65 } },
  { id: 'tr2', brand_name: 'Apple', model_name: 'iPhone 15 Pro', storage: '256GB', base_value: 13800000, condition_multipliers: { mulus: 1.0, lecet_halus: 0.85, minus_fisik: 0.65 } },
  { id: 'tr3', brand_name: 'Apple', model_name: 'iPhone 14 Pro', storage: '128GB', base_value: 9500000, condition_multipliers: { mulus: 1.0, lecet_halus: 0.85, minus_fisik: 0.65 } },
  { id: 'tr4', brand_name: 'Apple', model_name: 'iPhone 14', storage: '128GB', base_value: 7200000, condition_multipliers: { mulus: 1.0, lecet_halus: 0.85, minus_fisik: 0.65 } },
  { id: 'tr5', brand_name: 'Apple', model_name: 'iPhone 13', storage: '128GB', base_value: 5800000, condition_multipliers: { mulus: 1.0, lecet_halus: 0.85, minus_fisik: 0.65 } },
  { id: 'tr6', brand_name: 'Samsung', model_name: 'Galaxy S23 Ultra', storage: '256GB', base_value: 11000000, condition_multipliers: { mulus: 1.0, lecet_halus: 0.85, minus_fisik: 0.65 } },
  { id: 'tr7', brand_name: 'Samsung', model_name: 'Galaxy S23', storage: '128GB', base_value: 6500000, condition_multipliers: { mulus: 1.0, lecet_halus: 0.85, minus_fisik: 0.65 } },
  { id: 'tr8', brand_name: 'Google', model_name: 'Pixel 8 Pro', storage: '128GB', base_value: 8000000, condition_multipliers: { mulus: 1.0, lecet_halus: 0.85, minus_fisik: 0.65 } },
];

