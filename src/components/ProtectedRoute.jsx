import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = Cookies.get('logged');  // Check if the cookie exists

  if (!isAuthenticated) {
    return <Navigate to="/" />;  // If not authenticated, redirect to login
  }

  return children;  // If authenticated, allow access to the protected route
};

export default ProtectedRoute;
