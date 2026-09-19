import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, ActionIcon } from '@mantine/core';
import { IconLock, IconTrash, IconFolder } from '@tabler/icons-react';

export default function BoardCard({ board, onDelete, isOwner }) {
  const previews = board.preview_images || [];

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-pin hover:shadow-pin-hover transition-all duration-300 overflow-hidden flex flex-col justify-between">
      {/* Collage Preview Top */}
      <Link to={`/pins?board=${board.id}`} className="block p-2">
        <div className="aspect-[16/10] w-full rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden">
          {previews.length > 0 ? (
            <div className="w-full h-full grid grid-cols-3 gap-1">
              <div className="col-span-2 h-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                <img
                  src={previews[0] || board.cover_image_url}
                  alt={board.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="col-span-1 flex flex-col gap-1 h-full">
                <div className="h-1/2 overflow-hidden bg-slate-200 dark:bg-slate-700">
                  {previews[1] && (
                    <img
                      src={previews[1]}
                      alt={board.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="h-1/2 overflow-hidden bg-slate-200 dark:bg-slate-700">
                  {previews[2] && (
                    <img
                      src={previews[2]}
                      alt={board.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          ) : board.cover_image_url ? (
            <div className="w-full h-full overflow-hidden bg-slate-200 dark:bg-slate-700">
              <img
                src={board.cover_image_url}
                alt={board.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-6">
              <IconFolder size={36} stroke={1.5} />
              <span className="text-xs mt-1 font-medium">Empty board</span>
            </div>
          )}
        </div>
      </Link>

      {/* Board Information & Actions */}
      <div className="p-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {board.name}
            </h3>
            {board.is_private && (
              <Badge size="xs" color="gray" variant="light" leftSection={<IconLock size={10} />}>
                Secret
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {board.pins_count || 0} pins
          </p>
        </div>

        {isOwner && onDelete && (
          <ActionIcon
            variant="subtle"
            color="red"
            radius="xl"
            onClick={() => onDelete(board.id)}
            aria-label="Delete board"
          >
            <IconTrash size={16} />
          </ActionIcon>
        )}
      </div>
    </div>
  );
}
