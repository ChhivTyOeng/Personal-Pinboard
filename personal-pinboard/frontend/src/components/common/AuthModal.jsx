import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconPin,
  IconMail,
  IconLock,
  IconAlertCircle,
  IconEye,
  IconEyeOff,
  IconX,
} from '@tabler/icons-react';
import { useAuth } from '../../hooks/useAuth';
import { useSettings } from '../../context/SettingsContext';
import { validateAuth } from '../../validators/authValidator';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import LegalModal from './LegalModal';
import GoogleAuthModal from './GoogleAuthModal';

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

export default function AuthModal({ opened, onClose, initialMode = 'login', redirectTo = '/pins' }) {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { settings } = useSettings();
  const registrationAllowed = settings?.allow_registration ?? true;

  const [mode, setMode] = useState(() => (initialMode === 'register' && !registrationAllowed ? 'login' : initialMode));
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [legalModal, setLegalModal] = useState({ open: false, tab: 'terms' });
  const [googleAuthOpen, setGoogleAuthOpen] = useState(false);

  // Safe reference-counted body scroll lock
  useBodyScrollLock(opened);

  useEffect(() => {
    setMode(initialMode);
    setShowPassword(false);
    setErrors({});
    setServerError('');
  }, [initialMode, opened]);

  const handleToggleMode = (newMode) => {
    if (newMode === 'register' && !registrationAllowed) {
      setServerError('Public account registration is currently disabled by platform policy.');
      return;
    }
    setMode(newMode);
    setShowPassword(false);
    setErrors({});
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isReg = mode === 'register';
    if (isReg && !registrationAllowed) {
      setServerError('Public registration is currently closed by platform policy.');
      return;
    }
    const validation = validateAuth(formData, isReg);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setServerError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        await register(formData);
      } else {
        await login(formData.email, formData.password);
      }
      onClose();
      navigate(redirectTo);
    } catch (err) {
      setServerError(err.response?.data?.message || err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleAuthOpen(true);
  };

  if (!opened) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Pure Tailwind Backdrop with smooth fade */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Pure Tailwind Mobile Bottom Sheet / Desktop Modal Card */}
      <div className="relative w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-[32px] sm:rounded-3xl shadow-2xl border-t sm:border border-slate-200/90 dark:border-slate-800 z-10 overflow-hidden transform transition-all duration-300 animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:fade-in sm:zoom-in-95 max-h-[92vh] sm:max-h-[92vh] flex flex-col selection:bg-brand-600 selection:text-white">
        
        {/* Mobile Swipe / Drag Indicator Bar */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Thumb-friendly Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center bg-slate-100/90 hover:bg-rose-50 dark:bg-slate-800/90 dark:hover:bg-rose-950/60 text-slate-500 hover:text-brand-600 dark:text-slate-300 dark:hover:text-rose-300 border border-slate-200/80 hover:border-rose-200 dark:border-white/10 dark:hover:border-rose-500/40 shadow-2xs hover:shadow-xs dark:hover:shadow-[0_0_16px_rgba(225,29,72,0.35)] ring-1 ring-inset ring-transparent dark:ring-white/[0.08] transition-all duration-300 cursor-pointer active:scale-90 group"
          aria-label="Close modal"
        >
          <IconX size={16} stroke={2.2} className="transition-transform duration-300 ease-out group-hover:rotate-90 group-hover:scale-110" />
        </button>

        {/* Scrollable Body with mobile-safe padding */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 pt-4 pb-8 sm:pb-7 modal-scrollbar overscroll-contain">
          <div className="text-center">
            {/* Brand Logo */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-brand-600/25 mx-auto mb-3 transition-transform hover:scale-105 duration-200">
              <IconPin size={24} stroke={2.4} />
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              {mode === 'login' ? 'Log in to save pins and manage your boards' : 'Sign up to start saving and organizing your pins'}
            </p>

            {/* Segmented Mode Switcher: Sign Up | Log In */}
            <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800/90 p-1 mt-4 mb-2 border border-slate-200/60 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => handleToggleMode('register')}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => handleToggleMode('login')}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Log In
              </button>
            </div>

            {serverError && (
              <div className="mt-3 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2 text-left animate-in fade-in duration-200">
                <IconAlertCircle size={16} className="shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Form Inputs (Pure Tailwind CSS - Mobile Touch Optimized) */}
            <form noValidate onSubmit={handleSubmit} className="space-y-3.5 mt-3.5 text-left">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full name
                    </label>
                    <input
                      type="text"
                      placeholder="Full name (optional)"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-[15px] sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Username <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Choose a username"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className={`w-full h-12 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border ${
                        errors.username ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-slate-200 dark:border-slate-700'
                      } text-slate-900 dark:text-white placeholder-slate-400 text-[15px] sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all`}
                    />
                    {errors.username && <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.username}</p>}
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <IconMail size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Email address"
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

                {mode === 'login' && (
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate('/forgot-password');
                      }}
                      className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:underline cursor-pointer py-0.5"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              {/* Primary Pill Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-black text-sm sm:text-base shadow-md shadow-brand-600/25 active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading && (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Log in' : 'Create Account'}</span>
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

            {/* Switch Mode Footer */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              {mode === 'login' ? (
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Not on Pinboard yet?{' '}
                  <button
                    type="button"
                    onClick={() => handleToggleMode('register')}
                    className="font-bold text-slate-900 dark:text-white hover:underline cursor-pointer ml-1"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleToggleMode('login')}
                    className="font-bold text-slate-900 dark:text-white hover:underline cursor-pointer ml-1"
                  >
                    Log in
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Privacy Legal Modal */}
      <LegalModal
        opened={legalModal.open}
        onClose={() => setLegalModal((prev) => ({ ...prev, open: false }))}
        initialTab={legalModal.tab}
      />

      {/* Google Account Connect Modal */}
      <GoogleAuthModal
        opened={googleAuthOpen}
        onClose={() => setGoogleAuthOpen(false)}
        mode={mode}
        onSuccess={() => {
          onClose();
          navigate(redirectTo);
        }}
      />
    </div>
  );
}
