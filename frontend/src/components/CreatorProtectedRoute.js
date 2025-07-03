// frontend/src/components/CreatorProtectedRoute.js

import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CreatorProtectedRoute = ({ children }) => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const location = useLocation();

    if (!isAuthenticated) {
        // If not logged in, redirect to login page
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user.role !== 'creator') {
        // If logged in but not a creator, redirect to home page
        // You could also redirect to an "Unauthorized" page
        alert('Access Denied: This page is for creators only.');
        return <Navigate to="/" replace />;
    }

    // If logged in AND a creator, render the page
    return children;
};

export default CreatorProtectedRoute;