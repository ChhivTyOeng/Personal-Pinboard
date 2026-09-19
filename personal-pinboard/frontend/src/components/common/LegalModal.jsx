import React, { useState, useEffect } from 'react';
import { Modal } from '@mantine/core';
import {
  IconFileText,
  IconShieldLock,
  IconX,
  IconExternalLink,
  IconCheck,
  IconLock,
  IconDatabase,
  IconSparkles,
  IconScale,
  IconUserCheck,
  IconPin,
  IconShieldCheck,
  IconTrash,
  IconAlertCircle,
  IconMail,
  IconKey,
  IconUser,
  IconCookie,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from '../../data/legalContent';

// Helper icon resolver
const iconMap = {
  IconCheck,
  IconUserCheck,
  IconPin,
  IconShieldCheck,
  IconScale,
  IconTrash,
  IconAlertCircle,
  IconMail,
  IconDatabase,
  IconSparkles,
  IconLock,
  IconKey,
  IconUser,
  IconCookie,
};

export default function LegalModal({ opened, onClose, initialTab = 'terms' }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Synchronize initialTab whenever modal opens
  useEffect(() => {
    if (opened) {
      setActiveTab(initialTab);
    }
  }, [opened, initialTab]);

  const currentDoc = activeTab === 'terms' ? TERMS_OF_SERVICE : PRIVACY_POLICY;

  const handleOpenFullPage = () => {
    onClose();
    navigate(activeTab === 'terms' ? '/terms' : '/privacy');
  };


  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      size="xl"
      centered
      radius="28px"
      padding={0}
      zIndex={1000}
      overlayProps={{
        backgroundOpacity: 0.65,
        blur: 4,
      }}
      styles={{
        content: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
        },
        body: {
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        },
      }}
    >
      <div className="relative flex flex-col max-h-[88vh] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden selection:bg-brand-500 selection:text-white">
        {/* Modal Header */}
        <div className="shrink-0 px-6 sm:px-8 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-900/50 flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-2xs">
                {activeTab === 'terms' ? <IconFileText size={22} /> : <IconShieldLock size={22} />}
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {currentDoc.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 flex items-center gap-2">
                  <span>Last updated: {currentDoc.lastUpdated}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="text-brand-600 dark:text-brand-400 font-semibold">Personal Pinboard</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">

              <button
                type="button"
                onClick={handleOpenFullPage}
                title="Open in full page view"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer hidden sm:flex items-center justify-center"
                aria-label="Open full page"
              >
                <IconExternalLink size={18} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <IconX size={20} />
              </button>
            </div>
          </div>

          {/* Tab Navigation Pill Switcher */}
          <div className="flex items-center justify-start pt-1">
            <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => setActiveTab('terms')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'terms'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <IconFileText size={16} />
                <span>Terms of Service</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('privacy')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'privacy'
                    ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <IconShieldLock size={16} />
                <span>Privacy Policy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 modal-scrollbar overscroll-contain">
          {/* Executive Summary Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-50/70 via-rose-50/40 to-slate-50 dark:from-slate-800/80 dark:via-slate-800/50 dark:to-slate-900 border border-brand-100 dark:border-slate-800 shadow-2xs">
            <h3 className="text-xs font-black uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1 flex items-center gap-1.5">
              <IconSparkles size={14} />
              Summary of Key Terms
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {currentDoc.summary}
            </p>
          </div>

          {/* Sections List */}
          <div className="space-y-6">
            {currentDoc.sections.map((sec) => {
              const IconComponent = iconMap[sec.icon] || IconFileText;
              return (
                <div
                  key={sec.id}
                  id={sec.id}
                  className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800/90 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 border border-slate-200/80 dark:border-slate-600 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0 shadow-2xs">
                      <IconComponent size={16} />
                    </div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                      {sec.title}
                    </h3>
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-1 sm:pl-11">
                    {sec.content.map((paragraph, idx) => (
                      <p
                        key={idx}
                        className={
                          paragraph.startsWith('•')
                            ? 'pl-2 text-slate-700 dark:text-slate-300 font-medium'
                            : ''
                        }
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="shrink-0 px-6 sm:px-8 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            Need legal assistance? Email{' '}
            <a
              href="mailto:chhivtyy16@gmail.com"
              className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              chhivtyy16@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleOpenFullPage}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
            >
              View Full Page
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
