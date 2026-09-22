import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { forceUnlockBodyScroll } from '../../utils/scrollLock';

/**
 * Ensures clean body scroll status on every route change.
 * Only resets window scroll to (0, 0) on new navigations ('PUSH'), preserving
 * native browser scroll position when clicking browser Back ('POP').
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    // Unconditionally unlock body scroll so no page transition ever inherits a locked scroll
    forceUnlockBodyScroll();

    // Only scroll to top on new navigations; allow browser to restore scroll position on Back/Forward
    if (navType === 'PUSH') {
      window.scrollTo(0, 0);
    }
  }, [pathname, navType]);

  return null;
}
