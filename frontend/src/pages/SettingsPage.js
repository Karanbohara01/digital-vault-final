

// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';

// const labelStyle = { display: 'block', marginBottom: '0.3rem', fontWeight: '500' };
// const inputStyle = {
//     width: '100%',
//     padding: '10px',
//     borderRadius: '6px',
//     border: '1px solid #ccc',
//     marginBottom: '1rem',
//     fontSize: '0.95rem',
// };
// const buttonStyle = {
//     padding: '10px 20px',
//     backgroundColor: '#007bff',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '6px',
//     cursor: 'pointer',
//     fontWeight: '600',
// };
// const successStyle = { color: 'green', backgroundColor: '#e7f9ec', padding: '10px', borderRadius: '6px' };
// const errorStyle = { color: 'red', backgroundColor: '#ffe0e0', padding: '10px', borderRadius: '6px' };

// // --- Password Form ---
// const UpdatePasswordForm = () => {
//     const [currentPassword, setCurrentPassword] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [showPasswords, setShowPasswords] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(null);
//     const { token, logout } = useContext(AuthContext);
//     const navigate = useNavigate();

//     const handlePasswordSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);
//         setSuccess(null);
//         try {
//             const response = await fetch('http://localhost:5001/api/users/update-password', {
//                 method: 'PATCH',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({ currentPassword, newPassword }),
//             });
//             const data = await response.json();
//             if (!response.ok) throw new Error(data.message || 'Failed to update password');
//             setSuccess('✅ Password updated successfully! Logging you out...');
//             setTimeout(() => {
//                 logout();
//                 navigate('/login');
//             }, 3000);
//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     return (
//         <div style={{ marginTop: '2rem' }}>
//             <h4>🔐 Change Your Password</h4>
//             <form onSubmit={handlePasswordSubmit}>
//                 <label style={labelStyle}>Current Password</label>
//                 <input
//                     type={showPasswords ? 'text' : 'password'}
//                     value={currentPassword}
//                     onChange={(e) => setCurrentPassword(e.target.value)}
//                     required
//                     style={inputStyle}
//                 />

//                 <label style={labelStyle}>New Password</label>
//                 <input
//                     type={showPasswords ? 'text' : 'password'}
//                     value={newPassword}
//                     onChange={(e) => setNewPassword(e.target.value)}
//                     required
//                     minLength="8"
//                     style={inputStyle}
//                 />

//                 <div style={{ marginBottom: '1rem' }}>
//                     <label>
//                         <input
//                             type="checkbox"
//                             checked={showPasswords}
//                             onChange={() => setShowPasswords(!showPasswords)}
//                         />{' '}
//                         Show Passwords
//                     </label>
//                 </div>

//                 <button type="submit" style={buttonStyle}>Update Password</button>

//                 {error && <p style={errorStyle}>{error}</p>}
//                 {success && <p style={successStyle}>{success}</p>}
//             </form>
//         </div>
//     );
// };

// // --- MFA Setup ---
// const MfaSetup = () => {
//     const [qrCodeUrl, setQrCodeUrl] = useState('');
//     const [mfaToken, setMfaToken] = useState('');
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(null);
//     const { user, token } = useContext(AuthContext);
//     const [recoveryCodes, setRecoveryCodes] = useState([]);


//     // Add this new handler function inside the MfaSetup component
//     const handleDownloadCodes = () => {
//         // Format the codes into a simple text string
//         const textToSave =
//             `Digital Vault Recovery Codes
// Please save these codes in a safe place.
// ------------------------------------
// ${recoveryCodes.join('\n')}
// ------------------------------------
// `;
//         // Create a 'blob' which is a file-like object
//         const blob = new Blob([textToSave], { type: 'text/plain' });
//         // Create a temporary URL for the blob
//         const url = URL.createObjectURL(blob);
//         // Create a temporary link element
//         const link = document.createElement('a');
//         link.href = url;
//         link.download = 'digital-vault-recovery-codes.txt'; // The name of the file to be downloaded
//         // Programmatically click the link to trigger the download
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url); // Clean up the temporary URL
//     };

//     const handleEnableMfa = async () => {
//         setError(null);
//         setSuccess(null);
//         try {
//             const response = await fetch('http://localhost:5001/api/users/mfa/setup', {
//                 method: 'POST',
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });
//             const data = await response.json();
//             if (!response.ok) throw new Error(data.message || 'Failed to start MFA setup');
//             setQrCodeUrl(data.qrCodeUrl);
//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     const handleVerifyMfa = async (e) => {
//         e.preventDefault();
//         setError(null);
//         setSuccess(null);
//         try {
//             const response = await fetch('http://localhost:5001/api/users/mfa/verify', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify({ token: mfaToken })
//             });
//             const data = await response.json();
//             if (!response.ok) throw new Error(data.message || 'Failed to verify MFA');
//             setRecoveryCodes(data.recoveryCodes || []);
//             setSuccess(data.message + ' ✅ You can now refresh the page.');
//             setQrCodeUrl('');
//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     if (user.isMfaEnabled) {
//         return <p style={successStyle}>✓ Multi-Factor Authentication is already enabled on your account.</p>
//     }
//     // This is the view for showing the recovery codes
//     // ... inside the return statement of MfaSetup ...
//     // This is the updated JSX for the recovery code display
//     if (recoveryCodes.length > 0) {
//         return (
//             <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #f0ad4e' }}>
//                 <h4 style={{ color: '#f0ad4e' }}>Please Save These Recovery Codes!</h4>
//                 <p>Store these codes in a safe place. If you lose your device, you will need them to access your account.</p>
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#f9f9f9', padding: '1rem' }}>
//                     {recoveryCodes.map(code => <code key={code} style={{ padding: '5px', fontWeight: 'bold' }}>{code}</code>)}
//                 </div>

//                 {/* The updated buttons section */}
//                 <div style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
//                     <button onClick={() => setRecoveryCodes([])}>✓ I have saved my codes</button>
//                     {/* THIS IS THE NEW DOWNLOAD BUTTON */}
//                     <button onClick={handleDownloadCodes}>📄 Download as .txt</button>
//                 </div>

//                 {success && <p style={{ color: 'green' }}>{success}</p>}
//             </div>
//         )
//     }

//     return (
//         <div style={{ marginTop: '2.5rem' }}>
//             <h4>🔐 Enable Multi-Factor Authentication (MFA)</h4>
//             {!qrCodeUrl ? (
//                 <>
//                     <p style={{ color: '#555' }}>Add an extra layer of protection to your account.</p>
//                     <button onClick={handleEnableMfa} style={buttonStyle}>Generate QR Code</button>
//                 </>
//             ) : (
//                 <div style={{ marginTop: '1rem' }}>
//                     <p>1. Scan the QR code with your authenticator app:</p>
//                     <img src={qrCodeUrl} alt="MFA QR Code" style={{ maxWidth: '250px', borderRadius: '8px' }} />
//                     <p>2. Enter the 6-digit code from your app below:</p>
//                     <form onSubmit={handleVerifyMfa}>
//                         <input
//                             type="text"
//                             value={mfaToken}
//                             onChange={(e) => setMfaToken(e.target.value)}
//                             placeholder="Enter code"
//                             required
//                             style={{ ...inputStyle, width: '60%', display: 'inline-block', marginRight: '10px' }}
//                         />
//                         <button type="submit" style={{ ...buttonStyle, backgroundColor: '#28a745' }}>
//                             ✅ Verify
//                         </button>
//                     </form>
//                 </div>
//             )}
//             {error && <p style={errorStyle}>{error}</p>}
//             {success && <p style={successStyle}>{success}</p>}
//         </div>
//     );
// };

// // --- Main Settings Page ---
// const SettingsPage = () => {
//     return (
//         <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '2rem', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
//             <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#333' }}>⚙️ Account Settings</h3>
//             <UpdatePasswordForm />
//             <hr style={{ margin: '2.5rem 0', border: 'none', borderTop: '1px solid #eee' }} />
//             <MfaSetup />
//         </div>
//     );
// };

// export default SettingsPage;


import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// --- Password Form ---
const UpdatePasswordForm = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            const response = await fetch('http://localhost:5001/api/users/update-password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update password');
            setSuccess('✅ Password updated successfully! Logging you out...');
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="password-section">
            <div className="section-header">
                <div className="icon-wrapper">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" fill="currentColor" />
                    </svg>
                </div>
                <div>
                    <h3>Password & Security</h3>
                    <p>Update your password to keep your account secure</p>
                </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="form-container">
                <div className="input-group">
                    <label>Current Password</label>
                    <div className="input-wrapper">
                        <input
                            type={showPasswords ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            placeholder="Enter your current password"
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label>New Password</label>
                    <div className="input-wrapper">
                        <input
                            type={showPasswords ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength="8"
                            placeholder="Enter your new password"
                        />
                    </div>
                </div>

                <div className="checkbox-wrapper">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={showPasswords}
                            onChange={() => setShowPasswords(!showPasswords)}
                        />
                        <span className="checkmark"></span>
                        Show passwords
                    </label>
                </div>

                <button type="submit" className="primary-button">
                    Update Password
                </button>

                {error && (
                    <div className="alert error-alert">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" />
                            <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        {error}
                    </div>
                )}
                {success && (
                    <div className="alert success-alert">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        {success}
                    </div>
                )}
            </form>
        </div>
    );
};

// --- MFA Setup ---
const MfaSetup = () => {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [mfaToken, setMfaToken] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { user, token } = useContext(AuthContext);
    const [recoveryCodes, setRecoveryCodes] = useState([]);

    const handleDownloadCodes = () => {
        const textToSave =
            `Digital Vault Recovery Codes
Please save these codes in a safe place.
------------------------------------
${recoveryCodes.join('\n')}
------------------------------------
`;
        const blob = new Blob([textToSave], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'digital-vault-recovery-codes.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleEnableMfa = async () => {
        setError(null);
        setSuccess(null);
        try {
            const response = await fetch('http://localhost:5001/api/users/mfa/setup', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to start MFA setup');
            setQrCodeUrl(data.qrCodeUrl);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleVerifyMfa = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            const response = await fetch('http://localhost:5001/api/users/mfa/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ token: mfaToken })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to verify MFA');
            setRecoveryCodes(data.recoveryCodes || []);
            setSuccess(data.message + ' ✅ You can now refresh the page.');
            setQrCodeUrl('');
        } catch (err) {
            setError(err.message);
        }
    };

    if (user.isMfaEnabled) {
        return (
            <div className="mfa-section">
                <div className="section-header">
                    <div className="icon-wrapper success">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </div>
                    <div>
                        <h3>Two-Factor Authentication</h3>
                        <p className="success-text">Multi-factor authentication is enabled on your account</p>
                    </div>
                </div>
            </div>
        );
    }

    if (recoveryCodes.length > 0) {
        return (
            <div className="mfa-section">
                <div className="recovery-codes-container">
                    <div className="warning-header">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" />
                            <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" />
                            <circle cx="12" cy="17" r="1" fill="currentColor" />
                        </svg>
                        <h3>Save Your Recovery Codes</h3>
                    </div>
                    <p>Store these codes in a safe place. If you lose your device, you will need them to access your account.</p>

                    <div className="recovery-codes-grid">
                        {recoveryCodes.map((code, index) => (
                            <div key={code} className="recovery-code">
                                <span className="code-number">{String(index + 1).padStart(2, '0')}</span>
                                <code>{code}</code>
                            </div>
                        ))}
                    </div>

                    <div className="recovery-actions">
                        <button onClick={() => setRecoveryCodes([])} className="primary-button">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            I have saved my codes
                        </button>
                        <button onClick={handleDownloadCodes} className="secondary-button">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" />
                                <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" />
                                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            Download as .txt
                        </button>
                    </div>

                    {success && (
                        <div className="alert success-alert">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            {success}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="mfa-section">
            <div className="section-header">
                <div className="icon-wrapper">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="16" r="1" fill="currentColor" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" />
                    </svg>
                </div>
                <div>
                    <h3>Two-Factor Authentication</h3>
                    <p>Add an extra layer of security to your account</p>
                </div>
            </div>

            {!qrCodeUrl ? (
                <div className="mfa-intro">
                    <div className="feature-list">
                        <div className="feature-item">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Enhanced account security
                        </div>
                        <div className="feature-item">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Protection against unauthorized access
                        </div>
                        <div className="feature-item">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Works with popular authenticator apps
                        </div>
                    </div>
                    <button onClick={handleEnableMfa} className="primary-button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" />
                            <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" />
                            <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        Enable Two-Factor Authentication
                    </button>
                </div>
            ) : (
                <div className="qr-setup">
                    <div className="setup-steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h4>Scan QR Code</h4>
                                <p>Use your authenticator app to scan this QR code</p>
                                <div className="qr-container">
                                    <img src={qrCodeUrl} alt="MFA QR Code" />
                                </div>
                            </div>
                        </div>

                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h4>Verify Setup</h4>
                                <p>Enter the 6-digit code from your authenticator app</p>
                                <form onSubmit={handleVerifyMfa} className="verification-form">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            value={mfaToken}
                                            onChange={(e) => setMfaToken(e.target.value)}
                                            placeholder="000000"
                                            required
                                            className="verification-input"
                                            maxLength="6"
                                        />
                                        <button type="submit" className="verify-button">
                                            Verify Code
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="alert error-alert">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" />
                        <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    {error}
                </div>
            )}
            {success && (
                <div className="alert success-alert">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    {success}
                </div>
            )}
        </div>
    );
};

// --- Main Settings Page ---
const SettingsPage = () => {
    return (
        <div className="settings-container">
            <style>{`
                .settings-container {
                    min-height: 100vh;
                    background: #fafafa;
                    padding: 2rem 1rem;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                }

                .settings-card {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
                    overflow: hidden;
                    border: 1px solid #e1e1e1;
                }

                .settings-header {
                    background: white;
                    padding: 3rem 2rem;
                    text-align: center;
                    color: #111;
                    position: relative;
                    border-bottom: 1px solid #e1e1e1;
                }

                .settings-header::before {
                    display: none;
                }

                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    100% { transform: translateY(-100px) rotate(360deg); }
                }

                .settings-header h1 {
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin: 0 0 0.5rem 0;
                    position: relative;
                    z-index: 1;
                    color: #111;
                }

                .settings-header p {
                    font-size: 1.1rem;
                    margin: 0;
                    position: relative;
                    z-index: 1;
                    color: #767676;
                }

                .settings-content {
                    padding: 3rem 2rem;
                }

                .password-section, .mfa-section {
                    margin-bottom: 3rem;
                }

                .section-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .icon-wrapper {
                    width: 48px;
                    height: 48px;
                    background: #111;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    flex-shrink: 0;
                }

                .icon-wrapper.success {
                    background: #05a081;
                }

                .section-header h3 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin: 0 0 0.25rem 0;
                    color: #111;
                }

                .section-header p {
                    color: #767676;
                    margin: 0;
                    line-height: 1.5;
                }

                .success-text {
                    color: #05a081 !important;
                    font-weight: 500;
                }

                .form-container {
                    background: #fafafa;
                    border-radius: 8px;
                    padding: 2rem;
                    border: 1px solid #e1e1e1;
                }

                .input-group {
                    margin-bottom: 1.5rem;
                }

                .input-group label {
                    display: block;
                    font-weight: 600;
                    color: #2d3748;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                }

                .input-wrapper {
                    position: relative;
                }

                .input-wrapper input {
                    width: 100%;
                    padding: 0.875rem 1rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 1rem;
                    transition: all 0.2s ease;
                    background: white;
                    box-sizing: border-box;
                }

                .input-wrapper input:focus {
                    outline: none;
                    border-color:rgb(4, 4, 5);
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                    transform: translateY(-1px);
                }

                .checkbox-wrapper {
                    margin-bottom: 2rem;
                }

                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    font-size: 0.9rem;
                    color: #4a5568;
                    user-select: none;
                }

                .checkbox-label input[type="checkbox"] {
                    position: absolute;
                    opacity: 0;
                    cursor: pointer;
                }

                .checkmark {
                    width: 20px;
                    height: 20px;
                    background: white;
                    border: 2px solid #e2e8f0;
                    border-radius: 6px;
                    position: relative;
                    transition: all 0.2s ease;
                }

                .checkbox-label input[type="checkbox"]:checked ~ .checkmark {
                    background: linear-gradient(135deg,rgb(20, 21, 22) 0%,rgb(11, 9, 12) 100%);
                    border-color:rgb(11, 12, 19);
                }

                .checkbox-label input[type="checkbox"]:checked ~ .checkmark::after {
                    content: '✓';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-size: 12px;
                    font-weight: bold;
                }

                .primary-button {
                    background: linear-gradient(135deg,rgb(12, 12, 12) 0%,rgb(5, 5, 6) 100%);
                    color: white;
                    border: none;
                    padding: 0.875rem 2rem;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }

                .primary-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
                }

                .secondary-button {
                    background: white;
                    color: #4a5568;
                    border: 2px solid #e2e8f0;
                    padding: 0.875rem 2rem;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .secondary-button:hover {
                    border-color: #cbd5e0;
                    transform: translateY(-1px);
                }

                .alert {
                    padding: 1rem;
                    border-radius: 12px;
                    margin-top: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-weight: 500;
                }

                .error-alert {
                    background: #fed7d7;
                    color: #c53030;
                    border: 1px solid #feb2b2;
                }

                .success-alert {
                    background: #c6f6d5;
                    color: #276749;
                    border: 1px solid #9ae6b4;
                }

                .section-divider {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
                    margin: 3rem 0;
                }

                .mfa-intro {
                    background: #f7fafc;
                    border-radius: 16px;
                    padding: 2rem;
                    border: 1px solid #e2e8f0;
                }

                .feature-list {
                    margin-bottom: 2rem;
                }

                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 0.75rem;
                    color: #4a5568;
                    font-weight: 500;
                }

                .feature-item svg {
                    color: #38a169;
                    flex-shrink: 0;
                }

                .recovery-codes-container {
                    background: #fffaf0;
                    border: 2px solid #fbb040;
                    border-radius: 16px;
                    padding: 2rem;
                }

                .warning-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                    color: #c05621;
                }

                .warning-header h3 {
                    margin: 0;
                    font-size: 1.25rem;
                    font-weight: 600;
                }

                .recovery-codes-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 0.75rem;
                    margin: 1.5rem 0;
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                }

                .recovery-code {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    background: #f7fafc;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                }

                .code-number {
                    width: 24px;
                    height: 24px;
                    background: #667eea;
                    color: white;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 600;
                    flex-shrink: 0;
                }

                .recovery-code code {
                    font-family: 'Monaco', 'Menlo', monospace;
                    font-weight: 600;
                    color: #2d3748;
                    background: transparent;
                    padding: 0;
                }

                .recovery-actions {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1.5rem;
                    flex-wrap: wrap;
                }

                .qr-setup {
                    background: #f7fafc;
                    border-radius: 16px;
                    padding: 2rem;
                    border: 1px solid #e2e8f0;
                }

                .setup-steps {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .step {
                    display: flex;
                    gap: 1rem;
                    align-items: flex-start;
                }

                .step-number {
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    flex-shrink: 0;
                }

                .step-content {
                    flex: 1;
                }

                .step-content h4 {
                    margin: 0 0 0.5rem 0;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #2d3748;
                }

                .step-content p {
                    margin: 0 0 1rem 0;
                    color: #718096;
                    line-height: 1.5;
                }

                .qr-container {
                    display: inline-block;
                    padding: 1rem;
                    background: white;
                    border-radius: 16px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                }

                .qr-container img {
                    display: block;
                    max-width: 200px;
                    border-radius: 8px;
                }

                .verification-form {
                    margin-top: 1rem;
                }

                .verification-input {
                    width: 120px !important;
                    text-align: center;
                    font-family: 'Monaco', 'Menlo', monospace;
                    font-size: 1.25rem;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    border: 2px solid #e2e8f0 !important;
                    border-radius: 12px !important;
                    padding: 0.875rem 1rem !important;
                    margin-right: 1rem;
                }

                .verification-input:focus {
                    border-color: #667eea !important;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
                }

                .verify-button {
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                    color: white;
                    border: none;
                    padding: 0.875rem 1.5rem;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
                }

                .verify-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(79, 172, 254, 0.4);
                }

                @media (max-width: 768px) {
                    .settings-container {
                        padding: 1rem;
                    }

                    .settings-header {
                        padding: 2rem 1.5rem;
                    }

                    .settings-header h1 {
                        font-size: 2rem;
                    }

                    .settings-content {
                        padding: 2rem 1.5rem;
                    }

                    .section-header {
                        flex-direction: column;
                        text-align: center;
                        gap: 1rem;
                    }

                    .form-container,
                    .mfa-intro,
                    .qr-setup,
                    .recovery-codes-container {
                        padding: 1.5rem;
                    }

                    .recovery-codes-grid {
                        grid-template-columns: 1fr;
                    }

                    .recovery-actions {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .step {
                        flex-direction: column;
                        text-align: center;
                    }

                    .verification-form .input-group {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 1rem;
                    }

                    .verification-input {
                        margin-right: 0 !important;
                    }
                }

                @media (max-width: 480px) {
                    .settings-header h1 {
                        font-size: 1.75rem;
                    }

                    .primary-button,
                    .secondary-button,
                    .verify-button {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>

            <div className="settings-card">
                <div className="settings-header">
                    <h1>Account Settings</h1>
                    <p>Manage your security preferences and account details</p>
                </div>

                <div className="settings-content">
                    <UpdatePasswordForm />
                    <div className="section-divider"></div>
                    <MfaSetup />
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;