import React, { useState, useEffect } from 'react';
import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import PageHeader from '../../components/common/PageHeader';
import BoardCard from '../../components/boards/BoardCard';
import BoardForm from '../../components/boards/BoardForm';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { boardService } from '../../services/boardService';
import { useAuth } from '../../hooks/useAuth';

import ConfirmDialog from '../../components/common/ConfirmDialog';
import { toast } from '../../context/ToastContext';

export default function Boards() {
  const { user } = useAuth();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteBoardId, setDeleteBoardId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchBoards() {
      setLoading(true);
      try {
        const data = await boardService.getUserBoards(user?.id || 2);
        setBoards(Array.isArray(data) ? data : (data?.boards || []));
      } catch (err) {
        console.error('Failed to load boards:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBoards();
  }, [user]);

  const handleCreateBoard = async (formData) => {
    setSubmitting(true);
    try {
      const created = await boardService.createBoard(formData);
      setBoards((prev) => [created, ...prev]);
      setFormOpen(false);
      toast.success(`Board "${created.name}" created!`);
    } catch (err) {
      toast.error(err.message || 'Failed to create board');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteBoard = async () => {
    if (!deleteBoardId) return;
    setIsDeleting(true);
    try {
      await boardService.deleteBoard(deleteBoardId);
      setBoards((prev) => prev.filter((b) => b.id !== deleteBoardId));
      setDeleteBoardId(null);
      toast.success('Board deleted successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to delete board');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <Loading message="Loading your curated boards..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Your Boards"
        description="Organize your visual inspirations into targeted theme collections."
        actions={
          <Button
            color="brandRed"
            radius="xl"
            size="sm"
            leftSection={<IconPlus size={16} />}
            onClick={() => setFormOpen(true)}
            className="bg-brand-600 hover:bg-brand-700 shadow-sm"
          >
            Create Board
          </Button>
        }
      />

      {boards.length === 0 ? (
        <EmptyState
          title="No boards yet"
          description="Create your first board to start categorizing and collecting visual inspiration."
          actionLabel="Create Board"
          onAction={() => setFormOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              isOwner={true}
              onDelete={(id) => setDeleteBoardId(id)}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <BoardForm
          opened={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleCreateBoard}
          loading={submitting}
        />
      )}

      <ConfirmDialog
        opened={Boolean(deleteBoardId)}
        onClose={() => setDeleteBoardId(null)}
        onConfirm={confirmDeleteBoard}
        loading={isDeleting}
        title="Delete Board"
        message="Are you sure you want to delete this board? Pins inside will remain in your library, but this board collection will be removed."
        confirmLabel="Delete Board"
      />
    </div>
  );
}
