import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, TextInput, Avatar, Badge } from '@mantine/core';
import { IconSearch, IconX, IconUser, IconArrowRight } from '@tabler/icons-react';
import { appStore } from '../../services/store';
import { useAuth } from '../../hooks/useAuth';

export default function SearchUserModal({ opened, onClose }) {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (opened) {
      const users = appStore.getUsers() || [];
      setAllUsers(users);
      setQuery('');
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [opened]);

  // Filter users by username (supports typing with or without @ prefix, case-insensitive)
  const filteredUsers = query.trim()
    ? allUsers.filter((u) => {
        const cleanQuery = query.trim().replace(/^@/, '').toLowerCase();
        const username = (u.username || '').toLowerCase();
        const fullName = (u.full_name || '').toLowerCase();
        return username.includes(cleanQuery) || fullName.includes(cleanQuery);
      })
    : allUsers;

  const handleSelectUser = (user) => {
    onClose();
    if (currentUser && Number(currentUser.id) === Number(user.id)) {
      navigate('/profile');
    } else {
      navigate(`/profile/${user.id}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && filteredUsers.length > 0) {
      handleSelectUser(filteredUsers[0]);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      radius="28px"
      size="md"
      centered
      padding={0}
      zIndex={1000}
      overlayProps={{
        backgroundOpacity: 0.6,
        blur: 5,
      }}
      styles={{
        content: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
        body: {
          padding: 0,
        },
      }}
      className="select-none"
    >
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 overflow-hidden text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Title and Close Button */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-100 dark:border-brand-900/50 shadow-xs">
              <IconSearch size={20} stroke={2.5} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight tracking-tight">
                Search Users by Username
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Find and inspect creator profiles by @username
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <IconX size={18} stroke={2.2} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Search Input Bar */}
          <div className="relative">
            <TextInput
              ref={inputRef}
              placeholder="Type @username to search (e.g. @alex, @sarah, @marcus)..."
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
              leftSection={<IconSearch size={16} className="text-slate-400" />}
              rightSection={
                query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      if (inputRef.current) inputRef.current.focus();
                    }}
                    className="w-5 h-5 rounded-full flex items-center justify-center bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <IconX size={12} />
                  </button>
                ) : null
              }
              radius="xl"
              size="md"
              classNames={{
                input: 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-100 focus:border-brand-500',
              }}
              className="shadow-2xs"
            />
          </div>

          {/* Section Header with Result Count */}
          <div className="flex items-center justify-between px-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold flex items-center gap-1.5">
              {query.trim() ? (
                <>
                  <span>Results for</span>
                  <span className="font-bold text-slate-900 dark:text-white">"{query}"</span>
                </>
              ) : (
                <span>Suggested Creators & Members</span>
              )}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
            </span>
          </div>

          {/* User Results List */}
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1 modal-scrollbar">
            {filteredUsers.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <IconUser size={22} />
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No users found
                </p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  No user matches "{query}". Try checking the spelling or searching another username.
                </p>
              </div>
            ) : (
              filteredUsers.map((u) => {
                const isCurrent = currentUser && Number(currentUser.id) === Number(u.id);
                return (
                  <div
                    key={u.id}
                    onClick={() => handleSelectUser(u)}
                    className="group flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50/70 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 border border-slate-200/70 dark:border-slate-800/80 transition-all cursor-pointer hover:shadow-2xs active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <Avatar
                          src={u.avatar_url}
                          alt={u.full_name || u.username}
                          radius="xl"
                          size={44}
                          className="ring-2 ring-slate-200/80 dark:ring-slate-700 group-hover:ring-brand-500/50 transition-all"
                        />
                        {u.status === 'active' && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-tight font-mono">
                            @{u.username}
                          </p>
                          {isCurrent && (
                            <Badge size="xs" color="gray" variant="light">
                              You
                            </Badge>
                          )}
                          {u.role === 'admin' && (
                            <Badge size="xs" color="red" variant="filled">
                              Admin
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5">
                          {u.full_name || u.username}
                        </p>

                        {u.bio && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 font-normal">
                            {u.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="hidden sm:flex flex-col items-end text-[10.5px] text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {u.pins_count || 0} pins
                        </span>
                        <span>{u.boards_count || 0} boards</span>
                      </div>

                      <button
                        type="button"
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-slate-700 group-hover:bg-brand-600 text-slate-400 group-hover:text-white shadow-2xs border border-slate-200 dark:border-slate-600 group-hover:border-brand-600 transition-all cursor-pointer"
                        aria-label="View user profile"
                      >
                        <IconArrowRight size={14} stroke={2.5} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Hint */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Enter</kbd> to open first match</span>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-semibold cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
