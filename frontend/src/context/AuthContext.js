import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { authAPI, hairProfileAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(storage.getUser());
  const [hairProfile, setHairProfile] = useState(storage.getHairProfile());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = storage.getToken();
    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const [userRes, profileRes] = await Promise.allSettled([
        authAPI.getMe(),
        hairProfileAPI.get(),
      ]);

      if (userRes.status === 'fulfilled') {
        setUser(userRes.value.data);
        storage.setUser(userRes.value.data);
      }

      if (profileRes.status === 'fulfilled') {
        setHairProfile(profileRes.value.data);
        storage.setHairProfile(profileRes.value.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { access_token, user_id, email: userEmail } = response.data;
    
    storage.setToken(access_token);
    const userData = { user_id, email: userEmail };
    setUser(userData);
    storage.setUser(userData);
    
    // Fetch full user data and profile
    await fetchUserData();
    
    return response.data;
  };

  const register = async (email, password, full_name) => {
    const response = await authAPI.register({ email, password, full_name });
    const { access_token, user_id, email: userEmail } = response.data;
    
    storage.setToken(access_token);
    const userData = { user_id, email: userEmail, full_name };
    setUser(userData);
    storage.setUser(userData);
    
    return response.data;
  };

  const logout = () => {
    storage.clearAll();
    setUser(null);
    setHairProfile(null);
  };

  const updateHairProfile = (profile) => {
    setHairProfile(profile);
    storage.setHairProfile(profile);
  };

  const value = {
    user,
    hairProfile,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateHairProfile,
    fetchUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};