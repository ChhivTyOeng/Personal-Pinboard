import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { IconAlertTriangle, IconTool, IconShield, IconRefresh, IconLogout } from '@tabler/icons-react';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import { useAuth } from '../../hooks/useAuth';
import { useSettings } from '../../context/SettingsContext';
import { toast } from '../../context/ToastContext';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { settings, updateSettings } = useSettings();
  const navigate = useNavigate();

  const isMaintenance = settings?.maintenance_mode === true;

  const handleDisableMaintenance = async () => {
    try {
      await updateSettings({ maintenance_mode: false });
      toast.success('Maintenance mode disabled. System unlocked for all users.');
    } catch (e) {
      toast.error('Failed to disable maintenance mode');
    }
  };

  // If maintenance mode is active and user is NOT an admin, render the maintenance lockout screen
  if (isMaintenance && !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-center">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl p-8 space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/60 text-brand-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200/80 dark:border-rose-900/60 shadow-xs">
            <IconTool size={32} stroke={2.2} />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-brand-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/60">
              <IconAlertTriangle size={12} /> System Lockdown
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Under Maintenance
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Pinboard is temporarily offline for scheduled system upgrades and database maintenance.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400">
            Platform access is temporarily restricted to administrators. We appreciate your patience!
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <IconRefresh size={15} />
              <span>Check Again</span>
            </button>

            {user ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <IconLogout size={15} />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5"
              >
                <IconShield size={15} />
                <span>Admin Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* Admin Maintenance Notice Banner */}
      {isMaintenance && isAdmin && (
        <div className="bg-rose-500 text-white text-xs font-bold px-4 py-2 flex items-center justify-between shadow-xs sticky top-0 z-40">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <IconAlertTriangle size={16} className="shrink-0" />
            <span>
              <strong>Maintenance Mode Active</strong> — Non-administrator users are locked out of the platform.
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={handleDisableMaintenance}
              className="px-3 py-1 rounded-full bg-white text-rose-600 hover:bg-rose-50 text-[11px] font-black transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Disable Maintenance Mode
            </button>
            <Link
              to="/admin/settings"
              className="px-3 py-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold border border-white/20 transition-all"
            >
              Settings
            </Link>
          </div>
        </div>
      )}

      <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex-1 flex items-start max-w-7xl w-full mx-auto bg-slate-50 dark:bg-slate-950">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 min-w-0 min-h-[calc(100dvh-4rem)] p-3.5 sm:p-6 lg:p-8 pb-24 sm:pb-8 bg-slate-50 dark:bg-slate-950">
          <Outlet />
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
