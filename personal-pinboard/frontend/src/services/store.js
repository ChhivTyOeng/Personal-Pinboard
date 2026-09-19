import {
  MOCK_USERS,
  MOCK_FRIENDS,
  MOCK_CATEGORIES,
  MOCK_BOARDS,
  MOCK_PINS,
  MOCK_COMMENTS,
  MOCK_REPORTS,
  MOCK_SETTINGS,
} from '../data/mockData';

const KEYS = {
  PINS: 'pinboard_pins_v2',
  COMMENTS: 'pinboard_comments_v2',
  REPORTS: 'pinboard_reports_v2',
  USERS: 'pinboard_users_v2',
  FRIENDS: 'pinboard_friends_v2',
  CATEGORIES: 'pinboard_categories_v2',
  BOARDS: 'pinboard_boards_v2',
  SETTINGS: 'pinboard_settings_v2',
  NOTIFICATIONS: 'pinboard_notifications_v3',
  RECENTLY_VIEWED: 'pinboard_recently_viewed_pins_v1',
  AUDIT_LOGS: 'pinboard_audit_logs_v2',
};

const DEFAULT_AUDIT_LOGS = [
  { id: 1, time: '10m ago', timestamp: Date.now() - 10 * 60 * 1000, admin: 'Alex Rivera', action: 'Promote Role', target: 'User #8 (sophia_mod)', status: 'Success' },
  { id: 2, time: '1h ago', timestamp: Date.now() - 60 * 60 * 1000, admin: 'Alex Rivera', action: 'Dismiss Report', target: 'Report #104 (Pin #2)', status: 'Success' },
  { id: 3, time: '3h ago', timestamp: Date.now() - 3 * 60 * 60 * 1000, admin: 'Alex Rivera', action: 'Update Policy', target: 'Moderation Threshold', status: 'Applied' },
  { id: 4, time: '1d ago', timestamp: Date.now() - 24 * 60 * 60 * 1000, admin: 'Alex Rivera', action: 'Account Reactivation', target: 'User #5 (david_kim)', status: 'Success' },
];

const INITIAL_NOTIFICATIONS = [];

function load(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Storage save failed:', e);
  }
}

function notify() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('pinboard-store-update'));
  }
}

const SEED_BLOGS_KEY = 'pinboard_seeded_landing_blogs_v7';
if (typeof window !== 'undefined' && localStorage.getItem(SEED_BLOGS_KEY) !== 'true') {
  localStorage.setItem(SEED_BLOGS_KEY, 'true');
  save(KEYS.PINS, MOCK_PINS);
  save(KEYS.CATEGORIES, MOCK_CATEGORIES);
  save(KEYS.BOARDS, MOCK_BOARDS);
  save(KEYS.COMMENTS, MOCK_COMMENTS);
  save(KEYS.USERS, MOCK_USERS);
  save(KEYS.REPORTS, MOCK_REPORTS);
}

class AppStore {
  constructor() {
    const loadedUsers = load(KEYS.USERS, MOCK_USERS);
    this.users = (loadedUsers && loadedUsers.length >= 2) ? loadedUsers : [...MOCK_USERS];
    const loadedPins = load(KEYS.PINS, MOCK_PINS);
    this.pins = (loadedPins && loadedPins.length > 0) ? loadedPins : [...MOCK_PINS];
    
    // Auto-sync or replace old ui-ux-designer-ref image with new photo
    this.pins = this.pins.map((p) => {
      if (p.id === 4 || p.image_url?.includes('ui-ux-designer')) {
        const fresh = MOCK_PINS.find((m) => m.id === 4);
        return fresh ? { ...fresh } : p;
      }
      return p;
    });

    MOCK_PINS.forEach((mPin) => {
      if (!this.pins.some((p) => p.id === mPin.id)) {
        this.pins.push(mPin);
      }
    });
    save(KEYS.PINS, this.pins);

    const loadedCats = load(KEYS.CATEGORIES, MOCK_CATEGORIES);
    this.categories = (loadedCats && loadedCats.length > 0) ? loadedCats : [...MOCK_CATEGORIES];
    const loadedBoards = load(KEYS.BOARDS, MOCK_BOARDS);
    this.boards = (loadedBoards && loadedBoards.length > 0) ? loadedBoards : [...MOCK_BOARDS];
    const loadedComments = load(KEYS.COMMENTS, MOCK_COMMENTS);
    this.comments = (loadedComments && loadedComments.length > 0) ? loadedComments : [...MOCK_COMMENTS];

    // Auto-sync any new mock comments into existing store
    MOCK_COMMENTS.forEach((mComment) => {
      if (!this.comments.some((c) => c.id === mComment.id)) {
        this.comments.push(mComment);
      }
    });

    const loadedReports = load(KEYS.REPORTS, MOCK_REPORTS);
    this.reports = (loadedReports && loadedReports.length > 0) ? loadedReports : [...MOCK_REPORTS];
    this.friends = load(KEYS.FRIENDS, []);
    this.notifications = load(KEYS.NOTIFICATIONS, []);
    this.settings = load(KEYS.SETTINGS, MOCK_SETTINGS);
    this.auditLogs = load(KEYS.AUDIT_LOGS, DEFAULT_AUDIT_LOGS);
  }

  clearAllData() {
    this.pins = [];
    this.boards = [];
    this.categories = [];
    this.comments = [];
    this.reports = [];
    this.friends = [];
    this.notifications = [];
    save(KEYS.PINS, []);
    save(KEYS.BOARDS, []);
    save(KEYS.CATEGORIES, []);
    save(KEYS.COMMENTS, []);
    save(KEYS.REPORTS, []);
    save(KEYS.FRIENDS, []);
    save(KEYS.NOTIFICATIONS, []);
    save(KEYS.RECENTLY_VIEWED, []);
    notify();
    return true;
  }

  // Pins
  getPins() {
    return [...this.pins];
  }

  getPinById(id) {
    return this.pins.find(p => p.id === Number(id)) || null;
  }

  addPin(pin) {
    this.pins = [pin, ...this.pins];
    save(KEYS.PINS, this.pins);

    if (pin.board_id) {
      this.boards = this.boards.map(b => {
        if (b.id === Number(pin.board_id)) {
          const boardPins = this.pins.filter(p => p.board_id === Number(b.id));
          return {
            ...b,
            pins_count: boardPins.length,
            preview_images: boardPins.slice(0, 3).map(p => p.image_url),
          };
        }
        return b;
      });
      save(KEYS.BOARDS, this.boards);
    }

    if (pin.category_id) {
      this.categories = this.categories.map(c => {
        if (c.id === Number(pin.category_id)) {
          return {
            ...c,
            pins_count: (c.pins_count || 0) + 1,
          };
        }
        return c;
      });
      save(KEYS.CATEGORIES, this.categories);
    }

    this.addNotification({
      title: `Created new pin "${pin.title || 'Untitled'}"`,
      type: 'pin',
      link: `/pins/${pin.id}`,
    });

    notify();
    return pin;
  }

  updatePin(id, updates) {
    this.pins = this.pins.map(p => p.id === Number(id) ? { ...p, ...updates } : p);
    save(KEYS.PINS, this.pins);
    notify();
    return this.getPinById(id);
  }

  deletePin(id) {
    const pinToDelete = this.pins.find(p => p.id === Number(id));
    this.pins = this.pins.filter(p => p.id !== Number(id));
    this.comments = this.comments.filter(c => c.pin_id !== Number(id));
    this.reports = this.reports.filter(r => r.pin_id !== Number(id));
    save(KEYS.PINS, this.pins);
    save(KEYS.COMMENTS, this.comments);
    save(KEYS.REPORTS, this.reports);

    if (pinToDelete && pinToDelete.board_id) {
      const boardPins = this.pins.filter(p => p.board_id === Number(pinToDelete.board_id));
      this.boards = this.boards.map(b => {
        if (b.id === Number(pinToDelete.board_id)) {
          return {
            ...b,
            pins_count: boardPins.length,
            preview_images: boardPins.slice(0, 3).map(p => p.image_url),
          };
        }
        return b;
      });
      save(KEYS.BOARDS, this.boards);
    }

    notify();
    return true;
  }

  toggleLike(pinId) {
    let likedState = false;
    let nextCount = 0;
    this.pins = this.pins.map(p => {
      if (p.id === Number(pinId)) {
        likedState = !p.is_liked;
        nextCount = likedState ? (p.likes_count || 0) + 1 : Math.max(0, (p.likes_count || 0) - 1);
        return {
          ...p,
          is_liked: likedState,
          likes_count: nextCount,
        };
      }
      return p;
    });
    save(KEYS.PINS, this.pins);
    notify();
    return { liked: likedState, likes_count: nextCount };
  }

  ratePin(pinId, userId, score) {
    let ratingAvg = score;
    let ratingsCount = 1;
    this.pins = this.pins.map(p => {
      if (p.id === Number(pinId)) {
        const prevCount = p.ratings_count || 0;
        const prevAvg = p.rating_avg || score;
        const hadRated = p.user_rating != null;
        
        let newCount = hadRated ? prevCount : prevCount + 1;
        let newAvg = hadRated
          ? Math.round((((prevAvg * prevCount) - p.user_rating + score) / Math.max(1, newCount)) * 10) / 10
          : Math.round((((prevAvg * prevCount) + score) / Math.max(1, newCount)) * 10) / 10;
        
        ratingAvg = newAvg;
        ratingsCount = newCount;
        return {
          ...p,
          user_rating: score,
          rating_avg: newAvg,
          ratings_count: newCount,
        };
      }
      return p;
    });
    save(KEYS.PINS, this.pins);
    return { user_rating: score, rating_avg: ratingAvg, ratings_count: ratingsCount };
  }

  // Comments
  getComments(pinId) {
    return this.comments
      .filter(c => c.pin_id === Number(pinId))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  addComment(pinId, { user_id, username, user_name, user_avatar, content, rating = null }) {
    const newComment = {
      id: Date.now(),
      pin_id: Number(pinId),
      user_id,
      username,
      user_name: user_name || username,
      user_avatar: user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      content,
      rating,
      created_at: new Date().toISOString(),
    };
    this.comments = [newComment, ...this.comments];
    save(KEYS.COMMENTS, this.comments);

    // Update pin comments count
    this.pins = this.pins.map(p => {
      if (p.id === Number(pinId)) {
        return { ...p, comments_count: (p.comments_count || 0) + 1 };
      }
      return p;
    });
    save(KEYS.PINS, this.pins);
    return newComment;
  }

  updateComment(commentId, content) {
    this.comments = this.comments.map(c => c.id === Number(commentId) ? { ...c, content, updated_at: new Date().toISOString() } : c);
    save(KEYS.COMMENTS, this.comments);
    return this.comments.find(c => c.id === Number(commentId));
  }

  deleteComment(commentId) {
    const comment = this.comments.find(c => c.id === Number(commentId));
    if (comment) {
      const pinId = comment.pin_id;
      this.comments = this.comments.filter(c => c.id !== Number(commentId));
      save(KEYS.COMMENTS, this.comments);

      this.pins = this.pins.map(p => {
        if (p.id === Number(pinId)) {
          return { ...p, comments_count: Math.max(0, (p.comments_count || 1) - 1) };
        }
        return p;
      });
      save(KEYS.PINS, this.pins);
    }
    return true;
  }

  // Reports
  getReports() {
    return [...this.reports].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  addReport({ pin_id, reporter_id, reporter_username, reporter_email, reason, details }) {
    const pin = this.getPinById(pin_id);
    const newReport = {
      id: Date.now(),
      pin_id: Number(pin_id),
      pin_title: pin ? pin.title : 'Saved Pin',
      pin_image: pin ? pin.image_url : '',
      reporter_id,
      reporter_username,
      reporter_email: reporter_email || `${reporter_username}@example.com`,
      reason,
      details: details || '',
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    this.reports = [newReport, ...this.reports];
    save(KEYS.REPORTS, this.reports);
    return newReport;
  }

  updateReportStatus(reportId, status) {
    this.reports = this.reports.map(r => r.id === Number(reportId) ? { ...r, status, updated_at: new Date().toISOString() } : r);
    save(KEYS.REPORTS, this.reports);
    this.addAuditLog('Moderate Report', `Report #${reportId} (${status})`, 'Success');
    notify();
    return this.reports.find(r => r.id === Number(reportId));
  }

  // Users
  getUsers() {
    return [...this.users];
  }

  updateUserProfile(userId, updates) {
    this.users = this.users.map(u => u.id === Number(userId) ? { ...u, ...updates } : u);
    save(KEYS.USERS, this.users);
    notify();
    return this.users.find(u => u.id === Number(userId));
  }

  updateUserRole(userId, role) {
    const user = this.users.find(u => u.id === Number(userId));
    this.users = this.users.map(u => u.id === Number(userId) ? { ...u, role } : u);
    save(KEYS.USERS, this.users);
    this.addAuditLog('Update User Role', `${user ? `@${user.username}` : `User #${userId}`} -> ${role}`, 'Success');
    notify();
    return true;
  }

  updateUserStatus(userId, status) {
    const user = this.users.find(u => u.id === Number(userId));
    this.users = this.users.map(u => u.id === Number(userId) ? { ...u, status } : u);
    save(KEYS.USERS, this.users);
    this.addAuditLog('Update User Status', `${user ? `@${user.username}` : `User #${userId}`} -> ${status}`, 'Success');
    notify();
    return true;
  }

  deleteUser(userId) {
    const user = this.users.find(u => u.id === Number(userId));
    this.users = this.users.filter(u => u.id !== Number(userId));
    save(KEYS.USERS, this.users);
    this.addAuditLog('Delete User', user ? `@${user.username}` : `User #${userId}`, 'Success');
    notify();
    return true;
  }

  addUser(userData) {
    const newUser = {
      id: Date.now(),
      username: (userData.username || 'new_user').toLowerCase().replace(/\s+/g, '_'),
      email: userData.email || 'chhivtyy16@gmail.com',
      full_name: userData.full_name || 'New Member',
      bio: userData.bio || 'Pinboard community curator.',
      role: userData.role || 'user',
      avatar_url: userData.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      pins_count: 0,
      boards_count: 0,
      status: 'active',
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    };
    this.users = [newUser, ...this.users];
    save(KEYS.USERS, this.users);
    notify();
    return newUser;
  }

  // Private Friends Circle (Max 5 Friends)
  getFriends(userId = 2) {
    return [...this.friends].slice(0, 5);
  }

  getFriendById(friendId) {
    const fid = Number(friendId);
    return this.friends.find(f => f.friend_id === fid || f.id === fid) || null;
  }

  addFriend(friendData) {
    if (this.friends.length >= 5) {
      throw new Error('Maximum 5 friends allowed in your private sharing circle.');
    }

    const fid = Number(friendData.friend_id || friendData.id);
    const existing = this.friends.find(f => f.friend_id === fid || f.id === fid);
    if (existing) {
      throw new Error('This user is already in your 5-friend sharing circle.');
    }

    const userProfile = this.users.find(u => u.id === fid);
    const newFriend = {
      id: fid,
      user_id: 2,
      friend_id: fid,
      username: friendData.username || userProfile?.username || `friend_${fid}`,
      full_name: friendData.full_name || userProfile?.full_name || 'Friend',
      avatar_url: friendData.avatar_url || userProfile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      bio: friendData.bio || userProfile?.bio || 'Curator in your private 5-friend circle.',
      shared_categories: friendData.shared_categories || ['Architecture & Spaces'],
      status: 'connected',
      online: true,
      mutual_pins_count: userProfile?.pins_count || 5,
      mutual_boards_count: userProfile?.boards_count || 2,
      added_at: new Date().toISOString(),
    };

    this.friends = [...this.friends, newFriend].slice(0, 5);
    save(KEYS.FRIENDS, this.friends);
    this.addNotification({
      title: `Added @${newFriend.username} to your 5-friend sharing circle`,
      type: 'friend',
      link: `/profile/${fid}`,
      user_name: newFriend.full_name,
    });
    notify();
    return newFriend;
  }

  removeFriend(friendId) {
    const fid = Number(friendId);
    const friend = this.friends.find(f => f.friend_id === fid || f.id === fid);
    this.friends = this.friends.filter(f => f.friend_id !== fid && f.id !== fid);
    save(KEYS.FRIENDS, this.friends);
    if (friend) {
      this.addNotification({
        title: `Removed @${friend.username} from your 5-friend sharing circle`,
        type: 'friend',
        link: '/settings',
      });
    }
    notify();
    return true;
  }

  getSuggestedFriends(currentUserId = 2) {
    const currentFriendIds = new Set(this.friends.map(f => f.friend_id || f.id));
    currentFriendIds.add(Number(currentUserId));
    // Users that are not Sarah and not already in friends
    return this.users.filter(u => !currentFriendIds.has(u.id));
  }

  // Categories
  getCategories() {
    return [...this.categories];
  }

  addCategory(category) {
    const newCat = {
      id: Date.now(),
      slug: (category.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      pins_count: 0,
      type: category.type || 'personal',
      members: Array.isArray(category.members) ? category.members.slice(0, 5) : [],
      created_at: new Date().toISOString(),
      ...category,
    };
    this.categories = [...this.categories, newCat];
    save(KEYS.CATEGORIES, this.categories);
    notify();
    return newCat;
  }

  addMemberToCategory(categoryId, friend) {
    this.categories = this.categories.map(c => {
      if (c.id === Number(categoryId)) {
        const members = c.members || [];
        if (members.length >= 5) {
          throw new Error('Maximum 5 people per group category.');
        }
        if (members.some(m => m.id === friend.id)) {
          return c;
        }
        return {
          ...c,
          type: 'group',
          members: [...members, friend],
        };
      }
      return c;
    });
    save(KEYS.CATEGORIES, this.categories);
    notify();
    return this.categories.find(c => c.id === Number(categoryId));
  }

  removeMemberFromCategory(categoryId, friendId) {
    this.categories = this.categories.map(c => {
      if (c.id === Number(categoryId)) {
        return {
          ...c,
          members: (c.members || []).filter(m => m.id !== Number(friendId)),
        };
      }
      return c;
    });
    save(KEYS.CATEGORIES, this.categories);
    notify();
    return this.categories.find(c => c.id === Number(categoryId));
  }

  updateCategory(id, updates) {
    this.categories = this.categories.map(c => c.id === Number(id) ? { ...c, ...updates } : c);
    save(KEYS.CATEGORIES, this.categories);
    return this.categories.find(c => c.id === Number(id));
  }

  deleteCategory(id) {
    this.categories = this.categories.filter(c => c.id !== Number(id));
    save(KEYS.CATEGORIES, this.categories);
    return true;
  }

  // Boards
  getBoards(userId) {
    if (userId) {
      return this.boards.filter(b => b.user_id === Number(userId) || b.user_id === 2);
    }
    return [...this.boards];
  }

  getBoardById(id) {
    const board = this.boards.find(b => b.id === Number(id)) || this.boards[0];
    if (!board) return null;
    const pins = this.pins.filter(p => p.board_id === Number(id));
    return { ...board, pins };
  }

  addBoard(boardData) {
    const newBoard = {
      id: Date.now(),
      user_id: 2,
      pins_count: 0,
      preview_images: [],
      created_at: new Date().toISOString(),
      ...boardData,
    };
    this.boards = [newBoard, ...this.boards];
    save(KEYS.BOARDS, this.boards);
    notify();
    return newBoard;
  }

  updateBoard(id, updates) {
    this.boards = this.boards.map(b => b.id === Number(id) ? { ...b, ...updates } : b);
    save(KEYS.BOARDS, this.boards);
    notify();
    return this.boards.find(b => b.id === Number(id));
  }

  deleteBoard(id) {
    this.boards = this.boards.filter(b => b.id !== Number(id));
    // Clear board association from pins
    this.pins = this.pins.map(p => p.board_id === Number(id) ? { ...p, board_id: null, board_name: null } : p);
    save(KEYS.BOARDS, this.boards);
    save(KEYS.PINS, this.pins);
    notify();
    return true;
  }

  savePinToBoard(boardId, pinId) {
    const pin = this.pins.find(p => p.id === Number(pinId));
    const board = this.boards.find(b => b.id === Number(boardId));
    if (!pin || !board) return null;

    pin.board_id = Number(boardId);
    pin.board_name = board.name;
    pin.is_liked = true; // Also mark as saved/favorite

    const boardPins = this.pins.filter(p => p.board_id === Number(boardId));
    board.pins_count = boardPins.length;
    board.preview_images = boardPins.slice(0, 3).map(p => p.image_url);
    if (!board.cover_image_url && pin.image_url) {
      board.cover_image_url = pin.image_url;
    }

    save(KEYS.PINS, this.pins);
    save(KEYS.BOARDS, this.boards);
    this.addNotification({
      title: `Saved "${pin.title || 'Pin'}" to board "${board.name}"`,
      type: 'save',
      link: `/pins/${pin.id}`,
    });
    notify();
    return { board, pin };
  }

  removePinFromBoard(boardId, pinId) {
    const pin = this.pins.find(p => p.id === Number(pinId));
    const board = this.boards.find(b => b.id === Number(boardId));
    if (pin && pin.board_id === Number(boardId)) {
      pin.board_id = null;
      pin.board_name = null;
    }
    if (board) {
      const boardPins = this.pins.filter(p => p.board_id === Number(boardId));
      board.pins_count = boardPins.length;
      board.preview_images = boardPins.slice(0, 3).map(p => p.image_url);
    }
    save(KEYS.PINS, this.pins);
    save(KEYS.BOARDS, this.boards);
    notify();
    return true;
  }

  // Settings & Policies
  getSettings() {
    return { ...this.settings };
  }

  updateSettings(updates) {
    const prev = { ...this.settings };
    this.settings = { ...this.settings, ...updates };
    save(KEYS.SETTINGS, this.settings);

    // Dynamic Audit Trail logging based on what was changed
    if (updates.maintenance_mode !== undefined && updates.maintenance_mode !== prev.maintenance_mode) {
      this.addAuditLog(
        updates.maintenance_mode ? 'Enable Maintenance Mode' : 'Disable Maintenance Mode',
        'System Lockdown Policy',
        'Applied'
      );
    } else if (updates.allow_registration !== undefined && updates.allow_registration !== prev.allow_registration) {
      this.addAuditLog(
        updates.allow_registration ? 'Enable Public Registration' : 'Disable Public Registration',
        'Account Access Policy',
        'Applied'
      );
    } else if (updates.enable_comments !== undefined && updates.enable_comments !== prev.enable_comments) {
      this.addAuditLog(
        updates.enable_comments ? 'Enable Pin Comments' : 'Disable Pin Comments',
        'Interaction Policy',
        'Applied'
      );
    } else if (updates.enable_ratings !== undefined && updates.enable_ratings !== prev.enable_ratings) {
      this.addAuditLog(
        updates.enable_ratings ? 'Enable Pin Ratings' : 'Disable Pin Ratings',
        'Interaction Policy',
        'Applied'
      );
    } else if (updates.require_moderation_threshold !== undefined && updates.require_moderation_threshold !== prev.require_moderation_threshold) {
      this.addAuditLog(
        'Update Moderation Threshold',
        `${updates.require_moderation_threshold} reports`,
        'Applied'
      );
    } else {
      this.addAuditLog('Update Platform Policies', 'Global Settings', 'Success');
    }

    notify();
    return { ...this.settings };
  }

  // Live Audit Trail
  getAuditLogs() {
    return [...this.auditLogs];
  }

  addAuditLog(action, target, status = 'Success') {
    let adminName = 'Admin';
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('user');
        if (saved) {
          const parsed = JSON.parse(saved);
          adminName = parsed.full_name || parsed.username || 'Admin';
        }
      } catch (e) {}
    }

    const newLog = {
      id: Date.now() + Math.random(),
      time: 'Just now',
      timestamp: Date.now(),
      admin: adminName,
      action,
      target: String(target || 'System'),
      status,
    };
    this.auditLogs = [newLog, ...this.auditLogs].slice(0, 50);
    save(KEYS.AUDIT_LOGS, this.auditLogs);
    notify();
    return newLog;
  }

  clearAuditLogs() {
    this.auditLogs = [];
    save(KEYS.AUDIT_LOGS, []);
    notify();
    return [];
  }

  // Activity Notifications
  getNotifications() {
    return [...this.notifications];
  }

  getUnreadNotificationsCount() {
    return this.notifications.filter(n => !n.is_read).length;
  }

  markAllNotificationsAsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, is_read: true }));
    save(KEYS.NOTIFICATIONS, this.notifications);
    notify();
    return [...this.notifications];
  }

  markNotificationAsRead(id) {
    this.notifications = this.notifications.map(n =>
      n.id === Number(id) ? { ...n, is_read: true } : n
    );
    save(KEYS.NOTIFICATIONS, this.notifications);
    notify();
    return [...this.notifications];
  }

  removeNotification(id) {
    this.notifications = this.notifications.filter(n => n.id !== Number(id));
    save(KEYS.NOTIFICATIONS, this.notifications);
    notify();
    return [...this.notifications];
  }

  addNotification(notif) {
    const newNotif = {
      id: Date.now(),
      title: notif.title || 'New activity notification',
      time: 'Just now',
      timestamp: Date.now(),
      is_read: false,
      type: notif.type || 'system',
      link: notif.link || '/pins',
      user_name: notif.user_name || null,
      ...notif,
    };
    this.notifications = [newNotif, ...this.notifications].slice(0, 30);
    save(KEYS.NOTIFICATIONS, this.notifications);
    notify();
    return newNotif;
  }

  clearNotifications() {
    this.notifications = [];
    save(KEYS.NOTIFICATIONS, this.notifications);
    notify();
    return [];
  }

  // Recently Viewed Pins
  getRecentlyViewedPins() {
    const ids = load(KEYS.RECENTLY_VIEWED, []);
    return ids
      .map(id => this.pins.find(p => p.id === Number(id)))
      .filter(Boolean);
  }

  addRecentlyViewedPin(pinId) {
    const idNum = Number(pinId);
    if (!idNum) return;
    const current = load(KEYS.RECENTLY_VIEWED, []);
    const updated = [idNum, ...current.filter(id => id !== idNum)].slice(0, 24);
    save(KEYS.RECENTLY_VIEWED, updated);
    notify();
  }

  resetToDefaultData() {
    this.users = [...MOCK_USERS];
    this.pins = [...MOCK_PINS];
    this.categories = [...MOCK_CATEGORIES];
    this.boards = [...MOCK_BOARDS];
    this.comments = [...MOCK_COMMENTS];
    this.reports = [...MOCK_REPORTS];
    this.settings = { ...MOCK_SETTINGS };
    this.auditLogs = [
      { id: Date.now(), time: 'Just now', timestamp: Date.now(), admin: 'Alex Rivera (Admin)', action: 'Factory Reset', target: 'All Mock Datasets', status: 'Restored' },
      ...DEFAULT_AUDIT_LOGS.slice(0, 3)
    ];
    save(KEYS.USERS, this.users);
    save(KEYS.PINS, this.pins);
    save(KEYS.CATEGORIES, this.categories);
    save(KEYS.BOARDS, this.boards);
    save(KEYS.COMMENTS, this.comments);
    save(KEYS.REPORTS, this.reports);
    save(KEYS.SETTINGS, this.settings);
    save(KEYS.AUDIT_LOGS, this.auditLogs);
    notify();
    return true;
  }
}

export const appStore = new AppStore();
