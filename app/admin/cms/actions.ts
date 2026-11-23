'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function saveSiteSettings(sectionKey: string, contentJson: any) {
  try {
    const supabase = createClient();

    // Validate inputs
    if (!sectionKey || contentJson === undefined || contentJson === null) {
      return { success: false, error: 'Section key atau data kosong.' };
    }

    const { error } = await supabase.from('site_settings').upsert(
      {
        section_key: sectionKey,
        content_json: contentJson,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'section_key' }
    );

    if (error) {
      console.error('[saveSiteSettings] Supabase upsert error:', error.message, error.details);
      return {
        success: false,
        error: `Database error: ${error.message}. Pastikan tabel site_settings sudah dibuat via schema.sql di Supabase SQL Editor.`,
      };
    }

    // Trigger full route re-render on homepage
    revalidatePath('/', 'layout');
    revalidatePath('/');

    return { success: true };
  } catch (err: any) {
    console.error('[saveSiteSettings] unexpected error:', err);
    return { success: false, error: err.message || 'Terjadi kesalahan tidak terduga.' };
  }
}
