

// import React, { useState, useContext, useEffect } from 'react';
// import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';


// const LoginPage = () => {
//     // --- STATE MANAGEMENT ---
//     const [loginStep, setLoginStep] = useState('password'); // 'password' or 'mfa'
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [mfaToken, setMfaToken] = useState('');
//     const [recoveryCode, setRecoveryCode] = useState('');
//     const [showRecoveryForm, setShowRecoveryForm] = useState(false);
//     const [pendingMfaUser, setPendingMfaUser] = useState(null); // Will hold {userId, email}
//     const [searchParams] = useSearchParams(); // 2. Initialize search params hook
//     const [error, setError] = useState(null);
//     const [rememberMe, setRememberMe] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);

//     const { login, isAuthenticated, logout } = useContext(AuthContext);
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [success, setSuccess] = useState(''); // Add state for a success message

//     const from = location.state?.from?.pathname || "/dashboard";

//     useEffect(() => {
//         if (isAuthenticated) {
//             navigate(from, { replace: true });
//         }
//     }, [isAuthenticated, navigate, from]);

//     // --- 3. NEW: useEffect to check for verification success message ---
//     useEffect(() => {
//         const isVerified = searchParams.get('verified');
//         if (isVerified) {
//             // If a user just verified, log them out of any old session
//             // to ensure they perform a fresh login.
//             logout();
//             setSuccess('✅ Email verified successfully! You can now log in.');
//         }
//     }, [searchParams, logout]); // Add logout to the dependency array



//     useEffect(() => {
//         const savedEmail = localStorage.getItem("rememberedEmail");
//         if (savedEmail) {
//             setEmail(savedEmail);
//             setRememberMe(true);
//         }
//     }, []);
//     // The corrected handleSubmit function in LoginPage.js

//     const handlePasswordSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);
//         if (rememberMe) {
//             localStorage.setItem("rememberedEmail", email);
//         } else {
//             localStorage.removeItem("rememberedEmail");
//         }

//         try {
//             const response = await fetch('/api/users/login', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ email, password }),
//             });

//             // First, check if the response was successful (e.g., status 200 OK)
//             if (response.ok) {
//                 const data = await response.json();

//                 // If successful, check if MFA is required
//                 if (data.mfaRequired) {
//                     setPendingMfaUser({ userId: data.userId, email: email });
//                     setLoginStep('mfa');
//                 } else {
//                     // If no MFA, login is complete
//                     login(data);
//                 }
//             } else {
//                 // If the response was an error (e.g., status 401, 403, 429)
//                 // check if the error message is JSON or plain text
//                 const contentType = response.headers.get("content-type");
//                 if (contentType && contentType.indexOf("application/json") !== -1) {
//                     const errorData = await response.json();
//                     throw new Error(errorData.message || 'An error occurred');
//                 } else {
//                     const textError = await response.text();
//                     throw new Error(textError);
//                 }
//             }
//         } catch (err) {
//             setError(err.message);
//         }
//     };


//     const handleMfaSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);
//         setSuccess(null); // Clear success message on new attempt

//         try {
//             const response = await fetch('/api/users/mfa/login-verify', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ userId: pendingMfaUser.userId, token: mfaToken }),
//             });
//             const data = await response.json();
//             if (!response.ok) throw new Error(data.message);
//             login(data);
//         } catch (err) { setError(err.message); }
//     };

//     const handleRecoverySubmit = async (e) => {
//         e.preventDefault();
//         setError(null);
//         try {
//             const response = await fetch('/api/users/mfa/recover', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ email: pendingMfaUser.email, recoveryCode }),
//             });
//             const data = await response.json();
//             if (!response.ok) throw new Error(data.message);
//             login(data);
//         } catch (err) { setError(err.message); }
//     };

//     // --- STYLES ---
//     const styles = {
//         container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', fontFamily: 'Segoe UI, sans-serif' },
//         card: { backgroundColor: '#ffffff', padding: '2rem', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
//         heading: { textAlign: 'center', marginBottom: '1.5rem', color: '#1f2937' },
//         inputGroup: { marginBottom: '1rem' },
//         label: { display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' },
//         input: { width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' },
//         button: { width: '100%', padding: '0.75rem', backgroundColor: '#3b82f6', color: 'white', fontWeight: '600', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', marginTop: '1rem', transition: 'background-color 0.2s ease' },
//         error: { color: '#dc2626', marginTop: '1rem', fontSize: '0.95rem', textAlign: 'center' },
//         passwordInputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
//         toggleButton: { position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#888' },
//         options: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: '#555' },
//         link: { color: '#3b82f6', textDecoration: 'none', fontWeight: '500' },
//     };
//     return (
//         <div style={styles.container}>
//             <div style={styles.card}>
//                 {/* Add this to display the success message */}
//                 {success && <p style={{ color: 'green', backgroundColor: '#e7f9ec', padding: '10px', borderRadius: '6px' }}>{success}</p>}

//                 {loginStep === 'password' && (
//                     <>
//                         <h2 style={styles.heading}>🔐 Login to Your Account</h2>
//                         <form onSubmit={handlePasswordSubmit}>
//                             <div style={styles.inputGroup}><label htmlFor="email" style={styles.label}>Email Address</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} placeholder="you@example.com" /></div>
//                             <div style={styles.inputGroup}><label htmlFor="password" style={styles.label}>Password</label><div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}><input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required style={{ ...styles.input, paddingRight: '60px' }} placeholder="Enter your password" /><button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>{showPassword ? 'Hide' : 'Show'}</button></div></div>
//                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: '#555', marginTop: '1rem' }}><label><input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} style={{ marginRight: '8px' }} />Remember Me</label><Link to="/forgot-password" style={styles.link}>Forgot Password?</Link></div>
//                             <button type="submit" style={styles.button}>Login</button>
//                         </form>
//                         <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.95rem' }}>Don’t have an account? <Link to="/register" style={styles.link}>Register now</Link></p>
//                     </>
//                 )}

//                 {loginStep === 'mfa' && (
//                     <>
//                         {!showRecoveryForm ? (
//                             <>
//                                 <h2 style={styles.heading}>Enter Authentication Code</h2>
//                                 <form onSubmit={handleMfaSubmit}>
//                                     <div style={styles.inputGroup}><label htmlFor="mfaToken" style={styles.label}>6-Digit Code</label><input id="mfaToken" type="text" value={mfaToken} onChange={(e) => setMfaToken(e.target.value)} required style={styles.input} placeholder="123456" maxLength="6" /></div>
//                                     <button type="submit" style={styles.button}>Verify Login</button>
//                                 </form>
//                                 <button onClick={() => setShowRecoveryForm(true)} style={{ ...styles.link, background: 'none', border: 'none', cursor: 'pointer', marginTop: '1rem', width: '100%' }}>Use a recovery code</button>
//                             </>
//                         ) : (
//                             <>
//                                 <h2 style={styles.heading}>Use a Recovery Code</h2>
//                                 <form onSubmit={handleRecoverySubmit}>
//                                     <div style={styles.inputGroup}><label htmlFor="recoveryCode" style={styles.label}>Recovery Code</label><input id="recoveryCode" type="text" value={recoveryCode} onChange={(e) => setRecoveryCode(e.target.value)} required style={styles.input} placeholder="Enter one of your backup codes" /></div>
//                                     <button type="submit" style={styles.button}>Login with Recovery</button>
//                                 </form>
//                                 <button onClick={() => setShowRecoveryForm(false)} style={{ ...styles.link, background: 'none', border: 'none', cursor: 'pointer', marginTop: '1rem', width: '100%' }}>Use authenticator app instead</button>
//                             </>
//                         )}
//                     </>
//                 )}

//                 {error && <p style={styles.error}>⚠️ {error}</p>}
//             </div>
//         </div>
//     );
// };

// export default LoginPage;
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
    // --- STATE MANAGEMENT ---
    const [loginStep, setLoginStep] = useState('password');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mfaToken, setMfaToken] = useState('');
    const [recoveryCode, setRecoveryCode] = useState('');
    const [showRecoveryForm, setShowRecoveryForm] = useState(false);
    const [pendingMfaUser, setPendingMfaUser] = useState(null);
    const [searchParams] = useSearchParams();
    const [error, setError] = useState(null);
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState('');

    const { login, isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";

    const getPlaceholderImage = (index, width = 600, height = 400) => {
        return `https://picsum.photos/${width}/${height}?random=${index}`;
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    useEffect(() => {
        const isVerified = searchParams.get('verified');
        if (isVerified) {
            logout();
            setSuccess('✅ Email verified successfully! You can now log in.');
        }
    }, [searchParams, logout]);

    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (rememberMe) {
            localStorage.setItem("rememberedEmail", email);
        } else {
            localStorage.removeItem("rememberedEmail");
        }

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.mfaRequired) {
                    setPendingMfaUser({ userId: data.userId, email: email });
                    setLoginStep('mfa');
                } else {
                    login(data);
                }
            } else {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'An error occurred');
                } else {
                    const textError = await response.text();
                    throw new Error(textError);
                }
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleMfaSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/users/mfa/login-verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: pendingMfaUser.userId, token: mfaToken }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            login(data);
        } catch (err) { setError(err.message); }
    };

    const handleRecoverySubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch('/api/users/mfa/recover', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: pendingMfaUser.email, recoveryCode }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            login(data);
        } catch (err) { setError(err.message); }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            backgroundColor: '#FFFFFF',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}>
            {/* Image Section */}
            <div style={{
                flex: 1,
                backgroundImage: `url(${getPlaceholderImage(2, 1200, 800)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
            }}>
                <div style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '40px',
                    color: 'white',
                    textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                }}>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>Photo by</div>
                    <div style={{ fontSize: '16px', fontWeight: '500' }}>Random User</div>
                </div>
            </div>

            {/* Form Section */}
            <div style={{
                width: '440px',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}>
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '8px',
                    }}>
                        {loginStep === 'password' ? 'Welcome back' : 'Two-factor authentication'}
                    </h2>
                    <p style={{
                        color: '#6B7280',
                        fontSize: '14px',
                        lineHeight: '1.5',
                    }}>
                        {loginStep === 'password' ? 'Sign in to your account' : 'Enter your authentication code'}
                    </p>
                </div>

                {success && (
                    <div style={{
                        backgroundColor: '#D1FAE5',
                        color: '#065F46',
                        padding: '12px',
                        borderRadius: '6px',
                        marginBottom: '24px',
                        fontSize: '14px',
                    }}>
                        {success}
                    </div>
                )}

                {error && (
                    <div style={{
                        backgroundColor: '#FEE2E2',
                        color: '#B91C1C',
                        padding: '12px',
                        borderRadius: '6px',
                        marginBottom: '24px',
                        fontSize: '14px',
                    }}>
                        {error}
                    </div>
                )}

                {loginStep === 'password' && (
                    <form onSubmit={handlePasswordSubmit} style={{ marginBottom: '24px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <input
                                id="email"
                                type="email"
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
                                    transition: 'border-color 0.2s',
                                }}
                                placeholder="Email address"
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                    }}
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#6B7280',
                                        fontSize: '14px',
                                    }}
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px',
                            fontSize: '14px',
                        }}>
                            <label style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    style={{
                                        marginRight: '8px',
                                        width: '16px',
                                        height: '16px',
                                        accentColor: '#111827',
                                    }}
                                />
                                Remember me
                            </label>
                            <Link
                                to="/forgot-password"
                                style={{
                                    color: '#111827',
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    borderBottom: '1px solid #9CA3AF',
                                }}
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: '#111827',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                marginBottom: '24px',
                            }}
                        >
                            Sign in
                        </button>
                    </form>
                )}

                {loginStep === 'mfa' && (
                    <>
                        {!showRecoveryForm ? (
                            <>
                                <form onSubmit={handleMfaSubmit} style={{ marginBottom: '24px' }}>
                                    <div style={{ marginBottom: '20px' }}>
                                        <input
                                            id="mfaToken"
                                            type="text"
                                            value={mfaToken}
                                            onChange={(e) => setMfaToken(e.target.value)}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                outline: 'none',
                                                transition: 'border-color 0.2s',
                                            }}
                                            placeholder="6-digit authentication code"
                                            maxLength="6"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            backgroundColor: '#111827',
                                            color: '#FFFFFF',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s',
                                            marginBottom: '24px',
                                        }}
                                    >
                                        Verify
                                    </button>
                                </form>
                                <button
                                    onClick={() => setShowRecoveryForm(true)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#111827',
                                        textDecoration: 'none',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        textAlign: 'center',
                                        width: '100%',
                                        borderBottom: '1px solid #9CA3AF',
                                        paddingBottom: '4px',
                                    }}
                                >
                                    Use a recovery code
                                </button>
                            </>
                        ) : (
                            <>
                                <form onSubmit={handleRecoverySubmit} style={{ marginBottom: '24px' }}>
                                    <div style={{ marginBottom: '20px' }}>
                                        <input
                                            id="recoveryCode"
                                            type="text"
                                            value={recoveryCode}
                                            onChange={(e) => setRecoveryCode(e.target.value)}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                border: '1px solid #E5E7EB',
                                                borderRadius: '6px',
                                                fontSize: '14px',
                                                outline: 'none',
                                                transition: 'border-color 0.2s',
                                            }}
                                            placeholder="Enter one of your backup codes"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            backgroundColor: '#111827',
                                            color: '#FFFFFF',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s',
                                            marginBottom: '24px',
                                        }}
                                    >
                                        Login with Recovery
                                    </button>
                                </form>
                                <button
                                    onClick={() => setShowRecoveryForm(false)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#111827',
                                        textDecoration: 'none',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        textAlign: 'center',
                                        width: '100%',
                                        borderBottom: '1px solid #9CA3AF',
                                        paddingBottom: '4px',
                                    }}
                                >
                                    Use authenticator app instead
                                </button>
                            </>
                        )}
                    </>
                )}

                {loginStep === 'password' && (
                    <p style={{
                        textAlign: 'center',
                        fontSize: '14px',
                        color: '#6B7280',
                    }}>
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            style={{
                                color: '#111827',
                                fontWeight: '500',
                                textDecoration: 'none',
                                borderBottom: '1px solid #9CA3AF',
                            }}
                        >
                            Sign up
                        </Link>
                    </p>
                )}

                <style>{`
                    input:focus {
                        border-color: #111827 !important;
                        box-shadow: 0 0 0 1px rgba(17, 24, 39, 0.5);
                    }
                `}</style>
            </div>
        </div>
    );
};

export default LoginPage;