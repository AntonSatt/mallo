import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";
import Navbar from "./layout/Navbar"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar/>
      <div className="protected-route-content">
        {children}
      </div>
    </>
  );
};

export default ProtectedRoute;