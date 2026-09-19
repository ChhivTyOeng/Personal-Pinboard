import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { MOCK_USERS } from '../data/mockData';

export const AuthContext = createContext(null);

const GUEST_USER = {
  id: 2,
  username: 'explorer',
  full_name: 'Pinboard Explorer',
  email: 'chhivtyy16@gmail.com',
  role: 'user',
  avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
};

const GOOGLE_USER = {
  id: 3,
  username: 'chhiv_google',
  full_name: 'Chhiv Ty',
  email: 'chhivtyy16@gmail.com',
  role: 'user',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('token');
    return savedToken || null;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    const handleLogout = () => {
      logout();
    };
    window.addEventListener('auth-logout', handleLogout);
    return () => window.removeEventListener('auth-logout', handleLogout);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.login({ email, password });
      localStorage.removeItem('pinboard_logged_out');
      setUser(data.user);
      setToken(data.token);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (formData) => {
    setIsLoading(true);
    try {
      const data = await authService.register(formData);
      localStorage.removeItem('pinboard_logged_out');
      setUser(data.user);
      setToken(data.token);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.setItem('pinboard_logged_out', 'true');
  };

  const continueAsGuest = () => {
    localStorage.removeItem('pinboard_logged_out');
    setUser(GUEST_USER);
    setToken('mock-token-explorer');
    localStorage.setItem('user', JSON.stringify(GUEST_USER));
    localStorage.setItem('token', 'mock-token-explorer');
    return GUEST_USER;
  };

  const loginWithGoogle = async (googleProfileOrEmail, maybeFullName = '') => {
    localStorage.removeItem('pinboard_logged_out');
    let profileData = {};
    if (typeof googleProfileOrEmail === 'object' && googleProfileOrEmail !== null) {
      profileData = googleProfileOrEmail;
    } else {
      profileData = {
        email: googleProfileOrEmail || 'google_user@gmail.com',
        name: maybeFullName || (googleProfileOrEmail ? googleProfileOrEmail.split('@')[0] : 'Google User'),
      };
    }

    const { user: authedUser, token: authToken } = await authService.loginWithGoogle(profileData);
    setUser(authedUser);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(authedUser));
    localStorage.setItem('token', authToken);
    return authedUser;
  };

  const loginWithOtp = async (email, fullName = '') => {
    localStorage.removeItem('pinboard_logged_out');
    const { user: authedUser, token: authToken } = await authService.loginWithOtp(email, fullName);
    setUser(authedUser);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(authedUser));
    localStorage.setItem('token', authToken);
    return authedUser;
  };

  const loginAs = (role) => {
    localStorage.removeItem('pinboard_logged_out');
    const targetUser = role === 'admin' ? MOCK_USERS[0] : MOCK_USERS[1];
    setUser(targetUser);
    setToken('mock-jwt-token-' + targetUser.id);
    return targetUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isGuest: user?.username === 'explorer',
        isAdmin: Boolean(user && (user.role?.toLowerCase() === 'admin' || user.is_admin === true || user.username === 'admin')),
        isLoading,
        login,
        loginAs,
        loginWithGoogle,
        loginWithOtp,
        continueAsGuest,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
