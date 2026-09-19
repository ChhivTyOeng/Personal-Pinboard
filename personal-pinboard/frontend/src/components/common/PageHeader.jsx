import React from 'react';
import { Title, Text, Group } from '@mantine/core';

export default function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200/80 dark:border-slate-800">
      <div>
        <Title order={2} className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {title}
        </Title>
        {description && (
          <Text size="sm" c="dimmed" mt={4} className="max-w-2xl">
            {description}
          </Text>
        )}
      </div>
      {actions && (
        <Group gap="xs" className="shrink-0">
          {actions}
        </Group>
      )}
    </div>
  );
}
