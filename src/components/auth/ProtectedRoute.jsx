import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>Checking authentication...</Typography>
      </Box>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page, but save the location they were
    // trying to access so we can send them there after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a role is required, check user role
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    return <Navigate to={user.role === 'police' ? '/police' : '/citizen'} replace />;
  }

  // If everything is fine, render the protected component
  return children;
};

export default ProtectedRoute;