'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BrandLogo from '@/components/BrandLogo';
import { loginAdmin } from './actions';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, KeyRound, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  // Form input starts 100% EMPTY as requested
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [isMfaStep, setIsMfaStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    if (isMfaStep) {
      formData.append('totpCode', totpCode);
    }

    const result = await loginAdmin(formData);

    if (result.success) {
      if (result.requireMfa) {
        setIsMfaStep(true);
        setLoading(false);
        return;
      }
      const destination = result.adminPath || '/admin';
      router.push(destination);
      router.refresh();
    } else {
      setErrorMsg(result.error || 'Email atau kata sandi tidak sesuai.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        {/* Brand Logo & Heading */}
        <div className="flex flex-col items-center text-center space-y-2">
          <BrandLogo size="lg" theme="light" />
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight pt-2">
            {isMfaStep ? 'Verifikasi Keamanan 2FA (TOTP)' : 'Login CMS & POS Konter'}
          </h1>
          <p className="text-xs text-slate-500">
            {isMfaStep
              ? 'Buka aplikasi Authenticator Anda dan masukkan 6 digit kode keamanan.'
              : 'Masukkan kredensial admin Anda untuk membuka panel toko.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isMfaStep ? (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Email Admin</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email admin..."
                    autoComplete="email"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Kata Sandi</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    autoComplete="current-password"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Kode Authenticator (6-Digit)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="totpCode"
                    maxLength={6}
                    required
                    autoFocus
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Contoh: 123456"
                    className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-mono font-extrabold tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsMfaStep(false);
                  setTotpCode('');
                  setErrorMsg('');
                }}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Kembali ke login sandi</span>
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#0066FF] hover:bg-[#0052cc] text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>
              {loading
                ? 'Memverifikasi...'
                : isMfaStep
                ? 'Verifikasi & Buka Dashboard'
                : 'Lanjut ke Verifikasi 2FA'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-2 text-[11px] text-blue-800">
          <ShieldCheck className="w-4 h-4 text-[#0066FF] flex-shrink-0" />
          <span>Proteksi 3-Gerbang: JWT Session + Whitelist + TOTP MFA</span>
        </div>
      </div>
    </div>
  );
}
