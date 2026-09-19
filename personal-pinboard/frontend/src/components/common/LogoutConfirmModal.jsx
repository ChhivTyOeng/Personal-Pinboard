import React from 'react';
import { Modal, Avatar } from '@mantine/core';
import { IconLogout, IconX, IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { useAuth } from '../../hooks/useAuth';

export default function LogoutConfirmModal({ opened, onClose, onConfirm, loading = false }) {
  const { user } = useAuth();
  const isGuest = user?.username === 'explorer' || !user?.id;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      centered
      size="sm"
      radius="28px"
      padding={0}
      zIndex={1000}
      overlayProps={{
        backgroundOpacity: 0.6,
        blur: 4,
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
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <IconX size={18} />
        </button>

        {/* Modal Icon Badge */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 flex items-center justify-center text-red-600 dark:text-red-400 mb-4 shadow-2xs">
            <IconLogout size={28} className="translate-x-0.5" />
          </div>

          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Do you want to log out or stay?
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed max-w-xs">
            Choose whether you want to stay logged in to keep your session active, or log out of your account.
          </p>

          {/* User preview badge */}
          {user && (
            <div className="w-full my-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-3 text-left">
              <Avatar
                src={user.avatar_url}
                size={38}
                radius="xl"
                className="ring-2 ring-white dark:ring-slate-800 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user.full_name || user.username || 'Explorer User'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {user.email || (isGuest ? 'Explorer Mode Session' : 'Active Account')}
                </p>
              </div>
              {isGuest && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  Guest
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 h-11 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200/80 dark:border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
            >
              <IconCheck size={16} stroke={2.5} className="text-emerald-600 dark:text-emerald-400" />
              <span>Stay Logged In</span>
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 h-11 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
            >
              <IconLogout size={16} stroke={2.2} />
              <span>{loading ? 'Logging out...' : 'Log Out'}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
