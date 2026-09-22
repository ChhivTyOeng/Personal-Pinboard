let lockCount = 0;
let originalPaddingRight = '';

/**
 * Safely locks document body scroll without leaking across multiple modals.
 * Uses reference counting so nested or concurrent modals unlock cleanly when all close.
 */
export function lockBodyScroll() {
  if (typeof document === 'undefined') return;

  if (lockCount === 0) {
    originalPaddingRight = document.body.style.paddingRight || '';

    // Compensate for scrollbar disappearance to prevent page content shift
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }
  }
  lockCount++;
}

/**
 * Decrements lock count and restores body scroll to unrestricted when all locks are released.
 */
export function unlockBodyScroll() {
  if (typeof document === 'undefined') return;

  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    originalPaddingRight = '';
  }
}

/**
 * Forcefully restores body scroll regardless of active lock count.
 * Ideal for route changes, popstate back-button events, and unmounts.
 */
export function forceUnlockBodyScroll() {
  if (typeof document === 'undefined') return;

  lockCount = 0;
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  originalPaddingRight = '';
}