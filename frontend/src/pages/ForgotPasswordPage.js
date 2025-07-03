// // frontend/src/pages/ForgotPasswordPage.js

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// const ForgotPasswordPage = () => {
//     const [email, setEmail] = useState('');
//     const [message, setMessage] = useState('');
//     const [error, setError] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setMessage('');
//         setError('');
//         try {
//             const response = await fetch('/api/users/forgot-password', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ email }),
//             });
//             const data = await response.json();
//             if (!response.ok) throw new Error(data.message || 'Something went wrong');
//             setMessage(data.message);
//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     return (
//         <div style={{ maxWidth: '400px', margin: '3rem auto', textAlign: 'center' }}>
//             <h2>Forgot Your Password?</h2>
//             <p>No problem. Enter your email address below and we'll send you a link to reset it.</p>
//             <form onSubmit={handleSubmit}>
//                 <div style={{ marginBottom: '1rem' }}>
//                     <input
//                         type="email"
//                         placeholder="Enter your email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                         style={{ width: '95%', padding: '10px' }}
//                     />
//                 </div>
//                 <button type="submit" style={{ width: '100%', padding: '10px' }}>Send Reset Link</button>
//             </form>
//             {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
//             {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
//         </div>
//     );
// };

// export default ForgotPasswordPage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsThinking(true);

        try {
            const response = await fetch('/api/users/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Something went wrong');

            setIsThinking(false);
            setIsSuccess(true);
            setMessage(data.message || 'Password reset link sent! Check your email.');

            // Reset animation after 5 seconds
            setTimeout(() => {
                setIsSuccess(false);
            }, 5000);

        } catch (err) {
            setIsThinking(false);
            setError(err.message);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            padding: '20px',
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                // boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
                width: '100%',
                maxWidth: '480px',
                padding: '40px',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.4s ease-out',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Animated Character */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '30px',
                    position: 'relative',
                    height: '140px',
                }}>
                    {/* Base Character */}
                    <div style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        transition: 'all 0.3s ease',
                        opacity: isThinking || isSuccess ? 0 : 1,
                    }}>
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
                            <circle cx="9" cy="10" r="1" fill="#1F2937" />
                            <circle cx="15" cy="10" r="1" fill="#1F2937" />
                            <path d="M8 15C8 15 9.5 17 12 17C14.5 17 16 15 16 15" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 8V10" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M10 8V10" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M14 8V10" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M12 20V22" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
                        </svg>
                    </div>

                    {/* Thinking Animation */}
                    {isThinking && (
                        <div style={{
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            animation: 'bounce 1.5s infinite',
                        }}>
                            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
                                <circle cx="9" cy="10" r="1" fill="#1F2937" />
                                <circle cx="15" cy="10" r="1" fill="#1F2937" />
                                <path d="M8 15C8 15 9.5 17 12 17C14.5 17 16 15 16 15" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 20V22" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
                                <path d="M17 8C17 8 18 9 18 10" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="0.5 2" />
                                <path d="M19 12C19 12 20 12 20 13" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="0.5 2" />
                            </svg>
                            <div style={{
                                position: 'absolute',
                                top: '-20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: '12px',
                                color: '#6B7280',
                                whiteSpace: 'nowrap',
                            }}>
                                Searching for your account...
                            </div>
                        </div>
                    )}

                    {/* Success Animation */}
                    {isSuccess && (
                        <div style={{
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            animation: 'celebrate 0.5s ease-out',
                        }}>
                            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" fill="#A7F3D0" stroke="#10B981" strokeWidth="1.5" />
                                <circle cx="9" cy="10" r="1" fill="#1F2937" />
                                <circle cx="15" cy="10" r="1" fill="#1F2937" />
                                <path d="M8 15C8 15 9.5 17 12 17C14.5 17 16 15 16 15" stroke="#1F2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 20V22" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
                                <path d="M7 9L9 11L13 7" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M15 9L17 11L21 7" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}
                </div>

                <h2 style={{
                    color: '#1F2937',
                    fontSize: '24px',
                    fontWeight: '600',
                    textAlign: 'center',
                    marginBottom: '8px',
                }}>
                    Forgot Your Password?
                </h2>

                <p style={{
                    color: '#6B7280',
                    fontSize: '14px',
                    textAlign: 'center',
                    marginBottom: '24px',
                    lineHeight: '1.5',
                }}>
                    Don't worry! Enter your email and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#374151',
                            fontSize: '14px',
                            fontWeight: '500',
                        }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '6px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'all 0.2s',
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isThinking}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: isThinking ? '#000000' : '#000000',
                            color: isThinking ? '#9CA3AF' : 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: isThinking ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            marginBottom: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {isThinking ? (
                            <>
                                <svg style={{
                                    width: '16px',
                                    height: '16px',
                                    marginRight: '8px',
                                    animation: 'spin 1s linear infinite',
                                }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2V6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 18V22" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4.93 4.93L7.76 7.76" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16.24 16.24L19.07 19.07" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M2 12H6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M18 12H22" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4.93 19.07L7.76 16.24" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M16.24 7.76L19.07 4.93" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Processing...
                            </>
                        ) : 'Send Reset Link'}
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
                        animation: 'fadeIn 0.3s ease-out',
                    }}>
                        <svg style={{ width: '16px', height: '16px', marginRight: '8px' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8V12V8ZM12 16H12.01H12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#B91C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {error}
                    </div>
                )}

                {message && (
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

                <p style={{
                    textAlign: 'center',
                    fontSize: '14px',
                    color: '#6B7280',
                    marginTop: '16px',
                }}>
                    Remember your password?{' '}
                    <Link to="/login" style={{
                        color: '#3B82F6',
                        fontWeight: '500',
                        textDecoration: 'none',
                    }}>
                        Sign in
                    </Link>
                </p>

                <style>{`
                    @keyframes bounce {
                        0%, 100% { transform: translateX(-50%) translateY(0); }
                        50% { transform: translateX(-50%) translateY(-5px); }
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    @keyframes fadeIn {
                        0% { opacity: 0; transform: translateY(10px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes celebrate {
                        0% { transform: translateX(-50%) scale(0.8); opacity: 0; }
                        50% { transform: translateX(-50%) scale(1.1); }
                        100% { transform: translateX(-50%) scale(1); opacity: 1; }
                    }
                    input:focus {
                        border-color:rgb(0, 1, 2) !important;
                        // box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                    }
                `}</style>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;