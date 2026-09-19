import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  IconPin,
  IconArrowLeft,
  IconFileText,
  IconShieldLock,
  IconSearch,
  IconSparkles,
  IconCheck,
  IconUserCheck,
  IconShieldCheck,
  IconScale,
  IconTrash,
  IconAlertCircle,
  IconMail,
  IconDatabase,
  IconLock,
  IconKey,
  IconUser,
  IconCookie,
  IconShare,
  IconX,
} from '@tabler/icons-react';
import ThemeToggle from '../../components/common/ThemeToggle';
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from '../../data/legalContent';

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

export default function LegalPageLayout({ activeDocType = 'terms' }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const isTerms = activeDocType === 'terms';
  const doc = isTerms ? TERMS_OF_SERVICE : PRIVACY_POLICY;

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return doc.sections;
    const q = searchQuery.toLowerCase();
    return doc.sections.filter(
      (sec) =>
        sec.title.toLowerCase().includes(q) ||
        sec.content.some((c) => c.toLowerCase().includes(q))
    );
  }, [doc, searchQuery]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };


  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Top Sticky Navigation */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-xs sm:text-sm font-bold"
              aria-label="Go back"
            >
              <IconArrowLeft size={18} />
              <span className="hidden sm:inline">Back</span>
            </button>

            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer select-none">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-600/30 ring-2 ring-brand-500/20 group-hover:scale-105 group-active:scale-95 transition-all duration-200 shrink-0">
                <IconPin size={23} stroke={2.6} className="text-white shrink-0" />
              </div>
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center leading-none">
                Pinboard<span className="text-brand-600">.</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5"
              title="Copy page link"
            >
              <IconShare size={17} />
              <span className="hidden md:inline">{copied ? 'Copied!' : 'Share'}</span>
            </button>


            <Link
              to="/pins"
              className="hidden sm:flex items-center justify-center h-9 px-4 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              Go to App
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header Section */}
      <section className="bg-gradient-to-b from-rose-50/50 via-white to-transparent dark:from-slate-900 dark:via-slate-950 dark:to-transparent pt-10 pb-8 border-b border-slate-200/60 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-900 text-brand-600 dark:text-brand-400 text-xs font-black uppercase tracking-wider mb-4 shadow-2xs">
            {isTerms ? <IconFileText size={15} /> : <IconShieldLock size={15} />}
            <span>Official Legal Documentation</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {doc.title}
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Last Updated: <span className="font-semibold text-slate-700 dark:text-slate-300">{doc.lastUpdated}</span>.
            Applies to all users of Personal Pinboard services.
          </p>

          {/* Switcher Pills between Terms and Privacy */}
          <div className="mt-6 inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
            <button
              type="button"
              onClick={() => navigate('/terms')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isTerms
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <IconFileText size={16} />
              <span>Terms of Service</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/privacy')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                !isTerms
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <IconShieldLock size={16} />
              <span>Privacy Policy</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Quick Table of Contents (Desktop Sticky) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Table of Contents
              </h3>
              <nav className="space-y-1">
                {doc.sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>
            </div>

            <div className="p-4 rounded-2xl bg-brand-50/60 dark:bg-slate-900 border border-brand-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <p className="font-bold text-slate-900 dark:text-white mb-1">Questions or inquiries?</p>
              <p className="text-[11px] mb-2">Our support team is available to assist with policy questions.</p>
              <a
                href="mailto:chhivtyy16@gmail.com"
                className="font-bold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
              >
                <IconMail size={13} /> chhivtyy16@gmail.com
              </a>
            </div>
          </aside>

          {/* Right Column: Content Body */}
          <div className="lg:col-span-8 space-y-8">
            {/* Search Filter Bar */}
            <div className="relative">
              <IconSearch
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across sections..."
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-2xs transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <IconX size={15} />
                </button>
              )}
            </div>

            {/* Document Summary Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-50/80 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 border border-brand-100 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-black text-xs uppercase tracking-wider mb-2">
                <IconSparkles size={16} />
                <span>Executive Summary</span>
              </div>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                {doc.summary}
              </p>
            </div>

            {/* Sections */}
            {filteredSections.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
                <IconSearch size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  No clauses match "{searchQuery}"
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Try searching for another keyword or clear the search field.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-brand-600 dark:text-brand-400 hover:bg-slate-200 cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredSections.map((sec) => {
                  const IconComponent = iconMap[sec.icon] || IconFileText;
                  return (
                    <section
                      key={sec.id}
                      id={sec.id}
                      className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs scroll-mt-24 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-slate-800 border border-brand-200/80 dark:border-slate-700 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0 shadow-2xs">
                          <IconComponent size={20} />
                        </div>
                        <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                          {sec.title}
                        </h2>
                      </div>

                      <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-1 sm:pl-13">
                        {sec.content.map((paragraph, idx) => (
                          <p
                            key={idx}
                            className={
                              paragraph.startsWith('•')
                                ? 'pl-3 py-0.5 text-slate-700 dark:text-slate-200 font-medium'
                                : ''
                            }
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 py-8 transition-colors mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-600/30 shrink-0">
              <IconPin size={20} stroke={2.5} className="text-white shrink-0" />
            </div>
            <span className="font-extrabold text-slate-900 dark:text-white text-sm leading-none">
              Personal Pinboard
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Link to="/terms" className="hover:text-brand-600 transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-brand-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/pins" className="hover:text-brand-600 transition-colors">
              Explore Pins
            </Link>
          </div>

          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Personal Pinboard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
