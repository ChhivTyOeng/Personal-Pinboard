import React, { createContext, useContext, useState, useEffect } from 'react';
import { appStore } from '../services/store';

export const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => appStore.getSettings());

  useEffect(() => {
    const handleUpdate = () => {
      const current = appStore.getSettings();
      setSettings({ ...current });
    };

    document.title = 'Pinboard - Visual Ideas & Inspiration';

    window.addEventListener('pinboard-store-update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('pinboard-store-update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const updateSettings = async (updates) => {
    const updated = appStore.updateSettings(updates);
    setSettings({ ...updated });
    return updated;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        refreshSettings: () => setSettings({ ...appStore.getSettings() }),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    return {
      settings: appStore.getSettings(),
      updateSettings: (updates) => appStore.updateSettings(updates),
      refreshSettings: () => appStore.getSettings(),
    };
  }
  return context;
}
