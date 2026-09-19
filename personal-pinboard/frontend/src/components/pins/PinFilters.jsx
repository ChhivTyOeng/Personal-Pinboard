import React from 'react';
import { Select } from '@mantine/core';
import {
  IconPhoto,
  IconLink,
  IconFileText,
  IconBulb,
  IconVideo,
  IconClock,
  IconLock,
  IconWorld,
  IconUsers,
  IconLayoutGrid,
} from '@tabler/icons-react';
import { SORT_OPTIONS } from '../../utils/constants';

const PIN_TYPES = [
  { value: 'all', label: 'All', icon: IconLayoutGrid },
  { value: 'image', label: 'Images', icon: IconPhoto },
  { value: 'link', label: 'Links', icon: IconLink },
  { value: 'note', label: 'Notes', icon: IconFileText },
  { value: 'idea', label: 'Ideas', icon: IconBulb },
  { value: 'video', label: 'Videos', icon: IconVideo },
];

export default function PinFilters({
  categories = [],
  selectedCategory,
  onSelectCategory,
  selectedType = 'all',
  onSelectType,
  selectedPrivacy = 'all',
  onSelectPrivacy,
  isRecentlyViewed = false,
  onToggleRecentlyViewed,
  sortBy,
  onChangeSort,
}) {
  return (
    <div className="space-y-3 mb-6 pb-2">
      {/* Top Row: Categories + Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-1 scroll-smooth">
          <button
            type="button"
            onClick={() => {
              if (isRecentlyViewed && onToggleRecentlyViewed) onToggleRecentlyViewed();
              onSelectCategory(null);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer select-none active:scale-95 ${
              selectedCategory === null && !isRecentlyViewed
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
            }`}
          >
            All Ideas
          </button>

          {/* Recently Viewed Pill */}
          {onToggleRecentlyViewed && (
            <button
              type="button"
              onClick={onToggleRecentlyViewed}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-150 flex items-center gap-1.5 cursor-pointer select-none active:scale-95 ${
                isRecentlyViewed
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              <IconClock size={13} stroke={2.4} />
              <span>Recently Viewed</span>
            </button>
          )}

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id && !isRecentlyViewed;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  if (isRecentlyViewed && onToggleRecentlyViewed) onToggleRecentlyViewed();
                  onSelectCategory(isSelected ? null : cat.id);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer select-none active:scale-95 ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Sort Select */}
        {sortBy !== undefined && onChangeSort && (
          <div className="w-44 shrink-0">
            <Select
              size="xs"
              radius="xl"
              data={SORT_OPTIONS}
              value={sortBy}
              onChange={onChangeSort}
              classNames={{
                input: 'font-semibold border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white',
              }}
            />
          </div>
        )}
      </div>

      {/* Sub Row: Type Filters & Privacy Filter */}
      {onSelectType && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800">
          {/* Type Pills with smooth horizontal scroll on mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth">
            {PIN_TYPES.map((t) => {
              const IconComp = t.icon;
              const isSelected = selectedType === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => onSelectType(t.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all duration-150 cursor-pointer select-none active:scale-95 ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs font-bold'
                      : 'bg-slate-100/90 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200/90 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200/70 dark:border-slate-700/60'
                  }`}
                >
                  {IconComp && <IconComp size={13} stroke={2.4} className="shrink-0" />}
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Privacy Pills */}
          {onSelectPrivacy && (
            <div className="flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/80 p-0.5 rounded-full text-xs shrink-0 self-start sm:self-auto border border-slate-200/70 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => onSelectPrivacy('all')}
                className={`px-2.5 py-1 rounded-full text-[11.5px] font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer select-none ${
                  selectedPrivacy === 'all'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => onSelectPrivacy('public')}
                className={`px-2.5 py-1 rounded-full text-[11.5px] font-semibold whitespace-nowrap flex items-center gap-1 transition-all duration-150 cursor-pointer select-none ${
                  selectedPrivacy === 'public'
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <IconWorld size={12} stroke={2.4} />
                <span>Public</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectPrivacy('private')}
                className={`px-2.5 py-1 rounded-full text-[11.5px] font-semibold whitespace-nowrap flex items-center gap-1 transition-all duration-150 cursor-pointer select-none ${
                  selectedPrivacy === 'private'
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <IconLock size={12} stroke={2.4} />
                <span>Only Me</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
