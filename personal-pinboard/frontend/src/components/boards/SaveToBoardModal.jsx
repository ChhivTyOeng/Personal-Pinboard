import React, { useState, useEffect } from 'react';
import { Modal, TextInput, Button, Badge } from '@mantine/core';
import {
  IconBookmark,
  IconSearch,
  IconPlus,
  IconCheck,
  IconLock,
  IconFolder,
} from '@tabler/icons-react';
import { boardService } from '../../services/boardService';
import { useAuth } from '../../hooks/useAuth';
import BoardForm from './BoardForm';

export default function SaveToBoardModal({
  opened,
  onClose,
  pin,
  onSaved,
}) {
  const { user } = useAuth();
  const [boards, setBoards] = useState([]);
  const [search, setSearch] = useState('');
  const [savingBoardId, setSavingBoardId] = useState(null);
  const [createBoardOpen, setCreateBoardOpen] = useState(false);

  useEffect(() => {
    if (opened) {
      loadBoards();
      setSearch('');
    }
  }, [opened]);

  const loadBoards = async () => {
    try {
      const data = await boardService.getUserBoards(user?.id || 2);
      setBoards(data || []);
    } catch (err) {
      console.error('Failed to load boards for save modal:', err);
    }
  };

  const handleSaveToBoard = async (board) => {
    if (!pin) return;
    setSavingBoardId(board.id);
    try {
      await boardService.savePinToBoard(board.id, pin.id);
      if (onSaved) {
        onSaved(board, pin);
      }
      onClose();
    } catch (err) {
      console.error('Failed to save pin to board:', err);
    } finally {
      setSavingBoardId(null);
    }
  };

  const handleCreateAndSave = async (boardData) => {
    try {
      const newBoard = await boardService.createBoard(boardData);
      setBoards((prev) => [newBoard, ...prev]);
      setCreateBoardOpen(false);
      // Automatically save pin to newly created board!
      if (pin) {
        await handleSaveToBoard(newBoard);
      }
    } catch (err) {
      console.error('Failed to create board:', err);
    }
  };

  const filteredBoards = boards.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Modal
        opened={opened && !createBoardOpen}
        onClose={onClose}
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <IconBookmark size={18} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base leading-tight">
                Save to Board
              </h3>
              <p className="text-xs text-slate-400">Choose a collection for this idea</p>
            </div>
          </div>
        }
        centered
        radius="xl"
        size="sm"
        overlayProps={{
          backgroundOpacity: 0.6,
          blur: 4,
        }}
        styles={{
          content: {
            borderRadius: '1.5rem',
            maxWidth: '440px',
          },
          header: {
            paddingBottom: '0.75rem',
            borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
          },
        }}
      >
        <div className="space-y-3 pt-2">
          {/* Quick Pin Thumbnail Banner */}
          {pin && (
            <div className="flex items-center gap-3 p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <img
                src={pin.image_url}
                alt={pin.title}
                className="w-12 h-12 rounded-xl object-cover shadow-2xs shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {pin.title}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  by {pin.author_name || pin.username}
                </p>
              </div>
            </div>
          )}

          {/* Search Boards Input */}
          <TextInput
            placeholder="Search your boards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            radius="xl"
            leftSection={<IconSearch size={15} className="text-slate-400" />}
            size="sm"
          />

          {/* Boards List */}
          <div className="max-h-60 overflow-y-auto space-y-1.5 pr-2.5 modal-scrollbar">
            {filteredBoards.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                {search ? 'No boards matching your search.' : 'No boards created yet.'}
              </div>
            ) : (
              filteredBoards.map((board) => {
                const isCurrentlySaved = pin && pin.board_id === board.id;
                const isSaving = savingBoardId === board.id;
                const cover = board.cover_image_url || (board.preview_images && board.preview_images[0]);

                return (
                  <div
                    key={board.id}
                    className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                        {cover ? (
                          <img
                            src={cover}
                            alt={board.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <IconFolder size={20} className="text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {board.name}
                          </p>
                          {board.is_private && (
                            <IconLock size={12} className="text-slate-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {board.pins_count || 0} pins
                        </p>
                      </div>
                    </div>

                    <Button
                      size="xs"
                      radius="xl"
                      color={isCurrentlySaved ? 'gray' : 'brandRed'}
                      variant={isCurrentlySaved ? 'light' : 'filled'}
                      loading={isSaving}
                      onClick={() => handleSaveToBoard(board)}
                      className={
                        isCurrentlySaved
                          ? 'font-semibold text-xs'
                          : 'bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs'
                      }
                    >
                      {isCurrentlySaved ? (
                        <span className="flex items-center gap-1">
                          <IconCheck size={13} /> Saved
                        </span>
                      ) : (
                        'Save'
                      )}
                    </Button>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Action: Create Board */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCreateBoardOpen(true)}
              className="w-full py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              <IconPlus size={16} className="text-brand-600" />
              <span>Create New Board</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Embedded Create Board Dialog */}
      {createBoardOpen && (
        <BoardForm
          opened={createBoardOpen}
          onClose={() => setCreateBoardOpen(false)}
          onSubmit={handleCreateAndSave}
        />
      )}
    </>
  );
}
