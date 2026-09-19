import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  IconCheck,
  IconAlertCircle,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react';

const ToastContext = createContext(null);

let toastListener = null;

export const toast = {
  success: (message, title = 'Success') => {
    if (toastListener) toastListener({ message, title, type: 'success' });
  },
  error: (message, title = 'Error') => {
    if (toastListener) toastListener({ message, title, type: 'error' });
  },
  info: (message, title = 'Notice') => {
    if (toastListener) toastListener({ message, title, type: 'info' });
  },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, title, type = 'info', duration = 3500 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, message, title, type, duration };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    toastListener = addToast;
    return () => {
      toastListener = null;
    };
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}

      {/* Floating Toasts Container */}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((t) => {
          const isSuccess = t.type === 'success';
          const isError = t.type === 'error';

          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-md backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-3 ${
                isSuccess
                  ? 'bg-white/95 dark:bg-slate-900/95 border-emerald-200 dark:border-emerald-800 text-slate-900 dark:text-white'
                  : isError
                  ? 'bg-white/95 dark:bg-slate-900/95 border-rose-200 dark:border-rose-800 text-slate-900 dark:text-white'
                  : 'bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
              }`}
            >
              {/* Status Icon */}
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  isSuccess
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                    : isError
                    ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                    : 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400'
                }`}
              >
                {isSuccess && <IconCheck size={16} stroke={2.5} />}
                {isError && <IconAlertCircle size={16} stroke={2.5} />}
                {!isSuccess && !isError && <IconInfoCircle size={16} stroke={2.5} />}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0 pr-1">
                {t.title && (
                  <h4 className="text-xs font-bold leading-snug tracking-tight text-slate-900 dark:text-white">
                    {t.title}
                  </h4>
                )}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">
                  {t.message}
                </p>
              </div>

              {/* Dismiss Button */}
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Dismiss notification"
              >
                <IconX size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return { toast };
  }
  return context;
};
