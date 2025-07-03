// // frontend/src/pages/ResetPasswordPage.js

// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';

// const ResetPasswordPage = () => {
//     // The useParams hook gets the 'token' from the URL
//     const { token } = useParams();
//     const navigate = useNavigate();

//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [message, setMessage] = useState('');
//     const [error, setError] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setMessage('');
//         setError('');

//         if (password !== confirmPassword) {
//             return setError("Passwords do not match.");
//         }

//         try {
//             // Use the token from the URL to call our backend API
//             const response = await fetch(`/api/users/reset-password/${token}`, {
//                 method: 'PUT',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ password }),
//             });

//             const data = await response.json();
//             if (!response.ok) throw new Error(data.message || 'Something went wrong');

//             setMessage('Password has been reset successfully! Redirecting to login...');

//             // After success, send the user to the login page
//             setTimeout(() => {
//                 navigate('/login');
//             }, 3000);

//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     return (
//         <div style={{ maxWidth: '400px', margin: '3rem auto', textAlign: 'center' }}>
//             <h2>Reset Your Password</h2>
//             <p>Please enter your new password below.</p>
//             <form onSubmit={handleSubmit}>
//                 <div style={{ marginBottom: '1rem' }}>
//                     <label>New Password:</label><br />
//                     <input
//                         type="password"
//                         placeholder="Enter your new password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                         minLength="8"
//                         style={{ width: '95%', padding: '10px' }}
//                     />
//                 </div>
//                 <div style={{ marginBottom: '1rem' }}>
//                     <label>Confirm New Password:</label><br />
//                     <input
//                         type="password"
//                         placeholder="Confirm your new password"
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                         required
//                         minLength="8"
//                         style={{ width: '95%', padding: '10px' }}
//                     />
//                 </div>
//                 <button type="submit" style={{ width: '100%', padding: '10px' }}>Reset Password</button>
//             </form>
//             {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
//             {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
//         </div>
//     );
// };

// export default ResetPasswordPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            return setError("Passwords don't match - let's try that again");
        }

        try {
            const response = await fetch(`/api/users/reset-password/${token}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Something went wrong');

            setShowSuccess(true);
            setMessage('Password reset successfully! Taking you back to login...');

            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (err) {
            setError(err.message);
        }
    };

    const passwordStrength = () => {
        if (!password) return 0;
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        return strength;
    };

    const strengthText = ['Very weak', 'Weak', 'Good', 'Strong', 'Very strong'][passwordStrength()];
    const strengthColor = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'][passwordStrength()];

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            padding: '20px',
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
                width: '100%',
                maxWidth: '480px',
                padding: '40px',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.4s ease-out',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Sad mood illustration */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '30px',
                    animation: 'bounce 2s infinite alternate',
                }}>
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
                        <circle cx="9" cy="10" r="1" fill="#1F2937" />
                        <circle cx="15" cy="10" r="1" fill="#1F2937" />
                        <path d="M8 15C8 15 9.5 17 12 17C14.5 17 16 15 16 15" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 8V10" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M10 8V10" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M14 8V10" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <h2 style={{
                        marginTop: '16px',
                        color: '#1F2937',
                        fontSize: '24px',
                        fontWeight: '600',
                    }}>
                        Forgot your password?
                    </h2>
                    <p style={{
                        color: '#6B7280',
                        fontSize: '14px',
                        marginTop: '8px',
                    }}>
                        Let's get you back in securely
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#374151',
                            fontSize: '14px',
                            fontWeight: '500',
                        }}>
                            New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="8"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '6px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                            }}
                        />
                        {password && (
                            <div style={{
                                marginTop: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '12px',
                            }}>
                                <div style={{
                                    flex: 1,
                                    height: '4px',
                                    backgroundColor: '#E5E7EB',
                                    borderRadius: '2px',
                                    marginRight: '8px',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        width: `${passwordStrength() * 25}%`,
                                        height: '100%',
                                        backgroundColor: strengthColor,
                                        transition: 'all 0.3s ease',
                                    }} />
                                </div>
                                <span style={{ color: strengthColor }}>
                                    {strengthText}
                                </span>
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#374151',
                            fontSize: '14px',
                            fontWeight: '500',
                        }}>
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm your new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength="8"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '6px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#3B82F6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            marginBottom: '16px',
                        }}
                    >
                        Reset Password
                    </button>
                </form>

                {error && (
                    <div style={{
                        backgroundColor: '#FEE2E2',
                        color: '#B91C1C',
                        padding: '12px',
                        borderRadius: '6px',
                        marginBottom: '16px',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <svg style={{ width: '16px', height: '16px', marginRight: '8px' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8V12V8ZM12 16H12.01H12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {error}
                    </div>
                )}

                {showSuccess && (
                    <div style={{
                        backgroundColor: '#D1FAE5',
                        color: '#065F46',
                        padding: '12px',
                        borderRadius: '6px',
                        marginBottom: '16px',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        animation: 'fadeIn 0.5s ease-out',
                    }}>
                        <svg style={{ width: '16px', height: '16px', marginRight: '8px' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#065F46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {message}
                    </div>
                )}

                <style>{`
                    @keyframes bounce {
                        0% { transform: translateY(0); }
                        100% { transform: translateY(-5px); }
                    }
                    @keyframes fadeIn {
                        0% { opacity: 0; transform: translateY(10px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                    input:focus {
                        border-color:rgb(1, 4, 10) !important;
                        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                    }
                `}</style>
            </div>
        </div>
    );
};

export default ResetPasswordPage;