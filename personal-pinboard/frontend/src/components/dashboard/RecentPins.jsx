import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@mantine/core';
import { IconHeartFilled, IconArrowRight } from '@tabler/icons-react';
import { formatDate } from '../../utils/formatDate';

export default function RecentPins({ pins = [] }) {
  if (pins.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-sm">
        No recent pins to display.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg">Recently Created & Saved</h3>
        <Link
          to="/pins"
          className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-1"
        >
          View all <IconArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pins.slice(0, 4).map((pin) => (
          <Link
            key={pin.id}
            to={`/pins/${pin.id}`}
            className="group rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-brand-200 dark:hover:border-slate-700 transition-all block bg-white dark:bg-slate-900"
          >
            <div className="aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={pin.image_url}
                alt={pin.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3">
              <p className="font-semibold text-xs text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                {pin.title}
              </p>
              <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                <span>{formatDate(pin.created_at)}</span>
                <span className="flex items-center gap-0.5 text-brand-600 dark:text-brand-400 font-medium">
                  <IconHeartFilled size={11} /> {pin.likes_count || 0}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
