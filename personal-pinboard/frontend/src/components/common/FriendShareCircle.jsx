import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip, Modal, Button } from '@mantine/core';
import {
  IconUsers,
  IconUserPlus,
  IconExternalLink,
  IconX,
  IconCheck,
  IconSparkles,
  IconArrowRight,
  IconTrash,
  IconShieldCheck,
} from '@tabler/icons-react';
import { friendService } from '../../services/friendService';
import { toast } from '../../context/ToastContext';

const MAX_FRIENDS = 5;

export default function FriendShareCircle({
  title = 'Friends You Share With',
  subtitle = 'Private visual sharing with your close circle (Max 5 friends). Click any friend to visit their real account.',
  showManagement = true,
  compact = false,
  className = '',
}) {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [friendToRemove, setFriendToRemove] = useState(null);

  const loadFriends = async () => {
    try {
      const list = await friendService.getFriends();
      setFriends(list || []);
      const suggested = await friendService.getSuggestedFriends();
      setSuggestedUsers(suggested || []);
    } catch (err) {
      console.error('Failed to load friends:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFriends();

    const handleUpdate = () => loadFriends();
    window.addEventListener('pinboard-store-update', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('pinboard-store-update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleNavigateToFriend = (friend) => {
    const friendId = friend.friend_id || friend.id;
    if (!friendId) return;
    navigate(`/profile/${friendId}`);
  };

  const handleAddFriend = async (user) => {
    if (friends.length >= MAX_FRIENDS) {
      toast.error(`You have reached the maximum limit of ${MAX_FRIENDS} friends.`);
      return;
    }

    try {
      await friendService.addFriend({
        friend_id: user.id,
        username: user.username,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        bio: user.bio,
      });
      toast.success(`@${user.username} added to your 5-friend circle!`);
      loadFriends();
      setAddModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to add friend');
    }
  };

  const handleConfirmRemove = async () => {
    if (!friendToRemove) return;
    try {
      await friendService.removeFriend(friendToRemove.friend_id || friendToRemove.id);
      toast.info(`Removed @${friendToRemove.username} from your circle. A slot is now open.`);
      setFriendToRemove(null);
      loadFriends();
    } catch (err) {
      toast.error(err.message || 'Failed to remove friend');
    }
  };

  const openSlotsCount = Math.max(0, MAX_FRIENDS - friends.length);

  // Compact variant for banners or dashboards
  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex -space-x-2.5 overflow-hidden py-1">
          {friends.map((friend) => (
            <Tooltip
              key={friend.id || friend.friend_id}
              label={`Visit @${friend.username} (${friend.full_name})`}
              withArrow
            >
              <button
                type="button"
                onClick={() => handleNavigateToFriend(friend)}
                className="relative inline-block h-9 w-9 rounded-full ring-2 ring-white dark:ring-slate-900 transition-transform duration-150 hover:scale-110 hover:z-10 cursor-pointer focus:outline-none"
              >
                <img
                  src={friend.avatar_url}
                  alt={friend.full_name || friend.username}
                  className="h-full w-full rounded-full object-cover shadow-xs"
                />
                {friend.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>
            </Tooltip>
          ))}

          {Array.from({ length: openSlotsCount }).map((_, i) => (
            <Tooltip key={`slot-${i}`} label="Available slot (Max 5 friends)" withArrow>
              <button
                type="button"
                onClick={() => setAddModalOpen(true)}
                className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 text-xs font-bold ring-2 ring-white dark:ring-slate-900 transition-all cursor-pointer"
              >
                +1
              </button>
            </Tooltip>
          ))}
        </div>

        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 pl-1">
          <strong className="text-indigo-600 dark:text-indigo-400 font-extrabold">{friends.length}</strong> / {MAX_FRIENDS} Friends
        </span>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header section with rule notification */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-2xs">
            <IconUsers size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {title}
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900/60">
                {friends.length} / {MAX_FRIENDS} Friends Connected
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Max 5 rule
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          </div>
        </div>

        {showManagement && openSlotsCount > 0 && (
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 h-9 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <IconUserPlus size={15} />
            <span>Add Friend ({openSlotsCount} open)</span>
          </button>
        )}
      </div>

      {/* Grid of Friends: 5 interactive cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {friends.map((friend) => {
          const friendId = friend.friend_id || friend.id;
          return (
            <div
              key={friendId}
              onClick={() => handleNavigateToFriend(friend)}
              className="group relative flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/90 hover:bg-indigo-50/50 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/80 hover:border-indigo-300 dark:border-slate-700/80 dark:hover:border-indigo-500/50 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                {/* Real Clickable Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={friend.avatar_url}
                    alt={friend.full_name || friend.username}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 group-hover:scale-105 transition-transform duration-200 shadow-2xs"
                  />
                  {friend.online ? (
                    <span
                      title="Online now"
                      className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"
                    />
                  ) : (
                    <span
                      title="Offline"
                      className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600 ring-2 ring-white dark:ring-slate-900"
                    />
                  )}
                </div>

                {/* Friend Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {friend.full_name || friend.username}
                    </h4>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 truncate">
                    @{friend.username}
                  </p>

                  {/* Shared Category Pill */}
                  {friend.shared_categories && friend.shared_categories.length > 0 && (
                    <div className="mt-1 flex items-center gap-1 flex-wrap">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-bold bg-white dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-600">
                        {friend.shared_categories[0]}
                      </span>
                      {friend.shared_categories.length > 1 && (
                        <span className="text-[9px] font-semibold text-slate-400">
                          +{friend.shared_categories.length - 1}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons on card */}
              <div className="flex items-center gap-1 shrink-0">
                {showManagement && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFriendToRemove(friend);
                    }}
                    title="Remove from 5-friend circle"
                    className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 opacity-60 group-hover:opacity-100 transition-all cursor-pointer"
                  >
                    <IconTrash size={14} />
                  </button>
                )}

                <span
                  title="Click to visit account page"
                  className="p-1.5 rounded-lg text-indigo-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:bg-indigo-100/70 dark:group-hover:bg-indigo-950/50 transition-all"
                >
                  <IconArrowRight size={15} />
                </span>
              </div>
            </div>
          );
        })}

        {/* Empty Available Slots (< 5) */}
        {Array.from({ length: openSlotsCount }).map((_, idx) => (
          <button
            key={`open-slot-${idx}`}
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="flex items-center justify-center gap-2.5 p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white/50 hover:bg-indigo-50/30 dark:bg-slate-900/40 dark:hover:bg-indigo-950/20 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-all duration-150 cursor-pointer min-h-[76px]"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-600">
              <IconUserPlus size={16} />
            </div>
            <div className="text-left">
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Slot {friends.length + idx + 1} of {MAX_FRIENDS} Available
              </span>
              <span className="block text-[11px] text-slate-400">Click to invite friend</span>
            </div>
          </button>
        ))}
      </div>

      {/* Helpful notification hint */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100/80 dark:border-indigo-900/40 text-[11px] text-indigo-900 dark:text-indigo-200">
        <div className="flex items-center gap-2">
          <IconShieldCheck size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>
            <strong>Private Sharing Active:</strong> Only these 5 friends can view your private categories and exchange moodboard comments.
          </span>
        </div>
        <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0 hidden sm:inline">
          {MAX_FRIENDS - friends.length === 0 ? 'Full Circle (5/5)' : `${openSlotsCount} Slot${openSlotsCount > 1 ? 's' : ''} Open`}
        </span>
      </div>

      {/* Add / Invite Friend Modal */}
      <Modal
        opened={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <IconUserPlus size={18} className="text-indigo-600" />
            <span className="font-bold text-slate-900 dark:text-white">
              Add to 5-Friend Private Circle
            </span>
          </div>
        }
        radius="lg"
        centered
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select a curator to add to your private circle ({friends.length}/{MAX_FRIENDS} slots used).
          </p>

          {suggestedUsers.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-xs">
              All registered creative friends are currently in your sharing circle.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {suggestedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <img
                      src={user.avatar_url}
                      alt={user.full_name || user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.full_name || user.username}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">@{user.username}</p>
                    </div>
                  </div>

                  <Button
                    size="xs"
                    radius="xl"
                    color="indigo"
                    onClick={() => handleAddFriend(user)}
                    leftSection={<IconUserPlus size={13} />}
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button variant="subtle" color="gray" size="sm" onClick={() => setAddModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Remove Confirmation Dialog */}
      <Modal
        opened={!!friendToRemove}
        onClose={() => setFriendToRemove(null)}
        title={
          <span className="font-bold text-slate-900 dark:text-white">
            Remove from 5-Friend Circle?
          </span>
        }
        radius="lg"
        centered
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Are you sure you want to remove <strong>@{friendToRemove?.username}</strong> ({friendToRemove?.full_name}) from your 5-friend sharing circle? You will have 1 available slot to add another friend.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="default" size="xs" radius="xl" onClick={() => setFriendToRemove(null)}>
              Cancel
            </Button>
            <Button color="red" size="xs" radius="xl" onClick={handleConfirmRemove}>
              Remove Friend
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
