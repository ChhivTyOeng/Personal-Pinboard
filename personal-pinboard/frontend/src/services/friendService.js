import api from './api';
import { appStore } from './store';

/**
 * Service for managing the Private 5-Friend Sharing Circle.
 * Structured to seamlessly call backend REST endpoints (/api/friends)
 * while falling back smoothly to appStore in local frontend-only mode.
 */
export const friendService = {
  /**
   * Get all friends in the user's private circle (Max 5).
   */
  async getFriends(userId) {
    try {
      const response = await api.get('/friends', { params: { userId } });
      if (response?.data?.data) {
        return response.data.data;
      }
    } catch (error) {
      // Graceful fallback to appStore (frontend-only mode)
    }
    return appStore.getFriends(userId);
  },

  /**
   * Get specific friend by ID.
   */
  async getFriendById(friendId) {
    try {
      const response = await api.get(`/friends/${friendId}`);
      if (response?.data?.data) {
        return response.data.data;
      }
    } catch (error) {
      // Graceful fallback to appStore
    }
    return appStore.getFriendById(friendId);
  },

  /**
   * Add a new friend to the 5-friend sharing circle.
   */
  async addFriend(friendData) {
    try {
      const response = await api.post('/friends', friendData);
      if (response?.data?.data) {
        appStore.addFriend(response.data.data);
        return response.data.data;
      }
    } catch (error) {
      // Graceful fallback to appStore
    }
    return appStore.addFriend(friendData);
  },

  /**
   * Remove a friend from the 5-friend circle to free up a slot.
   */
  async removeFriend(friendId) {
    try {
      await api.delete(`/friends/${friendId}`);
    } catch (error) {
      // Graceful fallback to appStore
    }
    return appStore.removeFriend(friendId);
  },

  /**
   * Get suggested users available to add to the 5-friend circle.
   */
  async getSuggestedFriends(currentUserId) {
    try {
      const response = await api.get('/friends/suggested', { params: { currentUserId } });
      if (response?.data?.data) {
        return response.data.data;
      }
    } catch (error) {
      // Graceful fallback to appStore
    }
    return appStore.getSuggestedFriends(currentUserId);
  },
};

export default friendService;
