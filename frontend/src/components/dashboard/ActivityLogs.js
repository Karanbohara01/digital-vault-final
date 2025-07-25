// // frontend/src/components/dashboard/ActivityLogs.js

// import React, { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '../../context/AuthContext';

// const ActivityLogs = () => {
//     const { token } = useContext(AuthContext);
//     const [logs, setLogs] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchLogs = async () => {
//             setError(null);
//             try {
//                 const response = await fetch('http://localhost:5001/api/logs', {
//                     headers: { 'Authorization': `Bearer ${token}` },
//                 });
//                 const data = await response.json();
//                 if (response.ok) {
//                     setLogs(data);
//                 } else {
//                     throw new Error(data.message || 'Failed to fetch logs');
//                 }
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         if (token) fetchLogs();
//     }, [token]);

//     const getLogLevelStyle = (level) => {
//         switch (level) {
//             case 'fatal': return { backgroundColor: '#dc3545', color: 'white' };
//             case 'error': return { backgroundColor: '#ffc107', color: 'black' };
//             case 'warn': return { backgroundColor: '#fd7e14', color: 'white' };
//             default: return { backgroundColor: '#e9ecef', color: '#495057' };
//         }
//     };

//     const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
//     const thStyle = { borderBottom: '2px solid #ccc', padding: '12px', textAlign: 'left', backgroundColor: '#f8f9fa' };
//     const tdStyle = { borderBottom: '1px solid #ddd', padding: '12px', textAlign: 'left' };

//     if (loading) return <p>Loading activity logs...</p>;

//     return (
//         <div>
//             <h3>System Activity Logs</h3>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//             {logs.length > 0 ? (
//                 <table style={tableStyle}>
//                     <thead>
//                         <tr>
//                             <th style={thStyle}>Date</th>
//                             <th style={thStyle}>Level</th>
//                             <th style={thStyle}>Action</th>
//                             <th style={thStyle}>User</th>
//                             <th style={thStyle}>Details</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {logs.map(log => (
//                             <tr key={log._id}>
//                                 <td style={tdStyle}>{new Date(log.createdAt).toLocaleString()}</td>
//                                 <td style={tdStyle}><span style={{ ...getLogLevelStyle(log.level), padding: '4px 8px', borderRadius: '4px' }}>{log.level.toUpperCase()}</span></td>
//                                 <td style={tdStyle}>{log.action}</td>
//                                 <td style={tdStyle}>{log.user ? log.user.email : 'System/Unknown'}</td>
//                                 <td style={tdStyle}><pre>{JSON.stringify(log.details, null, 2)}</pre></td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             ) : <p>No activity logs found.</p>}
//         </div>
//     );
// };

// export default ActivityLogs;

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const ActivityLogs = () => {
    const { token, user } = useContext(AuthContext);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 10;

    // Data sanitization functions
    const anonymizeEmail = (email) => {
        if (!email) return 'System';
        const [name, domain] = email.split('@');
        return `${name.substring(0, 2)}***@${domain}`;
    };

    const redactSensitiveData = (details) => {
        try {
            const safeDetails = { ...details };
            ['password', 'token', 'apiKey'].forEach(field => {
                if (safeDetails[field]) {
                    safeDetails[field] = '***REDACTED***';
                }
            });
            return safeDetails;
        } catch {
            return { error: 'Could not parse details' };
        }
    };

    useEffect(() => {
        const fetchLogs = async () => {
            if (!token || !user) return;

            setError(null);
            setLoading(true);

            try {
                const response = await fetch(`http://localhost:5001/api/logs`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Requested-With': 'XMLHttpRequest' // CSRF protection
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setLogs(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message);
                console.error('Log fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [token, user, currentPage]);

    const getLogLevelStyle = (level) => {
        const levelMap = {
            fatal: { backgroundColor: '#dc3545', color: 'white', fontWeight: 'bold' },
            error: { backgroundColor: '#ffc107', color: 'black' },
            warn: { backgroundColor: '#fd7e14', color: 'white' },
            info: { backgroundColor: '#17a2b8', color: 'white' },
            debug: { backgroundColor: '#6c757d', color: 'white' }
        };
        return levelMap[level?.toLowerCase()] || { backgroundColor: '#e9ecef', color: '#495057' };
    };

    const handlePrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
    const handleNextPage = () => setCurrentPage(prev => prev + 1);

    if (loading) return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading activity logs...</p>
        </div>
    );

    return (
        <div className="activity-logs-container">
            <h3 className="logs-header">System Activity Logs</h3>

            {error && (
                <div className="error-alert">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {logs.length > 0 ? (
                <>
                    <div className="table-responsive">
                        <table className="logs-table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Severity</th>
                                    <th>Action</th>
                                    <th>User</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map(log => (
                                    <tr key={log._id || Math.random().toString(36).substr(2, 9)}>
                                        <td>{log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'}</td>
                                        <td>
                                            <span
                                                className="log-badge"
                                                style={getLogLevelStyle(log.level)}
                                            >
                                                {log.level ? log.level.toUpperCase() : 'UNKNOWN'}
                                            </span>
                                        </td>
                                        <td>{log.action || 'N/A'}</td>
                                        <td>{log.user ? anonymizeEmail(log.user.email) : 'System'}</td>
                                        <td>
                                            <pre className="log-details">
                                                {log.details ? JSON.stringify(redactSensitiveData(log.details), null, 2) : 'No details'}
                                            </pre>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination-controls">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="page-button"
                        >
                            Previous
                        </button>
                        <span className="page-indicator">Page {currentPage}</span>
                        <button
                            onClick={handleNextPage}
                            disabled={logs.length < logsPerPage}
                            className="page-button"
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <div className="empty-state">
                    <p>No activity logs found.</p>
                </div>
            )}
        </div>
    );
};

export default ActivityLogs;