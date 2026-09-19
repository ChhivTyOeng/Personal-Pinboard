import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  IconPin,
  IconMail,
  IconLock,
  IconAlertCircle,
  IconEye,
  IconEyeOff,
} from '@tabler/icons-react';
import { useAuth } from '../../hooks/useAuth';
import { validateAuth } from '../../validators/authValidator';
import ThemeToggle from '../../components/common/ThemeToggle';
import LegalModal from '../../components/common/LegalModal';
import GoogleAuthModal from '../../components/common/GoogleAuthModal';

// Google Official G icon
function GoogleIcon(props) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [legalModal, setLegalModal] = useState({ open: false, tab: 'terms' });
  const [googleAuthOpen, setGoogleAuthOpen] = useState(false);

  const from = location.state?.from?.pathname || '/pins';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateAuth(formData, false);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setServerError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleAuthOpen(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-brand-50/40 via-[#FAFAFA] to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Pure Tailwind Card */}
      <div className="w-full max-w-[420px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 sm:p-8 text-center transition-all">
        {/* Brand Circle Icon */}
        <Link to="/" className="inline-flex items-center justify-center mb-3 transition-transform hover:scale-105 duration-200">
          <div className="w-12 h-12 rounded-full bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-600/25">
            <IconPin size={24} stroke={2.4} />
          </div>
        </Link>

        {/* Heading */}
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Welcome to Pinboard
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Find new ideas to try
        </p>

        {serverError && (
          <div className="mt-3 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2 text-left animate-in fade-in duration-200">
            <IconAlertCircle size={16} className="shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Credentials Form (Pure Tailwind CSS) */}
        <form noValidate onSubmit={handleSubmit} className="space-y-3.5 mt-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Email or Username <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <IconMail size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Enter your email or username"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full h-12 pl-11 pr-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border ${
                  errors.email ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-slate-200 dark:border-slate-700'
                } text-slate-900 dark:text-white placeholder-slate-400 text-[15px] sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all`}
              />
            </div>
            {errors.email && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <IconLock size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password (min 6 chars)"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full h-12 pl-11 pr-11 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border ${
                  errors.password ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-slate-200 dark:border-slate-700'
                } text-slate-900 dark:text-white placeholder-slate-400 text-[15px] sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.password}</p>}

            <div className="mt-2 flex justify-end">
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:underline cursor-pointer py-0.5"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-sm sm:text-base shadow-md shadow-brand-600/25 active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading && (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>{loading ? 'Logging in...' : 'Log in'}</span>
          </button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          <span className="text-[11px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase select-none">
            OR
          </span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Continue with Google (Clean, official web standard design) */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-4 h-12 rounded-full border border-slate-300 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-white font-bold text-sm shadow-2xs hover:shadow-xs active:scale-[0.98] transition-all duration-150 cursor-pointer"
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>

        {/* Terms Disclaimer */}
        <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center leading-tight mt-4 px-1">
          By continuing, you agree to Pinboard's{' '}
          <button
            type="button"
            onClick={() => setLegalModal({ open: true, tab: 'terms' })}
            className="font-bold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Terms of Service
          </button>{' '}
          and{' '}
          <button
            type="button"
            onClick={() => setLegalModal({ open: true, tab: 'privacy' })}
            className="font-bold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>.
        </p>

        {/* Switch to Register */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Not on Pinboard yet?{' '}
            <Link to="/register" className="font-bold text-slate-900 dark:text-white hover:underline ml-1">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Interactive Terms & Privacy Modal */}
      <LegalModal
        opened={legalModal.open}
        onClose={() => setLegalModal((prev) => ({ ...prev, open: false }))}
        initialTab={legalModal.tab}
      />

      {/* Google Account Connect Modal */}
      <GoogleAuthModal
        opened={googleAuthOpen}
        onClose={() => setGoogleAuthOpen(false)}
        mode="login"
        onSuccess={() => navigate(from, { replace: true })}
      />
    </div>
  );
}
