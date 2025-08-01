

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';


const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [showPassword, setShowPassword] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [passwordValidity, setPasswordValidity] = useState({
        minLength: false,
        hasUpper: false,
        hasLower: false,
        hasNumber: false,
        hasSpecial: false,
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [captchaToken, setCaptchaToken] = useState(null);


    const getPlaceholderImage = (index, width = 600, height = 400) => {
        return `https://picsum.photos/${width}/${height}?random=${index}`;
    };

    useEffect(() => {
        setPasswordValidity({
            minLength: password.length >= 8,
            hasUpper: /[A-Z]/.test(password),
            hasLower: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecial: /[^A-Za-z0-9]/.test(password),
        });
    }, [password]);

    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsEmailValid(emailRegex.test(email));
    }, [email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!captchaToken) {
            setError("Please complete the CAPTCHA to verify you're not a robot.");
            return;
        }
        setError(null);
        setSuccess(null);
        setIsSubmitting(true);


        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role, captchaToken }),
            });

            const data = await response.json();
            if (!response.ok) {
                if (window.grecaptcha) {
                    window.grecaptcha.reset();
                }
                setCaptchaToken(null);

                throw new Error(data.message || 'Failed to register');
            }

            setSuccess(data.message);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isPasswordValid = Object.values(passwordValidity).every(Boolean);
    const isFormValid = isPasswordValid && isEmailValid && name.length > 0;

    const PasswordRequirement = ({ isValid, text }) => (
        <li style={{
            color: isValid ? '#10B981' : '#6B7280',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '4px',
            transition: 'color 0.2s ease',
        }}>
            <span style={{ marginRight: '6px' }}>
                {isValid ? '✓' : '•'}
            </span>
            {text}
        </li>
    );

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
                backgroundImage: `url(${getPlaceholderImage(1, 1200, 800)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: { xs: 'none', md: 'block' },
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
                        Join our community
                    </h2>
                    <p style={{
                        color: '#6B7280',
                        fontSize: '14px',
                        lineHeight: '1.5',
                    }}>
                        Create your account to get started
                    </p>
                </div>

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

                <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                            placeholder="Full Name"
                        />
                    </div>

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
                                border: `1px solid ${email.length > 0 ? (isEmailValid ? '#A7F3D0' : '#FECACA') : '#E5E7EB'}`,
                                borderRadius: '6px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                            }}
                            placeholder="Email address"
                        />
                        {email.length > 0 && (
                            <p style={{
                                color: isEmailValid ? '#10B981' : '#EF4444',
                                fontSize: '12px',
                                marginTop: '4px',
                            }}>
                                {isEmailValid ? 'Valid email address' : 'Please enter a valid email'}
                            </p>
                        )}
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
                                    border: `1px solid ${password.length > 0 ? (isPasswordValid ? '#A7F3D0' : '#FECACA') : '#E5E7EB'}`,
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
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {password && (
                            <ul style={{
                                marginTop: '8px',
                                paddingLeft: '20px',
                            }}>
                                <PasswordRequirement
                                    isValid={passwordValidity.minLength}
                                    text="At least 8 characters"
                                />
                                <PasswordRequirement
                                    isValid={passwordValidity.hasLower}
                                    text="Lowercase letter (a-z)"
                                />
                                <PasswordRequirement
                                    isValid={passwordValidity.hasUpper}
                                    text="Uppercase letter (A-Z)"
                                />
                                <PasswordRequirement
                                    isValid={passwordValidity.hasNumber}
                                    text="Number (0-9)"
                                />
                                <PasswordRequirement
                                    isValid={passwordValidity.hasSpecial}
                                    text="Special character (!@#$%^&*)"
                                />
                            </ul>
                        )}
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label htmlFor="role" style={{
                            display: 'block',
                            fontSize: '14px',
                            color: '#374151',
                            marginBottom: '8px',
                        }}>
                            Select your role
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '6px',
                                fontSize: '14px',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                backgroundColor: '#FFFFFF',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="customer">Customer</option>
                            <option value="creator">Creator</option>
                        </select>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        margin: '24px 0',
                        color: '#E5E7EB',
                    }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
                        <span style={{ padding: '0 12px', fontSize: '12px', color: '#6B7280' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
                    </div>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                        <ReCAPTCHA
                            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                            onChange={(token) => setCaptchaToken(token)}
                            onExpired={() => setCaptchaToken(null)}
                        />
                    </div>


                    <button
                        type="submit"
                        disabled={!isFormValid || isSubmitting}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: isFormValid ? '#111827' : '#E5E7EB',
                            color: isFormValid ? '#FFFFFF' : '#9CA3AF',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: isFormValid ? 'pointer' : 'not-allowed',
                            transition: 'background-color 0.2s',
                            marginBottom: '24px',
                        }}
                    >
                        {isSubmitting ? (
                            <>
                                <span style={{
                                    display: 'inline-block',
                                    width: '16px',
                                    height: '16px',
                                    marginRight: '8px',
                                    border: '2px solid transparent',
                                    borderTopColor: '#FFFFFF',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                    verticalAlign: 'middle',
                                }} />
                                Processing...
                            </>
                        ) : 'Create Account'}
                    </button>


                    <button
                        type="button"
                        onClick={() => alert("Google login coming soon!")}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#FFFFFF',
                            color: '#374151',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '24px',
                        }}
                    >
                        <svg style={{ width: '16px', height: '16px', marginRight: '8px' }} viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>
                </form>

                <p style={{
                    textAlign: 'center',
                    fontSize: '14px',
                    color: '#6B7280',
                }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{
                        color: '#111827',
                        fontWeight: '500',
                        textDecoration: 'none',
                        borderBottom: '1px solid #9CA3AF',
                    }}>
                        Sign in
                    </Link>
                </p>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                input:focus, select:focus {
                    border-color: #111827 !important;
                    box-shadow: 0 0 0 1px rgba(17, 24, 39, 0.5);
                }
            `}</style>
        </div>
    );
};

export default RegisterPage;