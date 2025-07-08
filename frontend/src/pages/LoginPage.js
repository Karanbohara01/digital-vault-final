
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