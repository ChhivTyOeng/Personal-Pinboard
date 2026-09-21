import { useEffect } from 'react';
import { lockBodyScroll, unlockBodyScroll } from '../utils/scrollLock';

/**
 * Hook to lock body scroll when isLocked is true, and restore it when false or on unmount.
 * Safe across multiple simultaneous or nested modals.
 *
 * @param {boolean} isLocked
 */
export function useBodyScrollLock(isLocked) {
  useEffect(() => {
    if (isLocked) {
      lockBodyScroll();
      return () => {
        unlockBodyScroll();
      };
    }
  }, [isLocked]);
}

export default useBodyScrollLock;
