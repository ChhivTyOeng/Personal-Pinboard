import React from 'react';
import { Card, Text, Group } from '@mantine/core';

export default function StatsCard({ title, value, icon: Icon, description }) {
  return (
    <Card
      withBorder
      radius="2xl"
      p="lg"
      className="bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200"
    >
      <Group justify="space-between" align="flex-start">
        <div>
          <Text size="xs" c="dimmed" tt="uppercase" fw={700} className="tracking-wider">
            {title}
          </Text>
          <Text fw={800} size="xl" className="text-3xl text-slate-900 dark:text-white mt-1">
            {value}
          </Text>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-100/60 dark:border-brand-900/60 shadow-xs">
          <Icon size={24} stroke={1.8} />
        </div>
      </Group>

      {description && (
        <Text size="xs" c="dimmed" mt="sm">
          {description}
        </Text>
      )}
    </Card>
  );
}
