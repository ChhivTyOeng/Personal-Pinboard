import React from 'react';
import { Modal, Button, Text, Group } from '@mantine/core';

export default function ConfirmDialog({
  opened,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmLabel = 'Delete',
  confirmColor = 'red',
  loading = false,
}) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<span className="font-bold text-slate-900 dark:text-white">{title}</span>}
      centered
      radius="lg"
      padding="lg"
    >
      <Text size="sm" c="dimmed" className="mb-6 leading-relaxed">
        {message}
      </Text>
      <Group justify="flex-end" gap="sm">
        <Button variant="default" radius="xl" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          color={confirmColor}
          radius="xl"
          onClick={onConfirm}
          loading={loading}
          className="shadow-sm"
        >
          {confirmLabel}
        </Button>
      </Group>
    </Modal>
  );
}
