import React, { useEffect } from 'react';
import LegalPageLayout from './LegalPageLayout';

export default function PrivacyPage() {
  useEffect(() => {
    document.title = 'Privacy Policy | Personal Pinboard';
    window.scrollTo(0, 0);
  }, []);

  return <LegalPageLayout activeDocType="privacy" />;
}
