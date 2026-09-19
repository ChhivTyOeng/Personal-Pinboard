import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Switch,
  Button,
  NumberInput,
  Alert,
  Table,
  Badge,
  Modal,
} from '@mantine/core';
import {
  IconSettings,
  IconArrowLeft,
  IconCheck,
  IconShield,
  IconMessageCircle,
  IconStar,
  IconAlertTriangle,
  IconPlus,
  IconMinus,
  IconHistory,
  IconRefresh,
  IconTrash,
} from '@tabler/icons-react';
import PageHeader from '../../components/common/PageHeader';
import Loading from '../../components/common/Loading';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { userService } from '../../services/userService';
import { useSettings } from '../../context/SettingsContext';
import { toast } from '../../context/ToastContext';

export default function AdminSettings() {
  const { settings, updateSettings: updateGlobalSettings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [allowRegistration, setAllowRegistration] = useState(settings?.allow_registration ?? true);
  const [enableComments, setEnableComments] = useState(settings?.enable_comments ?? true);
  const [enableRatings, setEnableRatings] = useState(settings?.enable_ratings ?? true);
  const [moderationThreshold, setModerationThreshold] = useState(settings?.require_moderation_threshold || 3);
  const [maintenanceMode, setMaintenanceMode] = useState(settings?.maintenance_mode ?? false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);

  const loadAuditLogs = async () => {
    try {
      const logs = await userService.getAuditLogs();
      setAuditLogs(Array.isArray(logs) ? logs : []);
    } catch (e) {
      console.error('Failed to load audit logs:', e);
    }
  };

  useEffect(() => {
    if (settings) {
      setAllowRegistration(settings.allow_registration ?? true);
      setEnableComments(settings.enable_comments ?? true);
      setEnableRatings(settings.enable_ratings ?? true);
      setModerationThreshold(settings.require_moderation_threshold || 3);
      setMaintenanceMode(settings.maintenance_mode ?? false);
    }
    loadAuditLogs();
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        allow_registration: allowRegistration,
        enable_comments: enableComments,
        enable_ratings: enableRatings,
        require_moderation_threshold: Number(moderationThreshold) || 3,
        maintenance_mode: maintenanceMode,
      };
      await updateGlobalSettings(payload);
      await userService.updateSettings(payload);
      setSavedSuccess(true);
      toast.success('Platform administration settings successfully applied.');
      await loadAuditLogs();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update settings:', err);
      toast.error('Failed to save platform settings');
    } finally {
      setSaving(false);
    }
  };

  const handleClearAuditLogs = async () => {
    try {
      await userService.clearAuditLogs();
      setAuditLogs([]);
      toast.info('Administrative audit log cleared.');
    } catch (e) {
      toast.error('Failed to clear audit logs');
    }
  };

  const handleResetDemoData = async () => {
    setResetting(true);
    try {
      await userService.resetData();
      toast.success('All mock users, pins, reports, and categories restored to factory demo state!');
      setConfirmResetOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 400);
    } catch (err) {
      toast.error('Failed to reset demo data');
    } finally {
      setResetting(false);
    }
  };

  if (loading) return <Loading message="Loading platform settings..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-300 dark:hover:border-slate-700 transition-all"
      >
        <IconArrowLeft size={16} />
        Back to Admin Dashboard
      </Link>

      <PageHeader
        title="Platform Administration Settings"
        description="Configure governance rules, moderation triggers, user interaction features, and maintenance mode."
      />

      {savedSuccess && (
        <Alert
          icon={<IconCheck size={18} />}
          color="teal"
          radius="lg"
          title="Settings Updated"
        >
          Platform configuration changes have been applied successfully.
        </Alert>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Account & Access Governance */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <IconShield size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Account & Access Governance</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">User account creation and registration policy</p>
            </div>
          </div>

          <div>
            <Switch
              label="Allow Public Account Registration"
              description="When disabled, new users cannot create accounts without administrative invitation"
              checked={allowRegistration}
              onChange={(e) => setAllowRegistration(e.currentTarget.checked)}
              color="red"
            />
          </div>
        </div>

        {/* Interaction Features */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <IconStar size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Interaction & Moderation Controls</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage user feedback, ratings, and reporting triggers</p>
            </div>
          </div>

          <Switch
            label="Enable Pin Ratings (1-5 Stars)"
            description="Allows registered users to submit numerical star ratings on published pins"
            checked={enableRatings}
            onChange={(e) => setEnableRatings(e.currentTarget.checked)}
            color="red"
          />

          <Switch
            label="Enable Public Pin Comments"
            description="Allows conversation-style commentary on individual pin detail views"
            checked={enableComments}
            onChange={(e) => setEnableComments(e.currentTarget.checked)}
            color="red"
          />

          <div className="pt-2 max-w-sm">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              Automatic Review Report Threshold
            </label>
            <p className="text-xs text-slate-400 mb-3">
              Pins reaching this number of user reports will be flagged for high-priority review.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setModerationThreshold((prev) => Math.max(1, (Number(prev) || 1) - 1))}
                aria-label="Decrease threshold"
                className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-lg active:scale-95 transition-all cursor-pointer shadow-2xs select-none"
              >
                <IconMinus size={18} stroke={2.5} />
              </button>

              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={moderationThreshold}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  if (val === '') {
                    setModerationThreshold('');
                  } else {
                    const num = parseInt(val, 10);
                    setModerationThreshold(Math.min(50, Math.max(1, num)));
                  }
                }}
                onBlur={() => {
                  if (!moderationThreshold || Number(moderationThreshold) < 1) {
                    setModerationThreshold(1);
                  }
                }}
                className="w-20 h-11 text-center font-black text-lg rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 shadow-2xs"
              />

              <button
                type="button"
                onClick={() => setModerationThreshold((prev) => Math.min(50, (Number(prev) || 1) + 1))}
                aria-label="Increase threshold"
                className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-slate-800 hover:bg-brand-100 dark:hover:bg-slate-700 border border-brand-200 dark:border-slate-700 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-lg active:scale-95 transition-all cursor-pointer shadow-2xs select-none"
              >
                <IconPlus size={18} stroke={2.5} />
              </button>

              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 select-none">
                reports
              </span>
            </div>
          </div>
        </div>

        {/* Maintenance Mode (Clean Slate & Rose styling - No Yellow Borders) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-brand-600 dark:text-rose-400 flex items-center justify-center">
              <IconAlertTriangle size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Maintenance Mode</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Temporary system lockdown for major upgrades</p>
            </div>
          </div>

          <Switch
            label="Enable Maintenance Mode"
            description="Restricts platform access for non-administrator accounts during maintenance periods"
            checked={maintenanceMode}
            onChange={(e) => setMaintenanceMode(e.currentTarget.checked)}
            color="red"
          />
        </div>

        {/* Administrative Audit Trail Log - Live & Functional */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <IconHistory size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Administrative Audit Trail</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Security event logs and governance actions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge color="blue" variant="light" size="xs">
                {auditLogs.length} Live {auditLogs.length === 1 ? 'Event' : 'Events'}
              </Badge>
              {auditLogs.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAuditLogs}
                  className="text-xs font-semibold text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Clear Logs
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            {auditLogs.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  No administrative events recorded yet.
                </p>
              </div>
            ) : (
              <Table verticalSpacing="xs" horizontalSpacing="sm">
                <Table.Thead className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-400 uppercase">
                  <Table.Tr>
                    <Table.Th>Timestamp</Table.Th>
                    <Table.Th>Operator</Table.Th>
                    <Table.Th>Action Event</Table.Th>
                    <Table.Th>Target Entity</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody className="text-xs">
                  {auditLogs.map((log) => (
                    <Table.Tr key={log.id} className="border-b border-slate-100 dark:border-slate-800">
                      <Table.Td className="font-mono text-[11px] text-slate-400">{log.time}</Table.Td>
                      <Table.Td className="font-semibold text-slate-800 dark:text-slate-200">{log.admin}</Table.Td>
                      <Table.Td className="text-slate-600 dark:text-slate-300 font-medium">{log.action}</Table.Td>
                      <Table.Td className="font-mono text-[11px] text-slate-500">{log.target}</Table.Td>
                      <Table.Td>
                        <Badge
                          color={
                            log.status === 'Applied'
                              ? 'blue'
                              : log.status === 'Restored'
                              ? 'violet'
                              : log.status === 'Success'
                              ? 'teal'
                              : 'gray'
                          }
                          variant="light"
                          size="xs"
                        >
                          {log.status}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </div>
        </div>

        {/* Demo Data Management & Factory Reset */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-100 dark:border-rose-950/60 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-rose-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-brand-600 flex items-center justify-center">
              <IconRefresh size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Demo Environment Management</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Reset or re-seed complete dataset for demo testing</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Reset Platform Mock Dataset</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Restores all 8 mock users, categories, pins, and moderation safety reports to initial state.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setConfirmResetOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 text-xs font-bold transition-all cursor-pointer shrink-0 shadow-2xs"
            >
              <IconRefresh size={16} />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link to="/admin">
            <Button variant="default" radius="xl" size="md">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            color="brandRed"
            radius="xl"
            size="md"
            className="bg-brand-600 hover:bg-brand-700 shadow-md font-bold px-8"
            loading={saving}
          >
            Save Platform Settings
          </Button>
        </div>
      </form>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        opened={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        onConfirm={handleResetDemoData}
        title="Reset Platform Demo Data"
        message="Are you sure you want to reset all platform data to the initial factory demo state? All 8 users, published pins, categories, and safety reports will be refreshed."
        confirmLabel="Reset Everything"
        confirmColor="red"
        loading={resetting}
      />
    </div>
  );
}
