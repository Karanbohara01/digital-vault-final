

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import SettingsPage from './SettingsPage';
import './DashboardPage.css';
import { FaTrash } from 'react-icons/fa'; // Font Awesome trash icon
// or
import { FiTrash2 } from 'react-icons/fi'; // Feather trash icon
// or
import { RiDeleteBinLine } from 'react-icons/ri'; // Remix icon

const DashboardPage = () => {
    const { user, token } = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();

    // This single useEffect hook now fetches the correct data whenever the active tab changes.
    useEffect(() => {
        const fetchDataForTab = async () => {
            // Only fetch data if a data-driven tab is selected.
            if (!user || !['products', 'orders', 'users', 'logs'].includes(activeTab)) {
                setData([]);
                setLoading(false);
                return;
            };

            setLoading(true);
            setError(null);
            let url = '';

            // Determine the correct API endpoint based on the active tab and user role
            if (activeTab === 'orders' && user.role === 'customer') {
                url = '/api/orders/my-orders';
            } else if (activeTab === 'products' && user.role === 'creator') {
                url = '/api/products/my-products';
            } else if (activeTab === 'users' && user.role === 'admin') {
                url = '/api/users'; // Use the new admin route
            } else if (activeTab === 'logs' && user.role === 'admin') {
                url = '/api/logs'; // Use the new admin route
            } else {
                setLoading(false);
                return; // Exit if the role doesn't match the tab
            }

            try {
                const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
                const result = await response.json();
                if (response.ok) {
                    setData(result);
                } else {
                    throw new Error(result.message || 'Failed to fetch data');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDataForTab();
    }, [user, token, activeTab]); // Re-run when the active tab changes

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to permanently delete this product?')) return;
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Requested-With': 'XMLHttpRequest' // CSRF protection
                },
            });
            if (!response.ok) throw new Error((await response.json()).message);
            setData(prevData => prevData.filter(p => p._id !== productId));
        } catch (err) { setError(err.message); }
    };

    const handleDeleteLog = async (logId) => {
        if (!window.confirm('Are you sure you want to delete this log?')) return;

        try {
            const res = await fetch(`/api/logs/${logId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error('Failed to delete log');
            // Optionally re-fetch or filter it out
            setData(prev => prev.filter(log => log._id !== logId));
        } catch (err) {
            alert('Error deleting log: ' + err.message);
        }
    };


    // --- NEW: Function to handle deleting a user (by admin) ---
    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to permanently delete the user: ${userName}? This action cannot be undone.`)) return;
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Requested-With': 'XMLHttpRequest' // CSRF protection
                },
            });
            if (!response.ok) throw new Error((await response.json()).message);
            setData(prevData => prevData.filter(u => u._id !== userId));
        } catch (err) { setError(err.message); }
    };

    const handleDownload = async (productId, productName) => {
        if (!productId || !productName) return alert('Product data is missing.');
        try {
            const response = await fetch(`/api/products/${productId}/download`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Requested-With': 'XMLHttpRequest' // CSRF protection
                },
            });
            if (!response.ok) throw new Error((await response.json()).message);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const fileExtension = blob.type.split('/')[1] || 'download';
            link.setAttribute('download', `${productName}.${fileExtension}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) { alert(`Error: ${err.message}`); }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Dashboard</h1>
                    <p className="dashboard-subtitle">Welcome back, {user?.name || 'User'}!</p>
                </div>
            </div>

            <div className="dashboard-tabs">
                <button className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Overview</button>
                {user?.role === 'customer' && <button className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>My Orders</button>}
                {user?.role === 'creator' && <button className={`tab-button ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>My Products</button>}

                {/* Admin-only Tabs */}
                {user?.role === 'admin' && (
                    <>
                        <button className={`tab-button ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Manage Users</button>
                        <button className={`tab-button ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>Activity Logs</button>
                    </>
                )}

                <button className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Settings</button>
            </div>

            <div className="dashboard-content">
                {activeTab === 'dashboard' && <div className="overview-card"><h3>Dashboard Overview</h3><p>Use the tabs to manage your account and site activity.</p></div>}
                {activeTab === 'settings' && <SettingsPage />}

                {/* CREATOR'S "MY PRODUCTS" TAB */}
                {activeTab === 'products' && user?.role === 'creator' && (
                    <div className="content-section">
                        <div className="section-header"><h2>My Products</h2><Link to="/create-product" className="primary-button">Create New Product</Link></div>
                        {error && <p className="error-message">{error}</p>}
                        {loading ? <div className="loading-state"><div className="spinner"></div></div> : data.length > 0 ? (
                            <table className="data-table">
                                <thead><tr><th>Product</th><th>Price</th><th>Category</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {data.map(product => (
                                        <tr key={product._id}>
                                            <td><div className="product-info"><img className="product-thumbnail" src={`/${product.filePath}`} alt={product.name} /><span>{product.name}</span></div></td>
                                            <td>${product.price.toFixed(2)}</td>
                                            <td><span className="category-badge">{product.category}</span></td>
                                            <td>
                                                <button onClick={() => navigate(`/edit-product/${product._id}`)} className="action-button edit">Edit</button>
                                                <button onClick={() => handleDeleteProduct(product._id)} className="action-button delete">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <div className="empty-state"><p>You have not created any products yet.</p><Link to="/create-product" className="primary-button">Create Your First Product</Link></div>}
                    </div>
                )}

                {/* CUSTOMER'S "MY ORDERS" TAB */}
                {activeTab === 'orders' && user?.role === 'customer' && (
                    <div className="content-section">
                        <h2>My Orders</h2>
                        {error && <p className="error-message">{error}</p>}
                        {loading ? <div className="loading-state"><div className="spinner"></div></div> : data.length > 0 ? (
                            <table className="data-table">
                                <thead><tr><th>Product Information</th><th>Price</th><th>Date</th><th>Action</th></tr></thead>
                                <tbody>
                                    {data.map(order => (
                                        <tr key={order._id}>
                                            <td><div className="product-info"><span>{order.product?.name || 'N/A'}</span></div></td>
                                            <td>${order.price.toFixed(2)}</td>
                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td><button className="primary-button" onClick={() => handleDownload(order.product?._id, order.product?.name)}>Download</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <div className="empty-state"><p>You have no orders yet.</p><Link to="/" className="primary-button">Browse Products</Link></div>}
                    </div>
                )}

                {/* ADMIN'S "USER MANAGEMENT" TAB */}
                {activeTab === 'users' && user?.role === 'admin' && (
                    <div className="content-section">
                        <h2>User Management</h2>
                        {error && <p className="error-message">{error}</p>}
                        {loading ? <div className="loading-state"><div className="spinner"></div></div> : (
                            <table className="data-table">
                                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Verified</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {data.map(u => (
                                        <tr key={u._id}>
                                            <td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{u.isVerified ? 'Yes' : 'No'}</td>
                                            <td><button onClick={() => navigate(`/admin/edit-user/${u._id}`)} className="action-button edit">Edit</button><button onClick={() => handleDeleteUser(u._id, u.name)} className="action-button delete">Delete</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}



                {/* ADMIN'S "ACTIVITY LOGS" TAB - SECURE IMPLEMENTATION */}
                {activeTab === 'logs' && user?.role === 'admin' && (
                    <div className="content-section">
                        <h2>System Activity Logs</h2>
                        {error && <div className="error-message">{error}</div>}
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Loading security logs...</p>
                            </div>
                        ) : (
                            <div className="secure-logs-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Timestamp</th>
                                            <th>Severity</th>
                                            <th>Activity</th>
                                            <th>Details</th>
                                            <th>Method</th>
                                            <th>Action</th>


                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map(log => {
                                            // Sanitization function
                                            const anonymizeEmail = (email) => {
                                                if (!email) return null;
                                                const [name, domain] = email.split('@');
                                                return `${name?.substring(0, 2)}***@${domain}`;
                                            };

                                            // Redact sensitive data
                                            const sanitizedDetails = log.details ? {
                                                ...log.details,
                                                ...(log.details.password && { password: '***REDACTED***' }),
                                                ...(log.details.token && { token: '***REDACTED***' }),
                                                ...(log.details.email && { email: anonymizeEmail(log.details.email) }),
                                                ...(log.details.user && { user: '***REDACTED***' })
                                            } : null;

                                            // Severity style mapping
                                            const getLogSeverityStyle = (level) => {
                                                const styles = {
                                                    fatal: { backgroundColor: '#dc3545', color: 'white' },
                                                    error: { backgroundColor: '#ff6b6b', color: 'white' },
                                                    warn: { backgroundColor: '#ffd166', color: '#333' },
                                                    info: { backgroundColor: '#06d6a0', color: 'white' },
                                                    debug: { backgroundColor: '#adb5bd', color: 'white' }
                                                };
                                                return styles[level] || { backgroundColor: '#f8f9fa', color: '#333' };
                                            };

                                            return (
                                                <tr key={log._id || crypto.randomUUID()}>
                                                    <td>{log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'}</td>
                                                    <td>
                                                        <span
                                                            className="status-badge"
                                                            style={getLogSeverityStyle(log.level)}
                                                        >
                                                            {log.level ? log.level.toUpperCase() : 'UNKNOWN'}
                                                        </span>
                                                    </td>
                                                    <td>{log.action || 'N/A'}</td>
                                                    <td>
                                                        <pre className="log-details">
                                                            {sanitizedDetails
                                                                ? JSON.stringify(sanitizedDetails, null, 2)
                                                                : 'No details available'
                                                            }
                                                        </pre>
                                                    </td>
                                                    <td>{log.details?.method || '–'}</td>
                                                    {user?.role === 'admin' && (
                                                        <td>
                                                            <button
                                                                className="btn btn-danger"
                                                                onClick={() => handleDeleteLog(log._id)}
                                                            >
                                                                <FiTrash2 className="btn-icon" /> Delete
                                                            </button>
                                                        </td>
                                                    )}


                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                <div className="logs-security-note">
                                    <span role="img" aria-label="secure">🔒</span>
                                    <span>All sensitive data has been redacted for security</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;