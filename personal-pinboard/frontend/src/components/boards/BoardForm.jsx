import React, { useState, useEffect } from 'react';
import {
  IconBookmark,
  IconLock,
  IconPhoto,
  IconSparkles,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { validateBoard } from '../../validators/boardValidator';

const PRESET_COVERS = [
  {
    label: '🌿 Nature',
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: '🏛️ Architecture',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: '🎨 Art & Design',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: '☕ Cozy Lifestyle',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: '💻 Modern Tech',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: '🏖️ Travel',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: '🍔 Food',
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
  },
];

const DEFAULT_INITIAL_DATA = {};

export default function BoardForm({
  opened,
  onClose,
  onCancel,
  onSubmit,
  initialData = DEFAULT_INITIAL_DATA,
  loading = false,
}) {
  const handleClose = onClose || onCancel || (() => {});

  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isPrivate, setIsPrivate] = useState(Boolean(initialData?.is_private));
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.cover_image_url || '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (opened) {
      setName(initialData?.name || '');
      setDescription(initialData?.description || '');
      setIsPrivate(Boolean(initialData?.is_private));
      setCoverImageUrl(initialData?.cover_image_url || '');
      setErrors({});
    }
  }, [
    opened,
    initialData?.name,
    initialData?.description,
    initialData?.is_private,
    initialData?.cover_image_url,
  ]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && opened) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [opened, handleClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateBoard({ name });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      is_private: isPrivate,
      cover_image_url: coverImageUrl.trim(),
    });
  };

  const formBody = (
    <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0 select-none">
      {/* 1. Mobile Drag Indicator */}
      <div className="sm:hidden pt-2.5 pb-1 flex justify-center shrink-0">
        <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* 2. Modal Header */}
      <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-brand-600/30">
            <IconBookmark size={20} stroke={2.2} />
          </div>
          <div className="min-w-0">
            <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg leading-tight tracking-tight truncate">
              {initialData?.id ? 'Edit Board' : 'Create New Board'}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {initialData?.id
                ? 'Update your board collection details'
                : 'Organize your visual ideas into a collection'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 ml-2"
          aria-label="Close modal"
        >
          <IconX size={18} stroke={2.2} />
        </button>
      </div>

      {/* 3. Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 modal-scrollbar min-h-0">
        {/* Board Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Board Name <span className="text-brand-600">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Places to Visit, Architecture, Style..."
            required
            autoFocus
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) {
                setErrors((prev) => ({ ...prev, name: null }));
              }
            }}
            className={`w-full h-11 sm:h-12 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border text-slate-900 dark:text-white placeholder-slate-400 text-sm font-semibold focus:outline-none transition-all ${
              errors.name
                ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
            }`}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Description
            </label>
            <span className="text-[11px] text-slate-400 font-medium">
              (optional)
            </span>
          </div>
          <textarea
            rows={2}
            placeholder="What is this board about? Add notes or a theme..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none"
          />
        </div>

        {/* Cover Photo & Presets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Cover Photo
            </label>
            <span className="text-[11px] text-slate-400 font-medium">
              Choose preset or paste link
            </span>
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-slate-400 pointer-events-none">
              <IconPhoto size={17} />
            </span>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="w-full h-10 pl-10 pr-9 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
            {coverImageUrl && (
              <button
                type="button"
                onClick={() => setCoverImageUrl('')}
                className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                aria-label="Clear image URL"
              >
                <IconX size={14} />
              </button>
            )}
          </div>

          {/* Quick preset chips */}
          <div className="pt-1">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">
              <IconSparkles size={13} className="text-brand-500 shrink-0" />
              <span>Quick Themes:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {PRESET_COVERS.map((preset) => {
                const isSelected = coverImageUrl === preset.url;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setCoverImageUrl(preset.url)}
                    className={`text-[11px] px-3 py-1.5 rounded-full border transition-all cursor-pointer font-semibold active:scale-95 whitespace-nowrap ${
                      isSelected
                        ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-600 dark:text-brand-300 font-bold shadow-2xs scale-102'
                        : 'bg-slate-100/90 dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cover Live Preview */}
          {coverImageUrl && (
            <div className="mt-2.5 relative rounded-2xl overflow-hidden aspect-[16/8] bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
              <img
                src={coverImageUrl}
                alt="Board Cover Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10.5px] font-bold tracking-wide shadow-xs">
                Cover Preview
              </div>
              <button
                type="button"
                onClick={() => setCoverImageUrl('')}
                className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center cursor-pointer transition-transform active:scale-90 shadow-xs"
                aria-label="Remove cover image"
              >
                <IconX size={13} stroke={2.5} />
              </button>
            </div>
          )}
        </div>

        {/* Secret Board Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0">
                <IconLock size={17} stroke={2.2} />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  Keep this board secret
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                  Only you can see this board and the pins saved to it.
                </p>
              </div>
            </div>

            {/* Custom Modern Accessible Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={isPrivate}
              onClick={() => setIsPrivate(!isPrivate)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                isPrivate ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isPrivate ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Action Footer (Always 100% visible, zero clipping on any screen) */}
      <div className="px-5 sm:px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shrink-0 flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="px-4 sm:px-5 py-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs sm:text-sm transition-all cursor-pointer active:scale-95 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 sm:px-6 py-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md hover:shadow-brand-600/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
        >
          {loading ? (
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <IconCheck size={16} stroke={2.5} />
          )}
          <span>{initialData?.id ? 'Save Changes' : 'Create Board'}</span>
        </button>
      </div>
    </form>
  );

  // If opened is undefined (e.g. rendered inside a parent container directly), return formBody
  if (opened === undefined) {
    return formBody;
  }

  if (!opened) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
        onWheel={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
      />

      {/* Sheet on Mobile / Centered Card on Tablet & Desktop */}
      <div className="relative w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-[28px] sm:rounded-3xl shadow-2xl border-t sm:border border-slate-200/90 dark:border-slate-800 z-10 overflow-hidden transform transition-all duration-300 animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 sm:fade-in sm:zoom-in-95 max-h-[90vh] sm:max-h-[85vh] flex flex-col selection:bg-brand-600 selection:text-white">
        {formBody}
      </div>
    </div>
  );
}
