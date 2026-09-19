import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconPin, IconCheck, IconLock, IconEye, IconEyeOff } from '@tabler/icons-react';
import { toast } from '../../context/ToastContext';
import ThemeToggle from '../../components/common/ThemeToggle';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match. Please re-enter.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast.success('Password updated successfully!');
      setTimeout(() => navigate('/login'), 1500);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-brand-50/40 via-[#FAFAFA] to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[420px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 sm:p-8 text-center transition-all">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3 transition-transform hover:scale-105 duration-200">
            <div className="w-12 h-12 rounded-full bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-600/25">
              <IconPin size={26} stroke={2.4} />
            </div>
          </Link>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            New Password
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create a secure password to protect your pinboard
          </p>
        </div>

        {success ? (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 text-left mb-6">
            <IconCheck size={18} className="shrink-0 text-emerald-600" />
            <span>Password updated successfully! Redirecting to login...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <IconLock size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 pl-10 pr-10 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <IconLock size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Re-enter new password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-10 pl-10 pr-10 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-xs hover:shadow-sm active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading && (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>Update Password</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
