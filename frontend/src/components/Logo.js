import { FiCamera, FiAperture } from 'react-icons/fi';
import { useState } from 'react';

const Logo = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span
                style={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '44px',
                    height: '44px',
                    marginRight: '14px',
                    background: 'linear-gradient(135deg, #111, #333)',
                    borderRadius: '10px',
                    transform: isHovered ? 'rotate(-8deg)' : 'none',
                    boxShadow: isHovered
                        ? '0 6px 20px rgba(0, 0, 0, 0.3)'
                        : '0 4px 12px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                }}
            >
                <FiCamera
                    color="#fff"
                    size={22}
                    style={{
                        transform: isHovered ? 'scale(1.1)' : 'none',
                        transition: 'transform 0.3s ease',
                    }}
                />
                <FiAperture
                    color="rgba(255,255,255,0.6)"
                    size={16}
                    style={{
                        position: 'absolute',
                        bottom: -6,
                        right: -6,
                        transform: isHovered ? 'scale(1.2) rotate(15deg)' : 'none',
                        transition: 'transform 0.3s ease',
                    }}
                />
            </span>
            <span style={{
                position: 'relative',
                fontWeight: '700',
                fontSize: '2rem',
                background: 'linear-gradient(to right, #111, #444)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-0.5px',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                textTransform: 'uppercase'
            }}>
                <span style={{
                    display: 'inline-block',
                    transform: isHovered ? 'translateY(-2px)' : 'none',
                    transition: 'transform 0.3s ease'
                }}>
                    Digital
                </span>
                <span style={{
                    display: 'inline-block',
                    marginLeft: '8px',
                    fontWeight: '900',
                    color: '#000',
                    WebkitTextStroke: '1px #fff',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    transform: isHovered ? 'translateY(-2px) scale(1.05)' : 'none',
                    transition: 'transform 0.3s ease'
                }}>
                    VAULT
                </span>
                <span
                    style={{
                        position: 'absolute',
                        bottom: 2,
                        left: 0,
                        width: isHovered ? '100%' : '0%',
                        height: '2px',
                        background: 'linear-gradient(90deg, #333, #666)',
                        transition: 'width 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    }}
                />
            </span>
        </div>
    );
};

export default Logo;