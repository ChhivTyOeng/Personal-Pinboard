import React, { useState } from 'react';
import { Badge, ActionIcon } from '@mantine/core';
import { IconPlus, IconX } from '@tabler/icons-react';

export default function TagSelector({ tags = [], onChange, maxTags = 8 }) {
  const [inputVal, setInputVal] = useState('');

  const handleAdd = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addCurrent();
    }
  };

  const addCurrent = () => {
    const clean = inputVal.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    if (clean && !tags.includes(clean) && tags.length < maxTags) {
      onChange([...tags, clean]);
      setInputVal('');
    }
  };

  const handleRemove = (tagToRemove) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1.5 min-h-[38px] p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-brand-600 focus-within:ring-1 focus-within:ring-brand-600/30 transition-all">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="light"
            color="red"
            size="md"
            className="capitalize pl-2.5 pr-1 font-semibold"
            rightSection={
              <ActionIcon
                size={14}
                color="red"
                radius="xl"
                variant="transparent"
                onClick={() => handleRemove(tag)}
              >
                <IconX size={10} />
              </ActionIcon>
            }
          >
            #{tag}
          </Badge>
        ))}

        {tags.length < maxTags && (
          <div className="flex items-center gap-1 flex-1 min-w-[120px]">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleAdd}
              onBlur={addCurrent}
              placeholder={tags.length === 0 ? "Add tags (e.g. design, photo)..." : "Add tag..."}
              className="w-full text-xs text-slate-800 dark:text-white bg-transparent focus:outline-none placeholder:text-slate-400"
            />
          </div>
        )}
      </div>
      <p className="text-[11px] text-slate-400">
        Press Enter or comma to add a tag ({tags.length}/{maxTags} added)
      </p>
    </div>
  );
}
