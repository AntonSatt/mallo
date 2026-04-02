import React, { createContext, useState } from 'react';
import UserServices from '../services/UserServices';

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

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};