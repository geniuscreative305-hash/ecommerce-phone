import { createClient } from '@supabase/supabase-js';

/**
 * Server-Only Admin Supabase Client
 * Uses SUPABASE_SERVICE_ROLE_KEY for privileged operations (bypassing RLS safely on server)
 * NEVER expose this client to the browser.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-jaya-cell.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

