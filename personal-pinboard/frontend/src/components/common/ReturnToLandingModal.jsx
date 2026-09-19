import React from 'react';
import { Modal, Avatar } from '@mantine/core';
import {
  IconPin,
  IconLogout,
  IconUserCheck,
  IconArrowRight,
  IconX,
  IconShield,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from '../../context/ToastContext';

export default function ReturnToLandingModal({ opened, onClose }) {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const handleStayLoggedIn = () => {
    onClose();
    navigate('/');
    toast.info('Viewing landing page · Your session remains active', 'Still Logged In');
  };

  const handleLogout = () => {
    onClose();
    logout();
    navigate('/');
    toast.success('Logged out successfully. Returned to landing page.', 'Logged Out');
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      centered
      size="md"
      radius="28px"
      padding={0}
      zIndex={1000}
      overlayProps={{
        backgroundOpacity: 0.65,
        blur: 5,
      }}
      styles={{
        content: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
        body: {
          padding: 0,
        },
      }}
    >
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 overflow-hidden text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <IconX size={18} />
        </button>

        {/* Modal Top Brand Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-600/30 mb-3.5 ring-4 ring-rose-100 dark:ring-rose-950/60">
            <IconPin size={26} stroke={2.5} />
          </div>

          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Return to Landing Page
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed max-w-sm">
            You clicked <strong className="text-slate-800 dark:text-slate-200 font-bold">Pinboard.</strong> to go back to the landing page. Decide whether you want to stay logged in or log out.
          </p>

          {/* Current User Snapshot Card */}
          {user && (
            <div className="w-full my-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-3 text-left">
              <Avatar
                src={user.avatar_url}
                size={40}
                radius="xl"
                color="brandRed"
                className="ring-2 ring-white dark:ring-slate-750 shrink-0"
              >
                {(user.full_name || user.username || 'U').charAt(0).toUpperCase()}
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user.full_name || user.username || 'Pinboard User'}
                  </p>
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 border border-brand-200/80 dark:border-brand-900/60">
                      <IconShield size={10} stroke={2.5} /> Admin
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      Logged in
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  @{user.username || 'user'} · {user.email && !user.email.includes('@pinboard.local') ? user.email : 'chhivtyy16@gmail.com'}
                </p>
              </div>
            </div>
          )}

          {/* Decision Cards */}
          <div className="w-full space-y-2.5 mt-1">
            {/* 1. Stay Logged In (Recommended) */}
            <button
              type="button"
              onClick={handleStayLoggedIn}
              className="w-full group p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 shadow-2xs hover:shadow-md transition-all duration-150 flex items-center justify-between gap-3 text-left cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <IconUserCheck size={20} stroke={2.5} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      Stay Logged In
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                      Keep Session
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    Visit landing page while keeping your {isAdmin ? 'Admin Portal' : 'Dashboard & pins'} active.
                  </p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center text-slate-400 group-hover:text-brand-600 group-hover:bg-brand-50 dark:group-hover:bg-brand-950/40 group-hover:translate-x-0.5 transition-all shrink-0">
                <IconArrowRight size={15} stroke={2.5} />
              </div>
            </button>

            {/* 2. Log Out Completely */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full group p-3.5 sm:p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50/80 dark:hover:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 hover:border-rose-300 dark:hover:border-rose-700 shadow-2xs hover:shadow-md transition-all duration-150 flex items-center justify-between gap-3 text-left cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <IconLogout size={20} stroke={2.5} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-black text-rose-700 dark:text-rose-300">
                      Log Out
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300">
                      Sign Out
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    Sign out on this device and return to landing page as a guest.
                  </p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-800/80 flex items-center justify-center text-rose-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all shrink-0">
                <IconArrowRight size={15} stroke={2.5} />
              </div>
            </button>
          </div>

          {/* Cancel button */}
          <button
            type="button"
            onClick={onClose}
            className="mt-4 px-4 py-2 rounded-full text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel · Stay on this page
          </button>
        </div>
      </div>
    </Modal>
  );
}
