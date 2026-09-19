import React from 'react';
import { Button, Title, Text } from '@mantine/core';
import { IconPhotoOff } from '@tabler/icons-react';

export default function EmptyState({
  icon: Icon = IconPhotoOff,
  title = 'Nothing found yet',
  description = 'Try adjusting your search terms or create something new to get started.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-5 border border-brand-100 dark:border-brand-900 shadow-sm">
        <Icon size={32} stroke={1.8} />
      </div>
      <Title order={3} className="text-slate-900 dark:text-white font-bold tracking-tight mb-2">
        {title}
      </Title>
      <Text size="sm" c="dimmed" className="mb-6 leading-relaxed">
        {description}
      </Text>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          color="brandRed"
          radius="xl"
          size="md"
          className="shadow-sm hover:shadow-md"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
