import React, { createContext, useState } from 'react';
import UserServices from '../services/UserServices';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const login = async (credentials) => {
    await UserServices.login(credentials);
    setIsAuthenticated(true);
  };

  const register = async (userData) => {
    await UserServices.register(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    UserServices.logout();
    setIsAuthenticated(false);
  };

  const deleteAccount = async () => {
    await UserServices.delete();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};