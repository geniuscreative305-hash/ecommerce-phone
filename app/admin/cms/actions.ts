'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getClientIp } from '@/lib/rate-limit';

export async function saveSiteSettings(sectionKey: string, contentJson: any) {
  try {
    const supabase = createClient();
    const reqHeaders = headers();
    const clientIp = getClientIp(reqHeaders);

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

    // Record audit log
    try {
      await supabaseAdmin.from('admin_audit_logs').insert({
        admin_email: 'admin@jayacell.id',
        action_type: 'UPDATE_CMS',
        target_entity: 'site_settings',
        details_json: { sectionKey },
        ip_address: clientIp,
      });
    } catch {}

    // Trigger full route re-render on homepage
    revalidatePath('/', 'layout');
    revalidatePath('/');

    return { success: true };
  } catch (err: any) {
    console.error('[saveSiteSettings] unexpected error:', err);
    return { success: false, error: err.message || 'Terjadi kesalahan tidak terduga.' };
  }
}
