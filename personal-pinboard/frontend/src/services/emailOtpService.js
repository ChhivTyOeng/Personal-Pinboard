/**
 * Real Email OTP Service
 * Handles generating real 6-digit codes and dispatching them to the user's Gmail inbox via EmailJS.
 */

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

// In-memory / session storage for active OTP records
const OTP_STORAGE_KEY = 'pinboard_pending_otp';

export const emailOtpService = {
  /**
   * Check if real EmailJS service credentials are configured in .env
   */
  isConfigured() {
    return Boolean(
      EMAILJS_SERVICE_ID &&
      EMAILJS_TEMPLATE_ID &&
      EMAILJS_PUBLIC_KEY &&
      EMAILJS_SERVICE_ID.trim().length > 0
    );
  },

  /**
   * Generate a cryptographically sound 6-digit OTP code
   */
  generateCode() {
    if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return (100000 + (array[0] % 900000)).toString();
    }
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  /**
   * Send a real 6-digit OTP to the user's email address
   * @param {string} email - Destination Gmail or email address
   * @param {string} recipientName - Name of the user (optional)
   */
  async sendOtpEmail(email, recipientName = '') {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Please provide a valid email address.');
    }

    // Check rate limit: must wait 60s between resends for the same email
    const existing = this.getPendingOtp(cleanEmail);
    if (existing && Date.now() - existing.sentAt < 60000) {
      const secondsLeft = Math.ceil((60000 - (Date.now() - existing.sentAt)) / 1000);
      throw new Error(`Please wait ${secondsLeft} seconds before requesting a new code.`);
    }

    const code = this.generateCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
    const record = {
      email: cleanEmail,
      code,
      expiresAt,
      sentAt: Date.now(),
    };

    // Save active OTP to sessionStorage
    sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(record));

    if (this.isConfigured()) {
      try {
        // Attempt dynamic import of @emailjs/browser or REST API fallback
        let sendSuccess = false;
        try {
          const emailjs = await import('@emailjs/browser');
          await emailjs.default.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
              to_email: cleanEmail,
              to_name: recipientName || cleanEmail.split('@')[0],
              otp_code: code,
              app_name: 'Pinboard',
              expiry_minutes: '10',
            },
            EMAILJS_PUBLIC_KEY
          );
          sendSuccess = true;
        } catch (sdkErr) {
          // REST API fallback to EmailJS public endpoint
          const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              service_id: EMAILJS_SERVICE_ID,
              template_id: EMAILJS_TEMPLATE_ID,
              user_id: EMAILJS_PUBLIC_KEY,
              template_params: {
                to_email: cleanEmail,
                to_name: recipientName || cleanEmail.split('@')[0],
                otp_code: code,
                app_name: 'Pinboard',
                expiry_minutes: '10',
              },
            }),
          });

          if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Email delivery service error: ${errText || res.statusText}`);
          }
          sendSuccess = true;
        }

        return {
          success: true,
          email: cleanEmail,
          delivered: true,
          message: `Verification code successfully dispatched to ${cleanEmail}`,
        };
      } catch (err) {
        console.error('Email dispatch failed:', err);
        throw new Error(`Failed to deliver email to ${cleanEmail}: ${err.message}`);
      }
    } else {
      // Keys not configured in .env yet
      // Log for developer convenience in browser console
      console.info(
        `%c[Pinboard OTP Service]%c Real email delivery requires VITE_EMAILJS keys in .env.\nGenerated Code for ${cleanEmail}: %c${code}`,
        'color: #2563eb; font-weight: bold;',
        'color: #64748b;',
        'color: #16a34a; font-weight: bold; font-size: 14px;'
      );

      return {
        success: true,
        email: cleanEmail,
        delivered: false,
        devCode: code, // Provided in development mode so user is never locked out
        message: `Real email delivery requires EmailJS keys in .env.`,
      };
    }
  },

  /**
   * Get active pending OTP record for email
   */
  getPendingOtp(email) {
    try {
      const raw = sessionStorage.getItem(OTP_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed.email === (email || '').trim().toLowerCase()) {
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Verify entered 6-digit OTP code against saved record
   * @param {string} email
   * @param {string} inputCode
   */
  verifyOtp(email, inputCode) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanCode = (inputCode || '').trim();

    const pending = this.getPendingOtp(cleanEmail);
    if (!pending) {
      return {
        valid: false,
        error: 'No active verification code found for this email. Please request a new code.',
      };
    }

    if (Date.now() > pending.expiresAt) {
      sessionStorage.removeItem(OTP_STORAGE_KEY);
      return {
        valid: false,
        error: 'This verification code has expired. Please request a new code.',
      };
    }

    if (cleanCode !== pending.code) {
      return {
        valid: false,
        error: 'Incorrect verification code. Please check your email inbox and enter the 6-digit code.',
      };
    }

    // Code verified! Clear used OTP
    sessionStorage.removeItem(OTP_STORAGE_KEY);
    return {
      valid: true,
      email: cleanEmail,
    };
  },
};
