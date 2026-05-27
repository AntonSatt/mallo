import React, { createContext, useState, useEffect } from 'react';
import { requestNotificationPermission } from "../Firebase.js";
import { registerAuthListener } from '../services/AuthServices';
import UserServices from '../services/UserServices';
import ChatSignalrServices from '../services/ChatSignalrServices';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const getUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(getUser());

  const refreshCurrentUser = () => {
    setCurrentUser(getUser());
    setIsAuthenticated(!!localStorage.getItem('token'));
  };

  const login = async (credentials) => {
    await UserServices.login(credentials);
    refreshCurrentUser();

    await requestNotificationPermission();
  };

  const register = async (userData) => {
    await UserServices.register(userData);
    refreshCurrentUser();

    await requestNotificationPermission();
  };

  const logout = async () => {
    await ChatSignalrServices.stopConnection();
    UserServices.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const deleteAccount = async () => {
    await UserServices.delete();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  useEffect(() => {
    registerAuthListener(logout);
    return () => registerAuthListener(null);
  });

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, login, register, logout, deleteAccount, refreshCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};