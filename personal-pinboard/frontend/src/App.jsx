import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { theme } from './theme/theme';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { SettingsProvider } from './context/SettingsContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <AuthProvider>
              <SettingsProvider>
                <AppRoutes />
              </SettingsProvider>
            </AuthProvider>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </MantineProvider>
  );
}
