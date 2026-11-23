'use client';

import React, { useState } from 'react';
import AdminTopBar from '@/components/admin/AdminTopBar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Menu } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* WordPress Sticky Top Admin Bar */}
      <AdminTopBar />

      <div className="flex-1 flex">
        {/* Mobile menu toggle floating strip */}
        <div className="md:hidden bg-slate-800 text-white p-2 flex items-center justify-between w-full fixed top-12 z-30">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="flex items-center gap-2 text-xs font-bold px-2 py-1 bg-slate-700 rounded"
          >
            <Menu className="w-4 h-4" />
            <span>Menu Admin</span>
          </button>
          <span className="text-xs text-slate-300 font-semibold">Jaya Cell Backoffice</span>
        </div>

        {/* Responsive Left Sidebar (240px) */}
        <AdminSidebar
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-auto mt-8 md:mt-0">
          {children}
        </main>
      </div>
    </div>
  );
}

