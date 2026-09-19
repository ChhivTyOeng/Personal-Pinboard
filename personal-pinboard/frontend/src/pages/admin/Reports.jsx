import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SegmentedControl } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import PageHeader from '../../components/common/PageHeader';
import ReportTable from '../../components/admin/ReportTable';
import Loading from '../../components/common/Loading';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { userService } from '../../services/userService';
import { pinService } from '../../services/pinService';
import { toast } from '../../context/ToastContext';

export default function Reports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  // Delete modal state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await userService.getReports({
        status: filterStatus === 'all' ? '' : filterStatus,
      });
      const reportList = Array.isArray(data) ? data : (data?.reports || appStore.getReports() || []);
      setReports(reportList);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filterStatus]);

  const handleStatusUpdate = async (reportId, newStatus) => {
    try {
      await userService.updateReportStatus(reportId, newStatus);
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
      );
      toast.success(`Report status updated to ${newStatus}.`);
    } catch (err) {
      toast.error(err.message || 'Failed to update report');
    }
  };

  const handleDeleteTrigger = (report) => {
    setReportToDelete(report);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reportToDelete) return;
    setIsDeleting(true);
    try {
      // Delete the pin
      await pinService.deletePin(reportToDelete.pin_id);
      // Mark report as resolved
      await userService.updateReportStatus(reportToDelete.id, 'resolved');
      setReports((prev) =>
        prev.map((r) => (r.id === reportToDelete.id ? { ...r, status: 'resolved' } : r))
      );
      setDeleteConfirmOpen(false);
      toast.success('Reported content removed and marked resolved.');
    } catch (err) {
      toast.error(err.message || 'Failed to remove reported content');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/admin')}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-300 dark:hover:border-slate-700 transition-all cursor-pointer"
      >
        <IconArrowLeft size={15} />
        Back to Admin Dashboard
      </button>

      <PageHeader
        title="Content Moderation Reports"
        description="Inspect and act on user reports for spam, inappropriate content, copyright infringement, or misleading information."
        actions={
          <SegmentedControl
            size="xs"
            radius="xl"
            value={filterStatus}
            onChange={setFilterStatus}
            data={[
              { label: 'All', value: 'all' },
              { label: 'Pending', value: 'pending' },
              { label: 'Reviewing', value: 'reviewing' },
              { label: 'Resolved', value: 'resolved' },
              { label: 'Rejected', value: 'rejected' },
            ]}
          />
        }
      />

      {loading ? (
        <Loading message="Loading reports queue..." />
      ) : reports.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-sm">
          No reports found for the selected filter.
        </div>
      ) : (
        <ReportTable
          reports={reports}
          onStatusUpdate={handleStatusUpdate}
          onDeleteReportedContent={handleDeleteTrigger}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        opened={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Reported Content"
        message={`Are you sure you want to permanently delete "${reportToDelete?.pin_title || 'this pin'}" due to violation (${reportToDelete?.reason})? The report will be marked resolved.`}
        loading={isDeleting}
      />
    </div>
  );
}
