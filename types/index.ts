export interface BrandIdentity {
  brand_name: string;
  tagline: string;
  logo_url: string;
  favicon_url: string;
  phone: string;
  email: string;
  address: string;
  instagram: string;
}

export interface HeroBanner {
  tag: string;
  headline: string;
  subheadline: string;
  cta_text: string;
  cta_link: string;
  badge_highlight: string;
  hero_image: string;
}

export interface PromoBanner {
  tag: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  promo_image: string;
}

export interface StoreUSPItem {
  icon: string;
  title: string;
  desc: string;
}

export interface NewsletterBanner {
  title: string;
  subtitle: string;
  whatsapp_cta: string;
}

export interface FooterInfo {
  about: string;
  opening_hours: string;
  copyright: string;
}

export interface PaymentSettings {
  qris_image_url: string;
  bank_name: string;
  bank_account_number: string;
  bank_account_holder: string;
  payment_instructions?: string;
}

export interface SiteSetting<T = any> {
  id: number;
  section_key: string;
  content_json: T;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface ProductSpecs {
  screen?: string;
  storage?: string;
  chipset?: string;
  network?: string;
  battery?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  color_name: string;
  color_hex: string;
  storage: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  brand_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  discount_percent: number;
  specs_json: ProductSpecs;
  is_popular: boolean;
  is_best_deal: boolean;
  images: string[];
  created_at: string;
  brand?: Brand;
  variants?: ProductVariant[];
}

export interface TradeInRule {
  id: string;
  brand_name: string;
  model_name: string;
  storage: string;
  base_value: number;
  condition_multipliers: {
    mulus: number;
    lecet_halus: number;
    minus_fisik: number;
  };
}

export interface TradeInInfo {
  rule_id?: string;
  brand_name: string;
  model_name: string;
  storage: string;
  condition: 'mulus' | 'lecet_halus' | 'minus_fisik';
  valuation_amount: number;
}

export interface TrackingLog {
  status: string;
  timestamp: string;
  description: string;
  location?: string;
}

export interface Order {
  id: string;
  order_number: string;
  order_channel: 'online_web' | 'offline_pos';
  customer_name: string;
  customer_phone: string;
  shipping_address: string | null;
  city: string | null;
  postal_code: string | null;
  payment_method: string;
  trade_in_info: TradeInInfo | null;
  trade_in_discount: number;
  total_amount: number;
  status: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  tracking_logs: TrackingLog[];
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  variant_snapshot: string;
  quantity: number;
  price_at_purchase: number;
}

export interface IMEIWarranty {
  id: string;
  imei_number: string;
  order_number: string | null;
  customer_name: string;
  product_name: string;
  variant_info: string;
  purchase_date: string;
  warranty_end_date: string;
  warranty_type: 'Garansi Resmi' | 'Garansi Toko Jaya Cell';
  status: 'active' | 'expired';
}

export interface CartItem {
  productId: string;
  variantId: string;
  productName: string;
  brandName?: string;
  image: string;
  colorName: string;
  colorHex: string;
  storage: string;
  price: number;
  quantity: number;
  maxStock: number;
}

