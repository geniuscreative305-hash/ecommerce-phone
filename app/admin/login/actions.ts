'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function loginAdmin(formData: FormData) {
  const email = (formData.get('email') as string)?.trim();
  const password = (formData.get('password') as string)?.trim();

  if (!email || !password) {
    return { success: false, error: 'Email dan kata sandi wajib diisi.' };
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // If user not yet created in Supabase Auth, verify against default admin credential
      if (email.toLowerCase() === 'admin@jayacell.id' && password === 'AdminJayaCell2026!') {
        cookies().set('admin_session', 'authenticated', {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          sameSite: 'lax',
        });
        return { success: true };
      }
      return { success: false, error: 'Email atau kata sandi tidak sesuai.' };
    }

    // Supabase auth succeeded
    cookies().set('admin_session', 'authenticated', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });
    return { success: true };
  } catch {
    // Master fallback
    if (email.toLowerCase() === 'admin@jayacell.id' && password === 'AdminJayaCell2026!') {
      cookies().set('admin_session', 'authenticated', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
      });
      return { success: true };
    }
    return { success: false, error: 'Gagal melakukan login. Silakan coba lagi.' };
  }
}

export async function logoutAdmin() {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch {
    // Ignored
  }
  cookies().delete('admin_session');
  redirect('/admin/login');
}

