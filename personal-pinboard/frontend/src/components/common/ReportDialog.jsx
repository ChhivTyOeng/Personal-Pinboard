import React, { useState } from 'react';
import { Modal, Select, Textarea, Button, Group } from '@mantine/core';
import { IconFlag, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { pinService } from '../../services/pinService';
import { useAuth } from '../../hooks/useAuth';

export default function ReportDialog({ opened, onClose, pin, onReportSubmitted }) {
  const { user } = useAuth();
  const [reason, setReason] = useState('Inappropriate content');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reasons = [
    { value: 'Spam', label: 'Spam or commercial promotion' },
    { value: 'Inappropriate content', label: 'Inappropriate or harmful content' },
    { value: 'Copyright', label: 'Copyright or intellectual property violation' },
    { value: 'Misleading information', label: 'Misleading or false information' },
    { value: 'Other', label: 'Other violation' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pin) return;
    setIsSubmitting(true);

    try {
      await pinService.reportPin(
        pin.id,
        {
          reason,
          details: details.trim(),
        },
        user
      );
      setSubmitted(true);
      if (onReportSubmitted) {
        onReportSubmitted(pin.id);
      }
      setTimeout(() => {
        setSubmitted(false);
        setDetails('');
        onClose();
      }, 1400);
    } catch (error) {
      console.error('Failed to report pin:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <IconFlag size={16} />
          </div>
          <span>Report Content</span>
        </div>
      }
      centered
      radius="lg"
      padding="lg"
    >
      {submitted ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <IconCheck size={24} />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">Report Received</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Thank you for helping keep Personal Pinboard safe. Our moderation team has been notified.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center gap-3 border border-slate-100 dark:border-slate-700">
            {pin?.image_url && (
              <img
                src={pin.image_url}
                alt={pin.title}
                className="w-12 h-12 object-cover rounded-lg shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{pin?.title || 'Selected Pin'}</p>
              <p className="text-[11px] text-slate-400">By @{pin?.username || 'creator'}</p>
            </div>
          </div>

          <Select
            label="Reason for report"
            placeholder="Select a reason"
            data={reasons}
            value={reason}
            onChange={(val) => setReason(val || 'Inappropriate content')}
            required
            radius="md"
          />

          <Textarea
            label="Additional details (optional)"
            placeholder="Provide context for our moderators..."
            value={details}
            onChange={(e) => setDetails(e.currentTarget.value)}
            minRows={3}
            radius="md"
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="default" radius="xl" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              color="brandRed"
              radius="xl"
              className="bg-brand-600 hover:bg-brand-700"
              loading={isSubmitting}
            >
              Submit Report
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
