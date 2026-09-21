import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { forceUnlockBodyScroll } from '../../utils/scrollLock';

/**
 * Ensures clean scroll position and unlocks any lingering body overflow on route navigation.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    forceUnlockBodyScroll();
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
