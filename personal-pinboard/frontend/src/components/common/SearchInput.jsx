import React from 'react';
import { TextInput, ActionIcon } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';

export default function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search ideas, pins, or creators...',
  className = '',
  size = 'md',
  onFocus,
  onBlur,
  ...props
}) {
  return (
    <TextInput
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      size={size}
      radius="xl"
      onFocus={onFocus}
      onBlur={onBlur}
      leftSection={<IconSearch size={18} className="text-slate-400" />}
      rightSection={
        value ? (
          <ActionIcon size="sm" variant="subtle" color="gray" onClick={onClear} aria-label="Clear search">
            <IconX size={14} />
          </ActionIcon>
        ) : null
      }
      className={`transition-all duration-200 focus-within:shadow-sm ${className}`}
      classNames={{
        input: 'bg-slate-50/80 hover:bg-white focus:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border-slate-200/90 dark:border-slate-700/80 focus:border-brand-600 dark:focus:border-brand-500 transition-colors duration-150',
      }}
      aria-label={placeholder}
      {...props}
    />
  );
}
