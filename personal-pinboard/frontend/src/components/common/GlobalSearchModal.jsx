import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  IconSearch,
  IconArrowLeft,
  IconX,
  IconClock,
  IconTrendingUp,
  IconSparkles,
  IconArrowRight,
  IconTrash,
  IconPin,
  IconFlame,
} from '@tabler/icons-react';
import { appStore } from '../../services/store';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

const TRENDING_TOPICS = [
  { name: 'Architecture', tag: 'Architecture', icon: '🏛️' },
  { name: 'UI Design', tag: 'UI Design', icon: '🎨' },
  { name: 'Minimalist', tag: 'Minimal', icon: '🌿' },
  { name: 'Photography', tag: 'Photography', icon: '📸' },
  { name: 'Modern Art', tag: 'Art', icon: '🖌️' },
  { name: 'Interior', tag: 'Interior', icon: '🛋️' },
  { name: 'Typography', tag: 'Typography', icon: '✨' },
];

const RECENT_SEARCHES_KEY = 'pinboard_recent_searches_v2';

export default function GlobalSearchModal({ isOpen, onClose, initialQuery = '' }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState(initialQuery);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : ['Architecture', 'UI Design', 'Minimal'];
    } catch {
      return ['Architecture', 'UI Design'];
    }
  });

  const [allPins, setAllPins] = useState([]);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setAllPins(appStore.getPins() || []);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 80);
    }
  }, [isOpen, initialQuery]);

  const saveRecentSearch = (term) => {
    if (!term || !term.trim()) return;
    const clean = term.trim();
    const updated = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 8);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save recent search:', e);
    }
  };

  const removeRecentSearch = (e, term) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to remove recent search:', e);
    }
  };

  const clearAllRecent = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (e) {
      console.warn('Failed to clear recent searches:', e);
    }
  };

  const handleExecuteSearch = (searchTerm) => {
    const finalTerm = searchTerm !== undefined ? searchTerm : query;
    if (!finalTerm || !finalTerm.trim()) return;
    const clean = finalTerm.trim();
    saveRecentSearch(clean);
    onClose();
    navigate(`/pins?search=${encodeURIComponent(clean)}`);
  };

  const handleSelectPin = (pin) => {
    saveRecentSearch(pin.title || 'Pin');
    onClose();
    navigate(`/pins/${pin.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleExecuteSearch();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Real-time matching results
  const trimmed = query.trim().toLowerCase();
  const matchingPins = trimmed
    ? allPins
        .filter((p) => {
          const title = (p.title || '').toLowerCase();
          const desc = (p.description || '').toLowerCase();
          const tags = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : '';
          const author = (p.author?.name || p.author?.full_name || '').toLowerCase();
          return title.includes(trimmed) || desc.includes(trimmed) || tags.includes(trimmed) || author.includes(trimmed);
        })
        .slice(0, 6)
    : [];

  const matchingCategories = trimmed
    ? TRENDING_TOPICS.filter((t) => t.name.toLowerCase().includes(trimmed) || t.tag.toLowerCase().includes(trimmed))
    : [];

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[120] flex flex-col bg-white dark:bg-slate-950 animate-in fade-in duration-150">
      {/* Search Bar Header */}
      <div className="sticky top-0 z-10 px-3 sm:px-6 py-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5 shadow-2xs">
        {/* Back Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Back"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <IconArrowLeft size={20} stroke={2.5} />
        </button>

        {/* Search Input Box */}
        <div className="flex-1 relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center">
            <IconSearch size={18} stroke={2.4} />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search ideas, pins, boards..."
            className="w-full h-11 pl-10 pr-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-medium border border-transparent focus:border-brand-600 dark:focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all shadow-inner"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                if (inputRef.current) inputRef.current.focus();
              }}
              aria-label="Clear query"
              className="absolute right-3 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <IconX size={13} stroke={2.5} />
            </button>
          )}
        </div>

        {/* Search Action Button */}
        {query.trim().length > 0 && (
          <button
            type="button"
            onClick={() => handleExecuteSearch()}
            className="px-4 h-10 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer shrink-0 flex items-center justify-center animate-in fade-in"
          >
            Search
          </button>
        )}
      </div>

      {/* Content Body: Trending, History, or Live Matching Results */}
      <div className="flex-1 overflow-y-auto modal-scrollbar p-4 sm:p-6 max-w-3xl w-full mx-auto space-y-6">
        {trimmed.length === 0 ? (
          <>
            {/* Section 1: Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <IconClock size={14} stroke={2.4} />
                    Recent Searches
                  </span>
                  <button
                    type="button"
                    onClick={clearAllRecent}
                    className="text-xs font-bold text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <IconTrash size={12} stroke={2} />
                    <span>Clear all</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {recentSearches.map((term) => (
                    <div
                      key={term}
                      onClick={() => handleExecuteSearch(term)}
                      className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200/70 dark:border-slate-700/60 shadow-2xs transition-all cursor-pointer active:scale-95 select-none"
                    >
                      <IconClock size={12} className="text-slate-400" />
                      <span>{term}</span>
                      <button
                        type="button"
                        onClick={(e) => removeRecentSearch(e, term)}
                        aria-label={`Remove ${term}`}
                        className="w-4 h-4 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center justify-center transition-colors ml-0.5"
                      >
                        <IconX size={10} stroke={2.5} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 2: Trending Topics */}
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <IconFlame size={15} stroke={2.4} className="text-amber-500" />
                Trending on Pinboard
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {TRENDING_TOPICS.map((topic) => (
                  <button
                    key={topic.name}
                    type="button"
                    onClick={() => handleExecuteSearch(topic.tag)}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-sm hover:border-brand-500/50 hover:bg-rose-50/20 dark:hover:bg-rose-950/20 flex items-center gap-3 transition-all cursor-pointer text-left group active:scale-95"
                  >
                    <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">
                      {topic.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-rose-400 transition-colors">
                        {topic.name}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                        #{topic.tag}
                      </p>
                    </div>
                    <IconArrowRight
                      size={14}
                      className="text-slate-300 dark:text-slate-600 group-hover:text-brand-600 dark:group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all shrink-0"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Section 3: Quick Jump Explorations */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-purple-500/10 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-brand-600 dark:text-rose-400">
                  <IconSparkles size={14} stroke={2.4} />
                  <span>Discover Ideas</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  Browse through hundreds of visual inspirations curated by top creators.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/pins');
                }}
                className="px-4 py-2 rounded-full bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
              >
                Browse All
              </button>
            </div>
          </>
        ) : (
          /* Live Instant Matching Search Results */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Found {matchingPins.length} result{matchingPins.length === 1 ? '' : 's'} for{' '}
                <span className="font-black text-slate-900 dark:text-white">"{query}"</span>
              </span>
              <button
                type="button"
                onClick={() => handleExecuteSearch()}
                className="text-xs font-bold text-brand-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all</span>
                <IconArrowRight size={13} />
              </button>
            </div>

            {/* Matching Category Chips */}
            {matchingCategories.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto modal-scrollbar pb-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                  Category:
                </span>
                {matchingCategories.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleExecuteSearch(c.tag)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-brand-600 dark:text-rose-400 text-xs font-bold border border-rose-200/80 dark:border-rose-900/50 hover:bg-rose-100/80 dark:hover:bg-rose-900/80 transition-all cursor-pointer shrink-0 active:scale-95"
                  >
                    <span>{c.icon}</span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Matching Pins List */}
            {matchingPins.length > 0 ? (
              <div className="space-y-2">
                {matchingPins.map((pin) => (
                  <div
                    key={pin.id}
                    onClick={() => handleSelectPin(pin)}
                    className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-brand-500/40 flex items-center gap-3.5 transition-all cursor-pointer group active:scale-[0.99]"
                  >
                    {/* Pin Thumbnail */}
                    {pin.image_url ? (
                      <img
                        src={pin.image_url}
                        alt={pin.title || 'Pin thumbnail'}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                        <IconPin size={20} />
                      </div>
                    )}

                    {/* Pin Information */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-rose-400 transition-colors">
                        {pin.title || 'Untitled Pin'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 line-clamp-1">
                        {pin.description || 'Visual inspiration on Pinboard'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {pin.author?.name && (
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 truncate">
                            By {pin.author.name}
                          </span>
                        )}
                        {Array.isArray(pin.tags) && pin.tags.length > 0 && (
                          <span className="text-[10px] font-medium text-brand-600 dark:text-rose-400">
                            #{pin.tags[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    <IconArrowRight
                      size={16}
                      className="text-slate-300 dark:text-slate-600 group-hover:text-brand-600 dark:group-hover:text-rose-400 group-hover:translate-x-1 transition-all shrink-0 mr-1"
                    />
                  </div>
                ))}

                {/* Bottom Callout to view all matching results */}
                <button
                  type="button"
                  onClick={() => handleExecuteSearch()}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200/90 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-900 dark:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-2xs mt-2"
                >
                  <IconSearch size={14} stroke={2.5} />
                  <span>See all results for "{query}"</span>
                  <IconArrowRight size={14} />
                </button>
              </div>
            ) : (
              /* Empty State for query */
              <div className="py-12 px-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <IconSearch size={22} stroke={2} />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  No matches for "{query}"
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed mb-4">
                  Check your spelling or try exploring popular topics like architecture, minimal, or UI design.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {TRENDING_TOPICS.slice(0, 4).map((t) => (
                    <button
                      key={t.name}
                      type="button"
                      onClick={() => handleExecuteSearch(t.tag)}
                      className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-brand-600 transition-colors"
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
