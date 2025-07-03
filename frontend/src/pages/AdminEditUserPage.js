// import React, { useState, useEffect, useContext } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';

// const AdminEditUserPage = () => {
//     const { userId } = useParams(); // Gets user ID from the URL
//     const navigate = useNavigate();
//     const { token } = useContext(AuthContext);

//     const [userData, setUserData] = useState({ name: '', email: '', role: '' });
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(null);

//     // ✅ 1. Fetch user details
//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const response = await fetch(`/api/users/${userId}`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });

//                 const text = await response.text();
//                 let data;

//                 try {
//                     data = JSON.parse(text);
//                 } catch {
//                     throw new Error('Invalid JSON response: ' + text.slice(0, 100));
//                 }

//                 if (!response.ok) throw new Error(data.message || 'Failed to fetch user');

//                 setUserData(data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (token) fetchUser();
//     }, [userId, token]);

//     const handleChange = (e) => {
//         setUserData({ ...userData, [e.target.name]: e.target.value });
//     };

//     // ✅ 2. Submit updated data
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);
//         setSuccess(null);

//         try {
//             const response = await fetch(`/api/users/${userId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({
//                     name: userData.name,
//                     email: userData.email,
//                     role: userData.role,
//                 }),
//             });

//             const text = await response.text();
//             let data;

//             try {
//                 data = JSON.parse(text);
//             } catch {
//                 throw new Error('Invalid JSON response: ' + text.slice(0, 100));
//             }

//             if (!response.ok) throw new Error(data.message || 'Update failed');

//             setSuccess('User updated successfully! Redirecting...');
//             setTimeout(() => navigate('/dashboard'), 2000);
//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     if (loading) return <p>Loading user data...</p>;

//     return (
//         <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
//             <h2>Edit User: {userData.name}</h2>
//             <form onSubmit={handleSubmit}>
//                 <div style={{ marginBottom: '1rem' }}>
//                     <label>Name:</label>
//                     <br />
//                     <input
//                         name="name"
//                         type="text"
//                         value={userData.name}
//                         onChange={handleChange}
//                         required
//                         style={{ width: '98%' }}
//                     />
//                 </div>

//                 <div style={{ marginBottom: '1rem' }}>
//                     <label>Email:</label>
//                     <br />
//                     <input
//                         name="email"
//                         type="email"
//                         value={userData.email}
//                         onChange={handleChange}
//                         required
//                         style={{ width: '98%' }}
//                     />
//                 </div>

//                 <div style={{ marginBottom: '1rem' }}>
//                     <label>Role:</label>
//                     <br />
//                     <select
//                         name="role"
//                         value={userData.role}
//                         onChange={handleChange}
//                         required
//                         style={{ width: '100%', padding: '8px' }}
//                     >
//                         <option value="customer">Customer</option>
//                         <option value="creator">Creator</option>
//                         <option value="admin">Admin</option>
//                     </select>
//                 </div>

//                 <button type="submit">Save Changes</button>
//             </form>

//             {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
//             {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}
//         </div>
//     );
// };

// export default AdminEditUserPage;

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
