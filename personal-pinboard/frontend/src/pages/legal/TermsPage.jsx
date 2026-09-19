import React, { useEffect } from 'react';
import LegalPageLayout from './LegalPageLayout';

export default function TermsPage() {
  useEffect(() => {
    document.title = 'Terms of Service | Personal Pinboard';
    window.scrollTo(0, 0);
  }, []);

  return <LegalPageLayout activeDocType="terms" />;
}
