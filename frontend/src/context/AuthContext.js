// frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // This effect runs when the app starts to check if user info is in localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Login function
    const login = (userData) => {
        // Store user info in localStorage
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUser(userData);
    };

    // Logout function
    const logout = () => {
        // Remove user info from localStorage
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    // The value provided to consuming components
    const value = {
        user,
        login,
        logout,
        token: user ? user.token : null, // A convenient way to access the token
        isAuthenticated: !!user, // A boolean to easily check if user is logged in
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};