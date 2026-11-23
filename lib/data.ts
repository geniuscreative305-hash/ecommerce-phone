import { createClient } from '@/lib/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';
import {
  BrandIdentity,
  HeroBanner,
  PromoBanner,
  StoreUSPItem,
  NewsletterBanner,
  FooterInfo,
  Brand,
  Product,
  TradeInRule,
} from '@/types';
import {
  DEFAULT_BRAND_IDENTITY,
  DEFAULT_HERO_BANNER,
  DEFAULT_PROMO_BANNER,
  DEFAULT_STORE_USP,
  DEFAULT_NEWSLETTER,
  DEFAULT_FOOTER_INFO,
  DEFAULT_BRANDS,
  DEFAULT_PRODUCTS,
  DEFAULT_TRADE_IN_RULES,
} from '@/lib/constants';

export {
  DEFAULT_BRAND_IDENTITY,
  DEFAULT_HERO_BANNER,
  DEFAULT_PROMO_BANNER,
  DEFAULT_STORE_USP,
  DEFAULT_NEWSLETTER,
  DEFAULT_FOOTER_INFO,
  DEFAULT_BRANDS,
  DEFAULT_PRODUCTS,
  DEFAULT_TRADE_IN_RULES,
};

export async function getSiteSettings(): Promise<{
  brandIdentity: BrandIdentity;
  heroBanner: HeroBanner;
  promoBanner: PromoBanner;
  storeUSP: StoreUSPItem[];
  newsletterBanner: NewsletterBanner;
  footerInfo: FooterInfo;
}> {
  // Force no-cache: always fetch fresh from Supabase on every request
  noStore();
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('site_settings').select('*');

    if (error || !data || data.length === 0) {
      return {
        brandIdentity: DEFAULT_BRAND_IDENTITY,
        heroBanner: DEFAULT_HERO_BANNER,
        promoBanner: DEFAULT_PROMO_BANNER,
        storeUSP: DEFAULT_STORE_USP,
        newsletterBanner: DEFAULT_NEWSLETTER,
        footerInfo: DEFAULT_FOOTER_INFO,
      };
    }

    const map = new Map<string, any>();
    data.forEach((row) => map.set(row.section_key, row.content_json));

    return {
      brandIdentity: map.get('brand_identity') || DEFAULT_BRAND_IDENTITY,
      heroBanner: map.get('hero_banner') || DEFAULT_HERO_BANNER,
      promoBanner: map.get('promo_banner') || DEFAULT_PROMO_BANNER,
      storeUSP: map.get('store_usp') || DEFAULT_STORE_USP,
      newsletterBanner: map.get('newsletter_banner') || DEFAULT_NEWSLETTER,
      footerInfo: map.get('footer_info') || DEFAULT_FOOTER_INFO,
    };
  } catch {
    return {
      brandIdentity: DEFAULT_BRAND_IDENTITY,
      heroBanner: DEFAULT_HERO_BANNER,
      promoBanner: DEFAULT_PROMO_BANNER,
      storeUSP: DEFAULT_STORE_USP,
      newsletterBanner: DEFAULT_NEWSLETTER,
      footerInfo: DEFAULT_FOOTER_INFO,
    };
  }
}

export async function getBrands(): Promise<Brand[]> {
  noStore();
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_BRANDS;
    }
    return data;
  } catch {
    return DEFAULT_BRANDS;
  }
}

export async function getProducts(): Promise<Product[]> {
  noStore();
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, variants:product_variants(*), brand:brands(*)')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return DEFAULT_PRODUCTS;
    }
    return data;
  } catch {
    return DEFAULT_PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, variants:product_variants(*), brand:brands(*)')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      const fallback = DEFAULT_PRODUCTS.find((p) => p.slug === slug);
      return fallback || null;
    }
    return data;
  } catch {
    const fallback = DEFAULT_PRODUCTS.find((p) => p.slug === slug);
    return fallback || null;
  }
}

export async function getTradeInRules(): Promise<TradeInRule[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('trade_in_rules').select('*');

    if (error || !data || data.length === 0) {
      return DEFAULT_TRADE_IN_RULES;
    }
    return data;
  } catch {
    return DEFAULT_TRADE_IN_RULES;
  }
}
