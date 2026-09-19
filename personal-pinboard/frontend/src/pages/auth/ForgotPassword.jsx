import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconPin, IconCheck, IconMail } from '@tabler/icons-react';
import ThemeToggle from '../../components/common/ThemeToggle';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
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

        {submitted ? (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 text-left mb-6">
            <IconCheck size={18} className="shrink-0 text-emerald-600" />
            <span>Password reset link sent! Check your inbox for instructions.</span>
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
              <span>Send Reset Link</span>
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
