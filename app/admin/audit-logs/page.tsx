'use client';

import React, { useState, useEffect } from 'react';
import {
  getAuditLogsAction,
  exportBackupJsonAction,
  exportTableCsvAction,
} from './actions';
import { formatDateIndo } from '@/lib/utils';
import {
  FileText,
  Download,
  Database,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  RefreshCw,
  Clock,
  Terminal,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportingJson, setExportingJson] = useState(false);
  const [exportingCsv, setExportingCsv] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    const res = await getAuditLogsAction();
    if (res.success && res.logs) {
      setLogs(res.logs);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDownloadJson = async () => {
    setExportingJson(true);
    setMessage(null);
    try {
      const res = await exportBackupJsonAction();
      if (res.success && res.jsonData) {
        const blob = new Blob([res.jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = res.filename || 'jaya-cell-backup.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setMessage('Backup database JSON berhasil diunduh ke perangkat Anda!');
      } else {
        setMessage(res.error || 'Gagal mengekspor backup JSON.');
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setExportingJson(false);
    }
  };

  const handleDownloadCsv = async (tableName: string) => {
    setExportingCsv(tableName);
    setMessage(null);
    try {
      const res = await exportTableCsvAction(tableName);
      if (res.success && res.csvData) {
        const blob = new Blob([res.csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = res.filename || `jaya-cell-${tableName}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setMessage(`Ekspor CSV tabel ${tableName} berhasil diunduh!`);
      } else {
        setMessage(res.error || `Gagal mengekspor CSV ${tableName}.`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setExportingCsv(null);
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'FAILED_LOGIN_ALERT':
        return (
          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-extrabold text-[10px] inline-flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            FAILED LOGIN ALERT
          </span>
        );
      case 'ADMIN_LOGIN_SUCCESS':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            LOGIN SUCCESS
          </span>
        );
      case 'UPDATE_PRICE':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[10px]">
            UPDATE PRICE
          </span>
        );
      case 'UPDATE_STOCK':
        return (
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold text-[10px]">
            UPDATE STOCK
          </span>
        );
      case 'DELETE_PRODUCT':
        return (
          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-extrabold text-[10px]">
            DELETE PRODUCT
          </span>
        );
      case 'UPDATE_CMS':
        return (
          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-extrabold text-[10px]">
            UPDATE CMS
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-extrabold text-[10px]">
            {action}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-[#0066FF]" />
            <span>Audit Log & Backup Database</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Jejak audit seluruh mutasi sistem admin, deteksi ancaman login, dan utilitas pencadangan data mandiri.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Status notification */}
      {message && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#0066FF]" />
          <span>{message}</span>
        </div>
      )}

      {/* 1. One-Click Backup Utility Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Database className="w-5 h-5 text-[#0066FF]" />
          <div>
            <h2 className="font-extrabold text-slate-900 text-sm">
              Pencadangan Data Mandiri (1-Click Local Backup)
            </h2>
            <p className="text-[11px] text-slate-400">
              Unduh salinan lengkap database toko ke penyimpanan laptop Anda dalam format JSON atau CSV kapan saja.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* JSON Full Snapshot */}
          <button
            onClick={handleDownloadJson}
            disabled={exportingJson}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50 active:scale-95"
          >
            {exportingJson ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4 text-emerald-400" />
            )}
            <span>Export Full Backup (JSON)</span>
          </button>

          {/* CSV Options */}
          <button
            onClick={() => handleDownloadCsv('products')}
            disabled={exportingCsv !== null}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200 transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV Produk & Stok</span>
          </button>

          <button
            onClick={() => handleDownloadCsv('orders')}
            disabled={exportingCsv !== null}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200 transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV Pesanan (Orders)</span>
          </button>

          <button
            onClick={() => handleDownloadCsv('imei_warranties')}
            disabled={exportingCsv !== null}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200 transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV Garansi IMEI</span>
          </button>

          <button
            onClick={() => handleDownloadCsv('site_settings')}
            disabled={exportingCsv !== null}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200 transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV Pengaturan CMS</span>
          </button>
        </div>
      </div>

      {/* 2. Audit Trail Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-500" />
            <h3 className="font-extrabold text-slate-900 text-sm">
              Riwayat Jejak Audit Admin (100 Aktivitas Terakhir)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {logs.length} entri tercatat
          </span>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-7 h-7 animate-spin text-[#0066FF]" />
            <span className="text-xs font-semibold">Memuat log audit...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Belum ada aktivitas mutasi yang tercatat dalam log audit.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Aksi / Event</th>
                  <th className="py-3 px-4">Pelaku (Admin)</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Entitas & Rincian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {formatDateIndo(log.created_at)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getActionBadge(log.action_type)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-800">
                      {log.admin_email}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-500">
                      {log.ip_address || '127.0.0.1'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate font-mono text-[11px]">
                      {log.details_json
                        ? typeof log.details_json === 'string'
                          ? log.details_json
                          : JSON.stringify(log.details_json)
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

