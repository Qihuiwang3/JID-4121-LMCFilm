import React from 'react';
import { useSelector } from 'react-redux'; 
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;
