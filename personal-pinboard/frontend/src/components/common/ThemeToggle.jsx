import React from 'react';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '', compact = false, responsive = true }) {
  const { isDark, setThemeMode, toggleTheme } = useTheme();

  if (compact) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleTheme();
        }}
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer select-none bg-slate-100/90 hover:bg-slate-200/90 dark:bg-slate-800/90 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 shadow-2xs active:scale-90 ${className}`}
      >
        {isDark ? (
          <IconSun size={17} className="text-amber-400" stroke={2.5} />
        ) : (
          <IconMoon size={17} className="text-slate-800 dark:text-slate-200" stroke={2.5} />
        )}
      </button>
    );
  }

  return (
    <>
      {responsive && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme();
          }}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className={`sm:hidden w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer select-none bg-slate-100/90 hover:bg-slate-200/90 dark:bg-slate-800/90 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 shadow-2xs active:scale-90 ${className}`}
        >
          {isDark ? (
            <IconSun size={17} className="text-amber-400" stroke={2.5} />
          ) : (
            <IconMoon size={17} className="text-slate-800 dark:text-slate-200" stroke={2.5} />
          )}
        </button>
      )}

      <div
        className={`${responsive ? 'hidden sm:inline-flex' : 'inline-flex'} items-center p-1 rounded-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-2xs transition-colors ${className}`}
        role="group"
        aria-label="Color theme switcher"
      >
        {/* Light Option Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setThemeMode('light');
          }}
          title="Switch to Light Mode"
          aria-pressed={!isDark}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer select-none ${
            !isDark
              ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/80 font-extrabold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <IconSun size={15} className={!isDark ? 'text-amber-500' : 'text-slate-400'} />
          <span className="hidden md:inline">Light</span>
        </button>

        {/* Dark Option Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setThemeMode('dark');
          }}
          title="Switch to Dark Mode"
          aria-pressed={isDark}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer select-none ${
            isDark
              ? 'bg-slate-950 text-white shadow-xs ring-1 ring-slate-700 font-extrabold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <IconMoon size={15} className={isDark ? 'text-indigo-400' : 'text-slate-400'} />
          <span className="hidden md:inline">Dark</span>
        </button>
      </div>
    </>
  );
}
