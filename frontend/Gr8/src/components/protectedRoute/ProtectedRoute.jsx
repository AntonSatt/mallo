import React from 'react';
import './ProtectedRoute.css';
import { Navigate } from 'react-router-dom';
import { useAuth } from "../../hooks/useAuth";
import Navbar from "../layout/Navbar"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="protected-route-layout">
      <div className="protected-route-nav">
        <Navbar />
      </div>
      <div className="protected-route-content">
        {children}
      </div>
    </div>
  );
};

export default ProtectedRoute;
