// frontend/src/pages/UpdatePasswordPage.js

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const UpdatePasswordPage = () => {
    // State for form fields
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // State for feedback messages
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Get the user's token and logout function from our AuthContext
    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/users/update-password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // We must include the Authorization header to prove who we are
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update password');
            }

            setSuccess('Password updated successfully! You will now be logged out.');

            // For security, after a password change, we log the user out
            // and force them to log back in with their new password.
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 3000);

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <h2>Change Your Password</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="currentPassword">Current Password:</label><br />
                    <input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        style={{ width: '95%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="newPassword">New Password:</label><br />
                    <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength="8"
                        style={{ width: '95%', padding: '8px' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px' }}>Update Password</button>
            </form>
            {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
            {success && <p style={{ color: 'green', textAlign: 'center', marginTop: '1rem' }}>{success}</p>}
        </div>
    );
};

export default UpdatePasswordPage;