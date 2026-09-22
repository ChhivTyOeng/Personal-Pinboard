import React, { useState, useEffect, useRef } from 'react';
import {
  IconX,
  IconArrowLeft,
  IconMail,
  IconUser,
  IconShieldCheck,
  IconAlertCircle,
  IconRefresh,
  IconCheck,
  IconExternalLink,
  IconLock,
  IconKey,
  IconInfoCircle,
} from '@tabler/icons-react';
import { useAuth } from '../../hooks/useAuth';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { googleAuthService } from '../../services/googleAuthService';
import { emailOtpService } from '../../services/emailOtpService';
import { toast } from '../../context/ToastContext';

// Official Google G Logo SVG
export function GoogleIcon(props) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...props}>
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

export default function GoogleAuthModal({
  opened,
  onClose,
  mode = 'login', // 'login' | 'signup'
  onSuccess,
}) {
  const { loginWithGoogle, loginWithOtp } = useAuth();

  // Steps: 'main' (select method: Google OAuth or Email OTP) -> 'otp' (verify 6-digit code from inbox)
  const [step, setStep] = useState('main');

  // Google OAuth state
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const [showGoogleSetup, setShowGoogleSetup] = useState(false);

  // Real Email OTP state
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpDelivered, setOtpDelivered] = useState(true);
  const [devCode, setDevCode] = useState('');

  // 6-digit verification state
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef([]);

  // Reset modal state whenever opened changes
  useEffect(() => {
    if (opened) {
      setStep('main');
      setGoogleLoading(false);
      setGoogleError('');
      setShowGoogleSetup(false);
      setEmail('');
      setFullName('');
      setEmailError('');
      setSendingOtp(false);
      setOtpDelivered(true);
      setDevCode('');
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError('');
      setVerifyingOtp(false);
      setResendCooldown(0);
    }
  }, [opened]);

  // Handle countdown timer for Resend Code
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Safe reference-counted body scroll lock
  useBodyScrollLock(opened);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && opened) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [opened, onClose]);

  // Focus first input box when entering OTP step
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  // -------------------------------------------------------------
  // METHOD 1: OFFICIAL GOOGLE OAUTH 2.0 SIGN-IN
  // -------------------------------------------------------------
  const handleOfficialGoogleSignIn = async () => {
    setGoogleError('');

    if (!googleAuthService.isConfigured()) {
      setShowGoogleSetup(true);
      setGoogleError(
        'Google Client ID is not yet configured in .env. You can add VITE_GOOGLE_CLIENT_ID, or use the Real Email OTP method below!'
      );
      return;
    }

    setGoogleLoading(true);
    try {
      const profile = await googleAuthService.promptGoogleSignIn();
      const authedUser = await loginWithGoogle(profile);

      toast.success(
        mode === 'signup'
          ? `Welcome to Pinboard, ${profile.name}!`
          : `Signed in as ${profile.name}`
      );

      if (onSuccess) onSuccess(authedUser);
      onClose();
    } catch (err) {
      console.warn('Google Sign-In prompt error:', err);
      setGoogleError(err.message || 'Google Sign-In was cancelled or encountered an issue.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // -------------------------------------------------------------
  // METHOD 2: REAL EMAIL OTP DELIVERY TO GMAIL INBOX
  // -------------------------------------------------------------
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setEmailError('Please enter your Google or email address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setEmailError('Please enter a valid email address (e.g. name@gmail.com)');
      return;
    }

    setEmailError('');
    setSendingOtp(true);
    setOtpError('');

    try {
      const result = await emailOtpService.sendOtpEmail(cleanEmail, fullName.trim());
      setOtpDelivered(result.delivered);
      if (result.devCode) {
        setDevCode(result.devCode);
      }

      setStep('otp');
      setResendCooldown(60); // 60 seconds cooldown
      toast.success(`Verification code dispatched to ${cleanEmail}`);
    } catch (err) {
      setEmailError(err.message || 'Failed to dispatch verification code. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  // Resend OTP code
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || sendingOtp) return;

    setSendingOtp(true);
    setOtpError('');
    try {
      const result = await emailOtpService.sendOtpEmail(email.trim().toLowerCase(), fullName.trim());
      setOtpDelivered(result.delivered);
      if (result.devCode) {
        setDevCode(result.devCode);
      }
      setResendCooldown(60);
      setOtpDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      toast.success('A new 6-digit code has been dispatched to your email.');
    } catch (err) {
      setOtpError(err.message || 'Could not resend code. Please wait before retrying.');
    } finally {
      setSendingOtp(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    // Support multi-digit paste
    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pasted.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      setOtpError('');
      const nextFocus = Math.min(pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleaned[cleaned.length - 1];
    setOtpDigits(newDigits);
    setOtpError('');

    // Advance to next input
    if (index < 5 && cleaned) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace navigation across inputs
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify entered OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const enteredCode = otpDigits.join('');

    if (enteredCode.length < 6) {
      setOtpError('Please enter all 6 digits of the verification code');
      return;
    }

    setVerifyingOtp(true);
    setOtpError('');

    try {
      const verification = emailOtpService.verifyOtp(email, enteredCode);
      if (!verification.valid) {
        setOtpError(verification.error);
        setVerifyingOtp(false);
        return;
      }

      // Validated! Log the user in or register their account
      const authedUser = await loginWithOtp(email, fullName);
      toast.success(
        mode === 'signup'
          ? `Welcome to Pinboard, ${authedUser.full_name}!`
          : `Signed in as ${authedUser.full_name || authedUser.email}`
      );

      if (onSuccess) onSuccess(authedUser);
      onClose();
    } catch (err) {
      setOtpError(err.message || 'Verification failed. Please try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  if (!opened) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Dialog Card */}
      <div className="relative w-full max-w-[460px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden z-10 animate-in zoom-in-95 fade-in duration-200 my-auto">
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <IconX size={17} stroke={2.2} />
        </button>

        {/* ------------------------------------------------------------- */}
        {/* STEP 1: AUTHENTICATION OPTIONS (GOOGLE OAUTH & REAL EMAIL OTP) */}
        {/* ------------------------------------------------------------- */}
        {step === 'main' && (
          <div>
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                <GoogleIcon />
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Authentic Google Sign-In & Real Email OTP verification
              </p>
            </div>

            {/* METHOD A: OFFICIAL GOOGLE SIGN-IN BUTTON */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleOfficialGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 px-4 h-12 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-white font-bold text-sm shadow-2xs hover:shadow-xs active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
              >
                {googleLoading ? (
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                <span>
                  {googleLoading ? 'Connecting to Google...' : 'Continue with Google Account'}
                </span>
              </button>

              {/* Google Error / Setup Notice */}
              {googleError && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-200 space-y-1.5 animate-in fade-in">
                  <div className="flex items-start gap-2">
                    <IconAlertCircle size={16} className="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                    <p className="font-medium text-[11.5px] leading-snug">{googleError}</p>
                  </div>

                  {showGoogleSetup && (
                    <div className="mt-2 pt-2 border-t border-amber-200/80 dark:border-amber-800/60 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                      <p className="font-bold text-slate-800 dark:text-slate-100">
                        How to enable one-click Google OAuth:
                      </p>
                      <ol className="list-decimal pl-4 space-y-0.5 text-[10.5px]">
                        <li>Create a project in Google Cloud Console.</li>
                        <li>Add OAuth 2.0 Client ID for Web Application.</li>
                        <li>
                          Set authorized origin to: <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded font-mono">http://localhost:5173</code>
                        </li>
                        <li>
                          Paste your client ID in frontend <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded font-mono">.env</code> as <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded font-mono">VITE_GOOGLE_CLIENT_ID</code>.
                        </li>
                      </ol>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* DIVIDER */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              <span className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase select-none">
                OR VERIFY WITH REAL OTP CODE
              </span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* METHOD B: REAL EMAIL OTP DISPATCH */}
            <form onSubmit={handleSendOtp} className="space-y-3 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Full Name <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <IconUser size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Chhiv Ty"
                    className="w-full pl-10 pr-3 h-11 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Gmail or Google Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <IconMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    placeholder="yourname@gmail.com"
                    className={`w-full pl-10 pr-3 h-11 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border ${
                      emailError ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-slate-200 dark:border-slate-700'
                    } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
                  />
                </div>
                {emailError && (
                  <p className="text-[11px] text-rose-500 mt-1 font-semibold flex items-center gap-1">
                    <IconAlertCircle size={13} />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={sendingOtp}
                className="w-full mt-2 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {sendingOtp ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending Real OTP Code to Inbox...</span>
                  </>
                ) : (
                  <>
                    <IconKey size={16} />
                    <span>Send Real 6-Digit Code to Inbox</span>
                  </>
                )}
              </button>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <IconShieldCheck size={16} className="text-emerald-500 shrink-0" />
                <span>
                  A real one-time code will be dispatched to your inbox. No fake on-screen answers.
                </span>
              </div>
            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* STEP 2: VERIFY REAL 6-DIGIT CODE DELIVERED TO INBOX */}
        {/* ------------------------------------------------------------- */}
        {step === 'otp' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setStep('main')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer transition-colors"
              >
                <IconArrowLeft size={15} />
                <span>Change Email</span>
              </button>
              <span className="text-[11px] font-semibold text-slate-400 truncate max-w-[180px]">
                {email}
              </span>
            </div>

            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2.5 shadow-2xs">
                <IconMail size={22} />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Check Your Email Inbox
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                We sent a 6-digit verification code to <strong className="text-slate-800 dark:text-slate-200">{email}</strong>
              </p>
            </div>

            {/* REAL DELIVERY NOTICE BANNER */}
            <div className="mb-4 p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/50 text-xs text-sky-800 dark:text-sky-200 space-y-1">
              <div className="flex items-center gap-2 font-bold text-[11.5px]">
                <IconShieldCheck size={16} className="text-sky-600 dark:text-sky-400 shrink-0" />
                <span>Check your Gmail Inbox & Spam folder</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                Open your email app, copy the 6-digit code sent by Pinboard, and enter it below. The code is valid for 10 minutes.
              </p>
            </div>

            {/* DEV PREVIEW CALLOUT (Only visible if EmailJS keys are not yet configured in .env) */}
            {devCode && (
              <div className="mb-4 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50 text-[11px] text-amber-800 dark:text-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <IconInfoCircle size={14} className="shrink-0 text-amber-600" />
                  <span>Dev Preview (EmailJS keys not in .env): Code is <strong className="font-mono font-bold text-amber-900 dark:text-amber-100">{devCode}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOtpDigits(devCode.split(''));
                    setOtpError('');
                    inputRefs.current[5]?.focus();
                  }}
                  className="px-2 py-0.5 rounded-md bg-amber-200/70 dark:bg-amber-800/60 hover:bg-amber-300 dark:hover:bg-amber-700 text-amber-900 dark:text-amber-100 text-[10px] font-bold cursor-pointer transition-colors"
                >
                  Paste code
                </button>
              </div>
            )}

            {/* 6-DIGIT OTP INPUT BOXES */}
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className={`w-11 h-12 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-mono font-black rounded-xl bg-slate-50 dark:bg-slate-800/90 border text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 ${
                        otpError
                          ? 'border-rose-500 focus:ring-rose-500/20'
                          : digit
                          ? 'border-blue-500 dark:border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 focus:ring-blue-500/20'
                          : 'border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                      }`}
                    />
                  ))}
                </div>

                {otpError && (
                  <p className="text-[11.5px] text-rose-500 mt-2 font-semibold flex items-center justify-center gap-1.5 animate-in fade-in">
                    <IconAlertCircle size={14} />
                    <span>{otpError}</span>
                  </p>
                )}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={verifyingOtp || otpDigits.join('').length < 6}
                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifyingOtp ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <IconCheck size={16} />
                    <span>Verify Code & Continue</span>
                  </>
                )}
              </button>

              {/* Resend Code Section */}
              <div className="pt-2 text-center">
                {resendCooldown > 0 ? (
                  <p className="text-xs text-slate-400 font-medium">
                    Resend new code in <strong className="text-blue-600 dark:text-blue-400 font-mono font-bold">{resendCooldown}s</strong>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={sendingOtp}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer disabled:opacity-50"
                  >
                    <IconRefresh size={14} className={sendingOtp ? 'animate-spin' : ''} />
                    <span>Resend verification code</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
