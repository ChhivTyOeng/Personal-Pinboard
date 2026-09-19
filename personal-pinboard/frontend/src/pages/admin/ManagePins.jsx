import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SegmentedControl, Badge } from '@mantine/core';
import { IconArrowLeft, IconPin } from '@tabler/icons-react';
import PageHeader from '../../components/common/PageHeader';
import PinTable from '../../components/admin/PinTable';
import SearchInput from '../../components/common/SearchInput';
import Loading from '../../components/common/Loading';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { pinService } from '../../services/pinService';
import { toast } from '../../context/ToastContext';

export default function ManagePins() {
  const navigate = useNavigate();
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Delete modal state
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pinToDelete, setPinToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPins = async () => {
    setLoading(true);
    try {
      let rawData = await pinService.getAllPins({ search, includeHidden: true });
      let data = Array.isArray(rawData) ? rawData : (rawData?.pins || []);
      if (statusFilter === 'hidden') {
        data = data.filter((p) => p.is_hidden);
      } else if (statusFilter === 'public') {
        data = data.filter((p) => !p.is_hidden && !p.is_private);
      }
      setPins(data);
    } catch (err) {
      console.error('Failed to load pins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPins();
  }, [search, statusFilter]);

  const handleToggleHide = async (pin) => {
    const nextHidden = !pin.is_hidden;
    try {
      await pinService.updatePin(pin.id, { is_hidden: nextHidden });
      setPins((prev) =>
        prev.map((p) => (p.id === pin.id ? { ...p, is_hidden: nextHidden } : p))
      );
      toast.success(
        nextHidden ? 'Pin has been hidden from public feed.' : 'Pin restored to public feed.'
      );
    } catch (err) {
      toast.error('Failed to update pin visibility');
    }
  };

  const handleDeleteTrigger = (pin) => {
    setPinToDelete(pin);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pinToDelete) return;
    setIsDeleting(true);
    try {
      await pinService.deletePin(pinToDelete.id);
      setPins((prev) => prev.filter((p) => p.id !== pinToDelete.id));
      setConfirmDeleteOpen(false);
      toast.success('Pin removed from network.');
    } catch (err) {
      toast.error(err.message || 'Failed to delete pin');
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
        title="Manage Content & Pins"
        description="Review all published visual pins across the network, inspect details, and delete inappropriate content."
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="max-w-md flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            onClear={() => setSearch('')}
            placeholder="Filter pins by title, tags, or description..."
            size="sm"
          />
        </div>

        <SegmentedControl
          size="xs"
          radius="xl"
          value={statusFilter}
          onChange={setStatusFilter}
          data={[
            { label: 'All Pins', value: 'all' },
            { label: 'Public Feed', value: 'public' },
            { label: 'Hidden from Public', value: 'hidden' },
          ]}
        />
      </div>

      {loading ? (
        <Loading message="Loading pins moderation list..." />
      ) : pins.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <IconPin size={24} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No pins in moderation queue</h3>
          <p className="text-xs text-slate-400 mt-1">
            {search ? 'No pins match your search query.' : 'There are currently no visual pins published on the platform.'}
          </p>
        </div>
      ) : (
        <PinTable
          pins={pins}
          onDeletePin={handleDeleteTrigger}
          onToggleHidePin={handleToggleHide}
        />
      )}

      {/* Confirmation Dialog preventing accidental deletion */}
      <ConfirmDialog
        opened={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Pin"
        message="Are you sure you want to delete this pin? This action cannot be undone and will remove the pin and its associated comments."
        loading={isDeleting}
      />
    </div>
  );
}
