'use server';

import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase/admin';

// Verify 3-gate admin session
function verifyAdminSession(): boolean {
  const cookie = cookies().get('admin_session')?.value;
  return cookie === 'authenticated';
}

export async function getAuditLogsAction() {
  if (!verifyAdminSession()) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('admin_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, logs: data || [] };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function exportBackupJsonAction() {
  if (!verifyAdminSession()) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const [
      { data: products },
      { data: variants },
      { data: orders },
      { data: orderItems },
      { data: imeiWarranties },
      { data: siteSettings },
      { data: auditLogs },
    ] = await Promise.all([
      supabaseAdmin.from('products').select('*'),
      supabaseAdmin.from('product_variants').select('*'),
      supabaseAdmin.from('orders').select('*'),
      supabaseAdmin.from('order_items').select('*'),
      supabaseAdmin.from('imei_warranties').select('*'),
      supabaseAdmin.from('site_settings').select('*'),
      supabaseAdmin.from('admin_audit_logs').select('*').limit(500),
    ]);

    const backupSnapshot = {
      app: 'Jaya Cell',
      exported_at: new Date().toISOString(),
      version: '2.0.0-enterprise',
      data: {
        products: products || [],
        product_variants: variants || [],
        orders: orders || [],
        order_items: orderItems || [],
        imei_warranties: imeiWarranties || [],
        site_settings: siteSettings || [],
        admin_audit_logs: auditLogs || [],
      },
    };

    return {
      success: true,
      jsonData: JSON.stringify(backupSnapshot, null, 2),
      filename: `jaya-cell-backup-${new Date().toISOString().slice(0, 10)}.json`,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function exportTableCsvAction(tableName: string) {
  if (!verifyAdminSession()) {
    return { success: false, error: 'Unauthorized' };
  }

  const allowedTables = ['products', 'orders', 'imei_warranties', 'site_settings', 'admin_audit_logs'];
  if (!allowedTables.includes(tableName)) {
    return { success: false, error: 'Tabel tidak diizinkan untuk diekspor.' };
  }

  try {
    const { data, error } = await supabaseAdmin.from(tableName).select('*').limit(1000);
    if (error || !data || data.length === 0) {
      return { success: false, error: 'Tidak ada data pada tabel ini.' };
    }

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = headers.map((header) => {
        const val = row[header];
        if (val === null || val === undefined) return '""';
        const stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
        const escaped = stringVal.replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    return {
      success: true,
      csvData: csvRows.join('\n'),
      filename: `jaya-cell-${tableName}-${new Date().toISOString().slice(0, 10)}.csv`,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

