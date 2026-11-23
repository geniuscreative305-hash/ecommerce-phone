'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function saveSiteSettings(sectionKey: string, contentJson: any) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from('site_settings').upsert(
      {
        section_key: sectionKey,
        content_json: contentJson,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'section_key' }
    );

    if (error) {
      console.warn('Supabase upsert warning:', error.message);
    }

    // Trigger instant storefront revalidation across entire layout
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

