

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AdminEditUserPage.css'; // Assuming you have a CSS file for styling

const AdminEditUserPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        role: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const text = await response.text();
                let data;

                try {
                    data = JSON.parse(text);
                } catch {
                    throw new Error('Invalid JSON response: ' + text.slice(0, 100));
                }

                if (!response.ok) throw new Error(data.message || 'Failed to fetch user');

                setUserData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchUser();
    }, [userId, token]);

    const handleRoleChange = (e) => {
        setUserData({ ...userData, role: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    role: userData.role,
                }),
            });

            const text = await response.text();
            let data;

            try {
                data = JSON.parse(text);
            } catch {
                throw new Error('Invalid JSON response: ' + text.slice(0, 100));
            }

            if (!response.ok) throw new Error(data.message || 'Update failed');

            setSuccess('User role updated successfully! Redirecting...');
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading user data...</p>
            </div>
        );
    }

    return (
        <div className="admin-edit-container">
            <div className="admin-edit-header">
                <h2>Edit User Role</h2>
                <p className="user-identifier">{userData.name} • {userData.email}</p>
            </div>

            <form onSubmit={handleSubmit} className="admin-edit-form">
                <div className="user-info-display">
                    <div className="info-field">
                        <label>Name</label>
                        <div className="readonly-value">{userData.name}</div>
                    </div>

                    <div className="info-field">
                        <label>Email</label>
                        <div className="readonly-value">{userData.email}</div>
                    </div>

                    <div className="info-field">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            name="role"
                            value={userData.role}
                            onChange={handleRoleChange}
                            className="role-select"
                        >
                            <option value="customer">Customer</option>
                            <option value="creator">Creator</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => navigate('/dashboard')}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="submit-button"
                    >
                        Update Role
                    </button>
                </div>
            </form>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
        </div>
    );
};

export default AdminEditUserPage;
