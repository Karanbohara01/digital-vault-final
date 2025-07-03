// frontend/src/components/dashboard/ActivityLogs.js

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const ActivityLogs = () => {
    const { token } = useContext(AuthContext);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            setError(null);
            try {
                const response = await fetch('http://localhost:5001/api/logs', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const data = await response.json();
                if (response.ok) {
                    setLogs(data);
                } else {
                    throw new Error(data.message || 'Failed to fetch logs');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchLogs();
    }, [token]);

    const getLogLevelStyle = (level) => {
        switch (level) {
            case 'fatal': return { backgroundColor: '#dc3545', color: 'white' };
            case 'error': return { backgroundColor: '#ffc107', color: 'black' };
            case 'warn': return { backgroundColor: '#fd7e14', color: 'white' };
            default: return { backgroundColor: '#e9ecef', color: '#495057' };
        }
    };

    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
    const thStyle = { borderBottom: '2px solid #ccc', padding: '12px', textAlign: 'left', backgroundColor: '#f8f9fa' };
    const tdStyle = { borderBottom: '1px solid #ddd', padding: '12px', textAlign: 'left' };

    if (loading) return <p>Loading activity logs...</p>;

    return (
        <div>
            <h3>System Activity Logs</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {logs.length > 0 ? (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Date</th>
                            <th style={thStyle}>Level</th>
                            <th style={thStyle}>Action</th>
                            <th style={thStyle}>User</th>
                            <th style={thStyle}>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map(log => (
                            <tr key={log._id}>
                                <td style={tdStyle}>{new Date(log.createdAt).toLocaleString()}</td>
                                <td style={tdStyle}><span style={{ ...getLogLevelStyle(log.level), padding: '4px 8px', borderRadius: '4px' }}>{log.level.toUpperCase()}</span></td>
                                <td style={tdStyle}>{log.action}</td>
                                <td style={tdStyle}>{log.user ? log.user.email : 'System/Unknown'}</td>
                                <td style={tdStyle}><pre>{JSON.stringify(log.details, null, 2)}</pre></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p>No activity logs found.</p>}
        </div>
    );
};

export default ActivityLogs;