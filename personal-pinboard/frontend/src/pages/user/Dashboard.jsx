import React, { useState, useEffect } from 'react';
import { Button, Group, Badge, Modal, ActionIcon, Tooltip } from '@mantine/core';
import {
  IconPin,
  IconBookmark,
  IconHeart,
  IconCategory,
  IconPlus,
  IconSparkles,
  IconArrowRight,
  IconX,
  IconCompass,
  IconClock,
  IconUsers,
} from '@tabler/icons-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { pinService } from '../../services/pinService';
import { boardService } from '../../services/boardService';
import { categoryService } from '../../services/categoryService';
import PinGrid from '../../components/pins/PinGrid';
import PinDetails from '../../components/pins/PinDetails';
import BoardForm from '../../components/boards/BoardForm';
import Loading from '../../components/common/Loading';
import FriendShareCircle from '../../components/common/FriendShareCircle';
import { toast } from '../../context/ToastContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pins, setPins] = useState([]);
  const [boards, setBoards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPin, setSelectedPin] = useState(null);
  const [boardModalOpen, setBoardModalOpen] = useState(false);
  const [createdBoardNotification, setCreatedBoardNotification] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [allPins, userBoards, allCats] = await Promise.all([
          pinService.getAllPins(),
          boardService.getUserBoards(user?.id || 2),
          categoryService.getCategories(),
        ]);
        setPins(Array.isArray(allPins) ? allPins : (allPins?.pins || []));
        setBoards(Array.isArray(userBoards) ? userBoards : (userBoards?.boards || []));
        setCategories(Array.isArray(allCats) ? allCats : (allCats?.categories || []));
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleCreateBoard = async (data) => {
    try {
      const newBoard = await boardService.createBoard(data);
      setBoards((prev) => [newBoard, ...prev]);
      setBoardModalOpen(false);
      setCreatedBoardNotification(newBoard.name);
      setTimeout(() => setCreatedBoardNotification(null), 4000);
      toast.success(`Board "${newBoard.name}" created!`);
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      toast.error(err.message || 'Failed to create board');
    }
  };

  const handleDeletePin = (deletedId) => {
    setPins((prev) => prev.filter((p) => p.id !== deletedId));
    if (selectedPin && selectedPin.id === deletedId) {
      setSelectedPin(null);
    }
  };

  if (loading) return <Loading message="Preparing your creative dashboard..." />;

  // Filter pins by selected category chip
  const filteredPins = selectedCategory
    ? pins.filter((p) => p.category_id === selectedCategory)
    : pins;

  return (
    <div className="space-y-6 relative pb-20">
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-600 animate-pulse"></span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Your Ideas
            </h1>
            <Badge variant="light" color="red" size="sm" className="font-bold">
              {filteredPins.length} {filteredPins.length === 1 ? 'Pin' : 'Pins'}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Discover and curate visual inspirations, study references, and moodboards.
          </p>
        </div>

        {/* Quick actions */}
        <Group gap="xs">
          <Button
            variant="default"
            radius="xl"
            size="sm"
            leftSection={<IconBookmark size={16} />}
            onClick={() => setBoardModalOpen(true)}
            className="dark:border-slate-700 dark:text-slate-200"
          >
            New Board
          </Button>
          <Button
            color="brandRed"
            radius="xl"
            size="sm"
            leftSection={<IconPlus size={16} />}
            onClick={() => navigate('/pins/create')}
            className="bg-brand-600 hover:bg-brand-700 shadow-xs font-bold"
          >
            Create Pin
          </Button>
        </Group>
      </div>

      {/* 5-Friend Private Circle Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-indigo-50/80 via-white to-rose-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border border-indigo-100 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <IconUsers size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Private Friend Circle
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                  Max 5 Friends Rule
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Private visual sharing with your close circle. Click any friend's avatar to visit their real account.
              </p>
            </div>
          </div>

          {/* Interactive Friend Avatars with navigation to /profile/:id */}
          <FriendShareCircle compact={true} />
        </div>
      </div>

      {/* Category Chips Bar: [ All ] [ Architecture ] [ Art & Design ] [ Study & Tech ] [ Workspaces ] */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar pt-1">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
            selectedCategory === null
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
          }`}
        >
          All Ideas
        </button>

        <button
          onClick={() => navigate('/pins?recent=true')}
          className="px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 cursor-pointer bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 hover:text-brand-600"
        >
          <IconClock size={14} />
          <span>Recently Viewed</span>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Dynamic Masonry Feed: Pin Image is the Main Focus */}
      <PinGrid
        pins={filteredPins}
        loading={false}
        onDelete={handleDeletePin}
        onOpenModal={(pin) => setSelectedPin(pin)}
        emptyTitle="No ideas found in this category"
        emptyDescription="Start saving inspiration to this category or explore other topics."
      />

      {/* Floating Action Button (FAB): ＋ Create Pin fixed at bottom-right on desktop */}
      <div className="fixed bottom-8 right-8 z-40 hidden sm:block">
        <Tooltip label="Save a new pin" position="left" withArrow>
          <button
            onClick={() => navigate('/pins/create')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-black text-sm shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 active:scale-95 cursor-pointer group"
            aria-label="Create Pin"
          >
            <IconPlus
              size={20}
              stroke={3}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
            <span>Create Pin</span>
          </button>
        </Tooltip>
      </div>

      {/* Smooth Inline Modal for Pin Details */}
      <Modal
        opened={!!selectedPin}
        onClose={() => setSelectedPin(null)}
        size="72rem"
        radius="2xl"
        padding="lg"
        yOffset="2rem"
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.65,
          blur: 4,
        }}
        classNames={{
          content: 'bg-transparent shadow-none',
          body: 'p-0',
        }}
      >
        {selectedPin && (
          <div className="relative">
            <PinDetails
              pin={selectedPin}
              isModal={true}
              onClose={() => setSelectedPin(null)}
              onDelete={handleDeletePin}
            />
          </div>
        )}
      </Modal>

      {/* Modal for Creating New Board */}
      {boardModalOpen && (
        <BoardForm
          opened={boardModalOpen}
          onClose={() => setBoardModalOpen(false)}
          onSubmit={handleCreateBoard}
        />
      )}

      {/* Quick feedback toast notification when board is created */}
      {createdBoardNotification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md text-sm font-semibold border border-slate-700/50 dark:border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Board &quot;{createdBoardNotification}&quot; created!</span>
          <button
            onClick={() => navigate('/boards')}
            className="underline font-bold text-brand-400 dark:text-brand-600 hover:opacity-80 ml-1 cursor-pointer inline-flex items-center gap-1 group"
          >
            <span>View in My Boards</span>
            <IconArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      )}
    </div>
  );
}
