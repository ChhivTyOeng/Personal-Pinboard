import React, { useState } from 'react';
import { Menu, ActionIcon, Modal, TextInput, Textarea, Button, Text } from '@mantine/core';
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconShare,
  IconFlag,
  IconCheck,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { pinService } from '../../services/pinService';
import ConfirmDialog from '../common/ConfirmDialog';

import { toast } from '../../context/ToastContext';

export default function PinMenu({ pin, onDelete, isAuthorOrAdmin }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Report modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/pins/${pin.id}`);
    setCopied(true);
    toast.success('Pin link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await pinService.deletePin(pin.id);
      if (onDelete) onDelete(pin.id);
      setConfirmDeleteOpen(false);
      toast.success('Pin deleted successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to delete pin');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    setIsReporting(true);
    try {
      await pinService.reportPin(pin.id, {
        reason: reportReason,
        details: reportDetails,
      });
      setReportSuccess(true);
      toast.success('Report submitted to moderators.');
      setTimeout(() => {
        setReportModalOpen(false);
        setReportSuccess(false);
        setReportReason('');
        setReportDetails('');
      }, 1500);
    } catch (err) {
      toast.error(err.message || 'Failed to submit report');
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <>
      <Menu shadow="md" width={170} position="bottom-end">
        <Menu.Target>
          <ActionIcon
            variant="filled"
            color="dark"
            radius="xl"
            size="md"
            className="bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white shadow-md backdrop-blur-xs transition-transform"
            onClick={(e) => e.stopPropagation()}
            aria-label="Pin options"
          >
            <IconDotsVertical size={16} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
          <Menu.Item
            leftSection={copied ? <IconCheck size={16} className="text-emerald-500" /> : <IconShare size={16} />}
            onClick={handleCopy}
          >
            {copied ? 'Link Copied!' : 'Copy Link'}
          </Menu.Item>

          {isAuthorOrAdmin && (
            <>
              <Menu.Item
                leftSection={<IconEdit size={16} />}
                onClick={() => navigate(`/pins/edit/${pin.id}`)}
              >
                Edit Pin
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={<IconTrash size={16} />}
                onClick={() => setConfirmDeleteOpen(true)}
              >
                Delete
              </Menu.Item>
            </>
          )}

          {!isAuthorOrAdmin && (
            <Menu.Item
              color="red"
              leftSection={<IconFlag size={16} />}
              onClick={() => setReportModalOpen(true)}
            >
              Report Pin
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>

      {/* Delete Confirmation */}
      <ConfirmDialog
        opened={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Pin"
        message={`Are you sure you want to permanently delete "${pin.title}"?`}
        loading={isDeleting}
      />

      {/* Report Modal */}
      <Modal
        opened={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title={<span className="font-bold text-slate-900 dark:text-white">Report Inappropriate Content</span>}
        radius="lg"
        centered
      >
        {reportSuccess ? (
          <div className="text-center py-6 text-emerald-600 dark:text-emerald-400 font-semibold">
            Thank you! This pin has been flagged for moderation review.
          </div>
        ) : (
          <form onSubmit={handleReport} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Reason</label>
              <select
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                required
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              >
                <option value="">Select reason...</option>
                <option value="Spam">Spam</option>
                <option value="Inappropriate content">Inappropriate content</option>
                <option value="Copyright">Copyright</option>
                <option value="Misleading information">Misleading information</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <Textarea
              label="Additional context (optional)"
              placeholder="Provide any details to assist moderators..."
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="default" onClick={() => setReportModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" color="brandRed" loading={isReporting} className="bg-brand-600 hover:bg-brand-700">
                Submit Report
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
