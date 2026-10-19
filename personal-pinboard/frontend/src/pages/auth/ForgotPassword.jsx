import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconPin, IconCheck, IconMail, IconAlertCircle, IconArrowRight } from '@tabler/icons-react';
import ThemeToggle from '../../components/common/ThemeToggle';
import { authService } from '../../services/authService';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devCode, setDevCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;

    setError('');
    setLoading(true);
    try {
      const res = await authService.forgotPassword(cleanEmail);
      setSubmitted(true);
      if (res?.data?.dev_code) {
        setDevCode(res.data.dev_code);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to dispatch reset code.');
    } finally {
      setLoading(false);
    }
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
            Reset Password
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your email to receive password reset instructions
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2 text-left animate-in fade-in">
            <IconAlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="space-y-4 text-left">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <IconCheck size={18} className="shrink-0 text-emerald-600" />
              <span>Password reset instructions have been generated for {email}.</span>
            </div>

            {devCode && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <span className="font-bold">Development Reset Code: </span>
                <span className="font-mono font-black text-sm bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700">{devCode}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)}
              className="w-full h-11 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs hover:shadow-sm active:scale-[0.98] transition-all duration-150 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Enter Reset Code & Set Password</span>
              <IconArrowRight size={16} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email address <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <IconMail size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 pl-10 pr-3.5 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
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
              <span>Send Reset Instructions</span>
            </button>
          </form>
        )}

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          Remember your credentials?{' '}
          <Link to="/login" className="text-brand-600 font-bold hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
