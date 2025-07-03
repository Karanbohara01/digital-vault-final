// frontend/src/components/ProtectedRoute.js

import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// This component will wrap any routes that require authentication
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const location = useLocation();

    if (!isAuthenticated) {
        // If the user is not authenticated, redirect them to the /login page
        // We also pass the original location they were trying to go to,
        // so we can redirect them back there after they log in.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If the user is authenticated, render the child components
    // (the actual page they were trying to access)
    return children;
};

export default ProtectedRoute;