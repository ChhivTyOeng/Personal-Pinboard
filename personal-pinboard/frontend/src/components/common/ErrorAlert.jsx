import React from 'react';
import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

export default function ErrorAlert({ title = 'Something went wrong', message, onClose }) {
  if (!message) return null;

  return (
    <Alert
      icon={<IconAlertCircle size={18} />}
      title={title}
      color="red"
      variant="light"
      withCloseButton={!!onClose}
      onClose={onClose}
      radius="md"
      className="mb-6 border border-red-200 shadow-sm"
    >
      {message}
    </Alert>
  );
}
