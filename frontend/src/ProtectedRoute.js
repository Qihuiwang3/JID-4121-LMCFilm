import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;
