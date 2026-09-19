import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useMantineColorScheme } from '@mantine/core';

const ThemeContext = createContext({
  theme: 'light',
  isDark: false,
  toggleTheme: () => {},
  setThemeMode: () => {},
});

function applyThemeDirectly(targetTheme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const body = document.body;
  const isDark = targetTheme === 'dark';

  if (isDark) {
    root.classList.add('dark');
    root.setAttribute('data-mantine-color-scheme', 'dark');
    if (body) body.classList.add('dark');
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-mantine-color-scheme', 'light');
    if (body) body.classList.remove('dark');
  }

  try {
    localStorage.setItem('pinboard-theme', targetTheme);
    localStorage.setItem('mantine-color-scheme-value', targetTheme);
  } catch (e) {
    console.warn('Unable to persist theme:', e);
  }
}

export function ThemeProvider({ children }) {
  const { setColorScheme } = useMantineColorScheme();

  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('pinboard-theme') || localStorage.getItem('mantine-color-scheme-value');
      if (saved === 'dark') {
        applyThemeDirectly('dark');
        return 'dark';
      }
    } catch (e) {}
    applyThemeDirectly('light');
    return 'light';
  });

  const isDark = theme === 'dark';

  const setThemeMode = useCallback((newTheme) => {
    if (newTheme !== 'light' && newTheme !== 'dark') return;
    applyThemeDirectly(newTheme);
    setTheme(newTheme);
    try {
      setColorScheme(newTheme);
    } catch (e) {}
  }, [setColorScheme]);

  const toggleTheme = useCallback(() => {
    setThemeMode(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setThemeMode]);

  // Initial and reactive sync
  useEffect(() => {
    applyThemeDirectly(theme);
    try {
      setColorScheme(theme);
    } catch (e) {}
    if (typeof window !== 'undefined') {
      window.__pinboardTheme = theme;
      window.__setPinboardTheme = setThemeMode;
    }
  }, [theme, setColorScheme, setThemeMode]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setThemeMode, setTheme: setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
