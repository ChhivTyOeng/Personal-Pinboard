/**
 * Google Identity Services (GIS) Official OAuth 2.0 Service
 * Handles authentic Google Sign-In with real Google accounts and 2-step verification.
 */

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export const googleAuthService = {
  /**
   * Check if Google Identity Services SDK has loaded in the browser
   */
  isSdkLoaded() {
    return typeof window !== 'undefined' && Boolean(window.google?.accounts?.oauth2);
  },

  /**
   * Check if a valid Google Client ID is configured in environment
   */
  isConfigured() {
    return Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID.trim().length > 0);
  },

  /**
   * Get the current client ID (or placeholder notice)
   */
  getClientId() {
    return GOOGLE_CLIENT_ID;
  },

  /**
   * Wait for Google SDK to load with timeout (up to 3 seconds)
   */
  async waitForSdk(timeoutMs = 3000) {
    if (this.isSdkLoaded()) return true;

    return new Promise((resolve) => {
      const startTime = Date.now();
      const interval = setInterval(() => {
        if (this.isSdkLoaded()) {
          clearInterval(interval);
          resolve(true);
        } else if (Date.now() - startTime > timeoutMs) {
          clearInterval(interval);
          resolve(false);
        }
      }, 100);
    });
  },

  /**
   * Trigger Google Official OAuth 2.0 Popup
   * Opens the real Google account selector where Google handles authentic credentials & 2FA.
   * Returns authenticated user profile: { id, email, name, avatar_url, email_verified }
   */
  async promptGoogleSignIn() {
    if (!this.isConfigured()) {
      throw new Error(
        'Google Client ID is not configured. Please add VITE_GOOGLE_CLIENT_ID to your .env file.'
      );
    }

    const loaded = await this.waitForSdk();
    if (!loaded) {
      throw new Error(
        'Google Identity Services SDK failed to load. Please check your internet connection or ad blockers.'
      );
    }

    return new Promise((resolve, reject) => {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse.error) {
              reject(new Error(`Google Sign-In Error: ${tokenResponse.error_description || tokenResponse.error}`));
              return;
            }

            try {
              // Fetch authenticated Google User Profile
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                  Authorization: `Bearer ${tokenResponse.access_token}`,
                },
              });

              if (!res.ok) {
                throw new Error('Failed to fetch user profile from Google.');
              }

              const data = await res.json();
              resolve({
                googleId: data.sub,
                email: data.email,
                name: data.name || data.given_name || 'Google User',
                avatar_url: data.picture,
                email_verified: data.email_verified,
                accessToken: tokenResponse.access_token,
              });
            } catch (fetchErr) {
              reject(fetchErr);
            }
          },
          error_callback: (error) => {
            reject(new Error(error.message || 'Google Sign-In popup closed or blocked'));
          },
        });

        // Open official Google popup
        client.requestAccessToken({ prompt: 'select_account' });
      } catch (err) {
        reject(err);
      }
    });
  },
};
