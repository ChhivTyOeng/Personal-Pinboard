import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  IconHome,
  IconCompass,
  IconPlus,
  IconBookmark,
  IconUser,
  IconShield,
  IconPin,
  IconCategory,
  IconUsers,
  IconFlag,
} from '@tabler/icons-react';
import { Avatar, Modal } from '@mantine/core';
import { useAuth } from '../../hooks/useAuth';
import { appStore } from '../../services/store';
import BoardForm from '../boards/BoardForm';
import { boardService } from '../../services/boardService';

export default function MobileBottomNav() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [boardCount, setBoardCount] = useState(0);
  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const [createBoardOpen, setCreateBoardOpen] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      const boards = appStore.getBoards() || [];
      setBoardCount(boards.length);
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('pinboard-store-update', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('pinboard-store-update', updateCount);
    };
  }, []);

  const handleCreateBoardSubmit = async (data) => {
    try {
      await boardService.createBoard(data);
      setCreateBoardOpen(false);
      navigate('/boards');
    } catch (err) {
      console.error('Failed to create board:', err);
    }
  };

  const isAdmin = user?.role === 'admin';

  // Active route helpers for regular users
  const isHomeActive = location.pathname === '/dashboard';
  const isExploreActive =
    location.pathname === '/pins' ||
    (location.pathname.startsWith('/pins/') && !location.pathname.includes('/create'));
  const isBoardsActive = location.pathname.startsWith('/boards');
  const isProfileActive = location.pathname.startsWith('/profile');

  // Active route helpers for administrators
  const isAdminDashboardActive = location.pathname === '/admin';
  const isAdminPinsActive = location.pathname.startsWith('/admin/pins');
  const isAdminCategoriesActive =
    location.pathname.startsWith('/admin/categories') || location.pathname.startsWith('/admin/tags');
  const isAdminUsersActive = location.pathname.startsWith('/admin/users');
  const isAdminReportsActive = location.pathname.startsWith('/admin/reports');

  return (
    <>
      {/* 
        Floating Capsule Island Bar (Exact UI/UX from reference)
        - Perfectly centered with left-1/2 -translate-x-1/2
        - Floating bottom-5 above screen bottom
        - Smooth rounded-[24px] capsule shape
        - Dark mode: deep obsidian #12151D with subtle white border & deep shadow
        - Light mode: crisp white with slate border & soft shadow
      */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-5 left-1/2 -translate-x-1/2 sm:hidden z-50 w-[calc(100%-2rem)] max-w-[348px] select-none pointer-events-auto"
      >
        <div className="h-[58px] px-1.5 bg-white/92 dark:bg-[#12151D]/92 backdrop-blur-2xl border border-slate-200/90 dark:border-white/[0.1] rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.7)] grid grid-cols-5 items-center justify-items-center transition-colors duration-200">
          {isAdmin ? (
            <>
              {/* Admin 1: Overview */}
              <NavLink
                to="/admin"
                aria-label="Admin Overview"
                className="flex flex-col items-center justify-center w-full h-full cursor-pointer group active:scale-90 transition-transform duration-150"
              >
                <div className="flex flex-col items-center justify-center">
                  <IconShield
                    size={22}
                    stroke={isAdminDashboardActive ? 2.3 : 1.8}
                    className={`transition-all duration-200 ${
                      isAdminDashboardActive
                        ? 'text-brand-600 dark:text-rose-400 scale-105 drop-shadow-[0_0_8px_rgba(230,0,35,0.4)] dark:drop-shadow-[0_0_10px_rgba(251,113,133,0.6)]'
                        : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    }`}
                  />
                  <span
                    className={`w-3.5 h-[2px] rounded-full mt-1 transition-all duration-200 ${
                      isAdminDashboardActive
                        ? 'bg-brand-600 dark:bg-rose-400 shadow-[0_0_6px_rgba(230,0,35,0.4)] dark:shadow-[0_0_8px_rgba(251,113,133,0.6)]'
                        : 'bg-transparent'
                    }`}
                  />
                </div>
              </NavLink>

              {/* Admin 2: Moderate Pins */}
              <NavLink
                to="/admin/pins"
                aria-label="Moderate Pins"
                className="flex flex-col items-center justify-center w-full h-full cursor-pointer group active:scale-90 transition-transform duration-150"
              >
                <div className="flex flex-col items-center justify-center">
                  <IconPin
                    size={22}
                    stroke={isAdminPinsActive ? 2.3 : 1.8}
                    className={`transition-all duration-200 ${
                      isAdminPinsActive
                        ? 'text-brand-600 dark:text-rose-400 scale-105 drop-shadow-[0_0_8px_rgba(230,0,35,0.4)] dark:drop-shadow-[0_0_10px_rgba(251,113,133,0.6)]'
                        : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    }`}
                  />
                  <span
                    className={`w-3.5 h-[2px] rounded-full mt-1 transition-all duration-200 ${
                      isAdminPinsActive
                        ? 'bg-brand-600 dark:bg-rose-400 shadow-[0_0_6px_rgba(230,0,35,0.4)] dark:shadow-[0_0_8px_rgba(251,113,133,0.6)]'
                        : 'bg-transparent'
                    }`}
                  />
                </div>
              </NavLink>

              {/* Admin 3: Categories & Tags */}
              <NavLink
                to="/admin/categories"
                aria-label="Manage Categories"
                className="flex flex-col items-center justify-center w-full h-full cursor-pointer group active:scale-90 transition-transform duration-150"
              >
                <div className="flex flex-col items-center justify-center">
                  <IconCategory
                    size={22}
                    stroke={isAdminCategoriesActive ? 2.3 : 1.8}
                    className={`transition-all duration-200 ${
                      isAdminCategoriesActive
                        ? 'text-brand-600 dark:text-rose-400 scale-105 drop-shadow-[0_0_8px_rgba(230,0,35,0.4)] dark:drop-shadow-[0_0_10px_rgba(251,113,133,0.6)]'
                        : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    }`}
                  />
                  <span
                    className={`w-3.5 h-[2px] rounded-full mt-1 transition-all duration-200 ${
                      isAdminCategoriesActive
                        ? 'bg-brand-600 dark:bg-rose-400 shadow-[0_0_6px_rgba(230,0,35,0.4)] dark:shadow-[0_0_8px_rgba(251,113,133,0.6)]'
                        : 'bg-transparent'
                    }`}
                  />
                </div>
              </NavLink>

              {/* Admin 4: User Management */}
              <NavLink
                to="/admin/users"
                aria-label="Manage Users"
                className="flex flex-col items-center justify-center w-full h-full cursor-pointer group active:scale-90 transition-transform duration-150"
              >
                <div className="flex flex-col items-center justify-center">
                  <IconUsers
                    size={22}
                    stroke={isAdminUsersActive ? 2.3 : 1.8}
                    className={`transition-all duration-200 ${
                      isAdminUsersActive
                        ? 'text-brand-600 dark:text-rose-400 scale-105 drop-shadow-[0_0_8px_rgba(230,0,35,0.4)] dark:drop-shadow-[0_0_10px_rgba(251,113,133,0.6)]'
                        : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    }`}
                  />
                  <span
                    className={`w-3.5 h-[2px] rounded-full mt-1 transition-all duration-200 ${
                      isAdminUsersActive
                        ? 'bg-brand-600 dark:bg-rose-400 shadow-[0_0_6px_rgba(230,0,35,0.4)] dark:shadow-[0_0_8px_rgba(251,113,133,0.6)]'
                        : 'bg-transparent'
                    }`}
                  />
                </div>
              </NavLink>

              {/* Admin 5: Safety Reports */}
              <NavLink
                to="/admin/reports"
                aria-label="Safety Reports"
                className="flex flex-col items-center justify-center w-full h-full cursor-pointer group active:scale-90 transition-transform duration-150"
              >
                <div className="flex flex-col items-center justify-center">
                  <IconFlag
                    size={22}
                    stroke={isAdminReportsActive ? 2.3 : 1.8}
                    className={`transition-all duration-200 ${
                      isAdminReportsActive
                        ? 'text-brand-600 dark:text-rose-400 scale-105 drop-shadow-[0_0_8px_rgba(230,0,35,0.4)] dark:drop-shadow-[0_0_10px_rgba(251,113,133,0.6)]'
                        : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    }`}
                  />
                  <span
                    className={`w-3.5 h-[2px] rounded-full mt-1 transition-all duration-200 ${
                      isAdminReportsActive
                        ? 'bg-brand-600 dark:bg-rose-400 shadow-[0_0_6px_rgba(230,0,35,0.4)] dark:shadow-[0_0_8px_rgba(251,113,133,0.6)]'
                        : 'bg-transparent'
                    }`}
                  />
                </div>
              </NavLink>
            </>
          ) : (
            <>
              {/* 1. Home Tab */}
              <NavLink
                to="/dashboard"
                aria-label="Home"
                className="flex flex-col items-center justify-center w-full h-full cursor-pointer group active:scale-90 transition-transform duration-150"
              >
                <div className="flex flex-col items-center justify-center">
                  <IconHome
                    size={22}
                    stroke={isHomeActive ? 2.3 : 1.8}
                    className={`transition-all duration-200 ${
                      isHomeActive
                        ? 'text-brand-600 dark:text-rose-400 scale-105 drop-shadow-[0_0_8px_rgba(230,0,35,0.4)] dark:drop-shadow-[0_0_10px_rgba(251,113,133,0.6)]'
                        : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    }`}
                  />
                  <span
                    className={`w-3.5 h-[2px] rounded-full mt-1 transition-all duration-200 ${
                      isHomeActive
                        ? 'bg-brand-600 dark:bg-rose-400 shadow-[0_0_6px_rgba(230,0,35,0.4)] dark:shadow-[0_0_8px_rgba(251,113,133,0.6)]'
                        : 'bg-transparent'
                    }`}
                  />
                </div>
              </NavLink>

              {/* 2. Explore Tab */}
              <NavLink
                to="/pins"
                aria-label="Explore Pins"
                className="flex flex-col items-center justify-center w-full h-full cursor-pointer group active:scale-90 transition-transform duration-150"
              >
                <div className="flex flex-col items-center justify-center">
                  <IconCompass
                    size={22}
                    stroke={isExploreActive ? 2.3 : 1.8}
                    className={`transition-all duration-200 ${
                      isExploreActive
                        ? 'text-brand-600 dark:text-rose-400 scale-105 drop-shadow-[0_0_8px_rgba(230,0,35,0.4)] dark:drop-shadow-[0_0_10px_rgba(251,113,133,0.6)]'
                        : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                    }`}
                  />
                  <span
                    className={`w-3.5 h-[2px] rounded-full mt-1 transition-all duration-200 ${
                      isExploreActive
                        ? 'bg-brand-600 dark:bg-rose-400 shadow-[0_0_6px_rgba(230,0,35,0.4)] dark:shadow-[0_0_8px_rgba(251,113,133,0.6)]'
                        : 'bg-transparent'
                    }`}
                  />
                </div>
              </NavLink>

              {/* 3. Center Create Action Button (+) - Perfect Pinterest / Mobbin circular FAB */}
              <button
                type="button"
                onClick={() => setCreateSheetOpen((prev) => !prev)}
                aria-label="Create new pin or board"
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-[#ff3b5c] text-white flex items-center justify-center shadow-[0_4px_14px_rgba(230,0,35,0.38)] hover:shadow-[0_6px_18px_rgba(230,0,35,0.48)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <IconPlus
                  size={20}
                  stroke={2.6}
                  className={`transition-transform duration-200 ${createSheetOpen ? 'rotate-45' : ''}`}
                />
              </button>

              {/* 4. Boards Tab */}
              <NavLink
                to="/boards"
                aria-label="Boards"
                className="flex flex-col items-center justify-center w-full h-full cursor-pointer group active:scale-90 transition-transform duration-150"
              >
                <div className="flex flex-col items-center justify-center relative">
                  <div className="relative">
                    <IconBookmark
                      size={22}
                      stroke={isBoardsActive ? 2.3 : 1.8}
                      className={`transition-all duration-200 ${
                        isBoardsActive
                          ? 'text-brand-600 dark:text-rose-400 scale-105 drop-shadow-[0_0_8px_rgba(230,0,35,0.4)] dark:drop-shadow-[0_0_10px_rgba(251,113,133,0.6)]'
                          : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                      }`}
                    />
                    {boardCount > 0 && (
                      <span className="absolute -top-1 -right-1.5 min-w-[15px] h-[15px] px-1 rounded-full text-[8.5px] font-black bg-brand-600 text-white flex items-center justify-center ring-2 ring-white dark:ring-[#12151D] shadow-xs">
                        {boardCount}
                      </span>
                    )}
                  </div>
                  <span
                    className={`w-3.5 h-[2px] rounded-full mt-1 transition-all duration-200 ${
                      isBoardsActive
                        ? 'bg-brand-600 dark:bg-rose-400 shadow-[0_0_6px_rgba(230,0,35,0.4)] dark:shadow-[0_0_8px_rgba(251,113,133,0.6)]'
                        : 'bg-transparent'
                    }`}
                  />
                </div>
              </NavLink>

              {/* 5. Profile Tab */}
              <NavLink
                to="/profile"
                aria-label="Profile"
                className="flex flex-col items-center justify-center w-full h-full cursor-pointer group active:scale-90 transition-transform duration-150"
              >
                <div className="flex flex-col items-center justify-center">
                  {user?.avatar_url ? (
                    <Avatar
                      src={user.avatar_url}
                      size={22}
                      radius="xl"
                      className={`ring-1.5 transition-all ${
                        isProfileActive
                          ? 'ring-brand-600 dark:ring-rose-400 scale-105'
                          : 'ring-slate-300 dark:ring-slate-600'
                      }`}
                    />
                  ) : (
                    <IconUser
                      size={22}
                      stroke={isProfileActive ? 2.3 : 1.8}
                      className={`transition-all duration-200 ${
                        isProfileActive
                          ? 'text-brand-600 dark:text-rose-400 scale-105 drop-shadow-[0_0_8px_rgba(230,0,35,0.4)] dark:drop-shadow-[0_0_10px_rgba(251,113,133,0.6)]'
                          : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                      }`}
                    />
                  )}
                  <span
                    className={`w-3.5 h-[2px] rounded-full mt-1 transition-all duration-200 ${
                      isProfileActive
                        ? 'bg-brand-600 dark:bg-rose-400 shadow-[0_0_6px_rgba(230,0,35,0.4)] dark:shadow-[0_0_8px_rgba(251,113,133,0.6)]'
                        : 'bg-transparent'
                    }`}
                  />
                </div>
              </NavLink>
            </>
          )}
        </div>
      </nav>

      {/* Quick Create Action Sheet Modal (User only) */}
      {!isAdmin && (
        <>
          <Modal
            opened={createSheetOpen}
            onClose={() => setCreateSheetOpen(false)}
            title={
              <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Create Ideas
              </span>
            }
            centered
            radius="2xl"
            size="xs"
            styles={{
              content: {
                borderRadius: '1.25rem',
                padding: '0.5rem',
              },
              header: {
                paddingBottom: '0.5rem',
              },
            }}
          >
            <div className="space-y-2 pb-1">
              {/* Create Pin Option */}
              <button
                type="button"
                onClick={() => {
                  setCreateSheetOpen(false);
                  navigate('/pins/create');
                }}
                className="w-full flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-brand-50 dark:hover:bg-slate-700/80 transition-all text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <IconPin size={20} stroke={2.4} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-rose-400 transition-colors">
                    Create a Pin
                  </p>
                  <p className="text-xs text-slate-400">Save visual photo, design, or link</p>
                </div>
              </button>

              {/* Create Board Option */}
              <button
                type="button"
                onClick={() => {
                  setCreateSheetOpen(false);
                  setCreateBoardOpen(true);
                }}
                className="w-full flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-brand-50 dark:hover:bg-slate-700/80 transition-all text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <IconBookmark size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-rose-400 transition-colors">
                    Create a Board
                  </p>
                  <p className="text-xs text-slate-400">Collect & organize pins into themes</p>
                </div>
              </button>
            </div>
          </Modal>

          {/* Board Creation Modal */}
          {createBoardOpen && (
            <BoardForm
              opened={createBoardOpen}
              onClose={() => setCreateBoardOpen(false)}
              onSubmit={handleCreateBoardSubmit}
            />
          )}
        </>
      )}
    </>
  );
}
