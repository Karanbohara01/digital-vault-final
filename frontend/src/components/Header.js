

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiCamera } from 'react-icons/fi'; // Feather camera icon
import Logo from './Logo'; // Assuming you have a Logo component


const Header = () => {
    const { isAuthenticated, logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const styles = {
        header: {
            backgroundColor: '#ffffff',
            padding: '16px 24px',
            color: '#111111',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e5e5e5',
            position: 'sticky',
            top: 0,
            zIndex: 999,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
        },
        logo: {
            fontSize: '22px',
            fontWeight: '700',
            color: '#111111',
            textDecoration: 'none',
            letterSpacing: '-0.5px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        nav: {
            display: 'flex',
            gap: '32px',
            alignItems: 'center',
        },
        link: {
            color: '#767676',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: '500',
            transition: 'color 0.2s ease',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            position: 'relative',
        },
        linkHover: {
            color: '#111111',
        },
        button: {
            backgroundColor: '#111111',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '14px',
            transition: 'all 0.2s ease',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
        buttonHover: {
            backgroundColor: '#000000',
            transform: 'translateY(-1px)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        },
        profile: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'transparent',
            padding: '6px 12px',
            borderRadius: '24px',
            color: '#111111',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            border: '1px solid #e5e5e5',
            transition: 'all 0.2s ease',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        profileHover: {
            backgroundColor: '#f5f5f5',
            borderColor: '#d4d4d4',
        },
        avatar: {
            backgroundColor: '#111111',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: '600',
            color: '#ffffff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        homeLink: {
            color: '#767676',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: '500',
            transition: 'color 0.2s ease',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            position: 'relative',
        },
    };

    const getInitial = () => {
        if (user?.name) return user.name.charAt(0).toUpperCase();
        return 'U';
    };

    // Inline responsive CSS
    const responsiveStyle = `
@media (max-width: 768px) {
    .header-nav {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
        padding-top: 1rem;
    }
    .header-wrapper {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
    .header-nav a,
    .header-nav button {
        font-size: 14px !important;
    }
}
`;


    return (
        <header style={styles.header} className="header-wrapper">
            {/* Responsive CSS injection */}
            <style>{`
            @media (max-width: 768px) {
                .header-wrapper {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 1rem;
                    padding: 16px;
                }

                .header-nav {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 0.75rem;
                }

                .header-nav a,
                .header-nav button {
                    font-size: 14px !important;
                    width: 100%;
                }
            }
        `}</style>

            <Link
                to="/"
                style={styles.logo}
                onMouseEnter={(e) => e.target.style.color = '#000000'}
                onMouseLeave={(e) => e.target.style.color = '#111111'}
            >
                <Logo />
            </Link>

            <nav style={styles.nav} className="header-nav">
                <Link
                    to="/"
                    style={styles.homeLink}
                    onMouseEnter={(e) => e.target.style.color = '#111111'}
                    onMouseLeave={(e) => e.target.style.color = '#767676'}
                >
                    Home
                </Link>

                {isAuthenticated ? (
                    <>
                        <Link
                            to="/dashboard"
                            style={styles.profile}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#f5f5f5';
                                e.target.style.borderColor = '#d4d4d4';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.borderColor = '#e5e5e5';
                            }}
                        >
                            <div style={styles.avatar}>{getInitial()}</div>
                            <span>{user?.name || 'Profile'}</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            style={styles.button}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#000000';
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#111111';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            style={styles.link}
                            onMouseEnter={(e) => e.target.style.color = '#111111'}
                            onMouseLeave={(e) => e.target.style.color = '#767676'}
                        >
                            Log in
                        </Link>
                        <Link
                            to="/register"
                            style={{
                                ...styles.button,
                                textDecoration: 'none',
                                display: 'inline-block',
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#000000';
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#111111';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            Join free
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
};
export default Header;
