


import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaRocket, FaRegSmileBeam, FaStar, FaGift, FaHeart, FaTrophy } from 'react-icons/fa';

// Animation keyframes
const pulse = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

const float = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
`;

const lightning = `
  @keyframes lightning {
    0% { opacity: 0; transform: scale(0.5); }
    50% { opacity: 1; transform: scale(1.2); }
    100% { opacity: 0; transform: scale(0.5); }
  }
`;

const bounce = `
  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
    40%, 43% { transform: translate3d(0, -30px, 0); }
    70% { transform: translate3d(0, -15px, 0); }
    90% { transform: translate3d(0, -4px, 0); }
  }
`;

const sparkle = `
  @keyframes sparkle {
    0% { opacity: 0; transform: scale(0) rotate(0deg); }
    50% { opacity: 1; transform: scale(1) rotate(180deg); }
    100% { opacity: 0; transform: scale(0) rotate(360deg); }
  }
`;

const slideInUp = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const rainbow = `
  @keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
`;

const rotate = `
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const PaymentSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [showExtraEffects, setShowExtraEffects] = useState(false);
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        if (sessionId) {
            console.log('Payment successful for session:', sessionId);
        }

        // Create floating particles
        const newParticles = [];
        for (let i = 0; i < 20; i++) {
            newParticles.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                delay: Math.random() * 3,
                duration: 2 + Math.random() * 3,
                size: 0.5 + Math.random() * 1.5,
                type: Math.random() > 0.5 ? 'star' : 'heart'
            });
        }
        setParticles(newParticles);

        // Trigger extra effects after initial animation
        setTimeout(() => {
            setShowExtraEffects(true);
        }, 1000);
    }, [sessionId]);

    const CustomConfetti = () => {
        const confettiPieces = [];
        for (let i = 0; i < 50; i++) {
            confettiPieces.push(
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: '10px',
                        height: '10px',
                        backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'][Math.floor(Math.random() * 7)],
                        left: `${Math.random() * 100}%`,
                        top: '-10px',
                        borderRadius: Math.random() > 0.5 ? '50%' : '0',
                        animation: `confettiFall ${2 + Math.random() * 3}s linear infinite`,
                        animationDelay: `${Math.random() * 2}s`,
                        transform: `rotate(${Math.random() * 360}deg)`,
                        zIndex: 1000
                    }}
                />
            );
        }
        return confettiPieces;
    };

    return (
        <>
            <style jsx>{`
                ${pulse}
                ${float}
                ${lightning}
                ${bounce}
                ${sparkle}
                ${slideInUp}
                ${rainbow}
                ${rotate}
                
                @keyframes confettiFall {
                    to {
                        transform: translateY(100vh) rotate(720deg);
                    }
                }
                
                @keyframes firework {
                    0% { opacity: 1; transform: scale(0); }
                    50% { opacity: 1; transform: scale(1); }
                    100% { opacity: 0; transform: scale(1.2); }
                }
                
                .success-container {
                    text-align: center;
                    margin: 4rem auto;
                    max-width: 600px;
                    padding: 3rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 24px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    position: relative;
                    overflow: hidden;
                    animation: slideInUp 0.8s ease-out;
                }
                
                .success-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
                    animation: rainbow 3s linear infinite;
                    pointer-events: none;
                }
                
                .success-icon {
                    font-size: 6rem;
                    color: #4BB543;
                    margin-bottom: 1.5rem;
                    animation: bounce 2s infinite, pulse 2s infinite;
                    position: relative;
                    z-index: 2;
                    filter: drop-shadow(0 0 20px rgba(75, 181, 67, 0.5));
                }
                
                .lightning-container {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    pointer-events: none;
                    z-index: 1;
                }
                
                .lightning-bolt {
                    position: absolute;
                    font-size: 2rem;
                    animation: lightning 2s infinite;
                }
                
                .lightning-1 {
                    top: 20%;
                    left: 15%;
                    animation-delay: 0.5s;
                }
                
                .lightning-2 {
                    bottom: 20%;
                    right: 15%;
                    font-size: 3rem;
                    animation-delay: 1s;
                }
                
                .lightning-3 {
                    top: 40%;
                    right: 20%;
                    animation-delay: 1.5s;
                }
                
                .lightning-4 {
                    bottom: 40%;
                    left: 20%;
                    animation-delay: 2s;
                }
                
                .title {
                    font-size: 3rem;
                    color: white;
                    margin-bottom: 1rem;
                    position: relative;
                    z-index: 2;
                    text-shadow: 0 0 20px rgba(255,255,255,0.5);
                    animation: slideInUp 0.8s ease-out 0.3s both;
                }
                
                .message {
                    font-size: 1.3rem;
                    color: rgba(255,255,255,0.9);
                    margin-bottom: 1.5rem;
                    position: relative;
                    z-index: 2;
                    animation: slideInUp 0.8s ease-out 0.6s both;
                }
                
                .celebration-icon {
                    font-size: 2rem;
                    color: #e74c3c;
                    margin: 0 0.5rem;
                    animation: float 3s ease-in-out infinite, rotate 4s linear infinite;
                    animation-delay: 0.3s;
                    display: inline-block;
                }
                
                .smile-icon {
                    font-size: 1.5rem;
                    color: #f39c12;
                    margin-left: 0.5rem;
                    display: inline-block;
                    animation: pulse 2s infinite;
                }
                
                .dashboard-button {
                    display: inline-block;
                    padding: 16px 32px;
                    background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
                    color: white;
                    text-decoration: none;
                    border-radius: 50px;
                    font-weight: 700;
                    font-size: 1.1rem;
                    margin-top: 2rem;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    z-index: 2;
                    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
                    animation: slideInUp 0.8s ease-out 0.9s both;
                }
                
                .dashboard-button:hover {
                    transform: translateY(-5px) scale(1.05);
                    box-shadow: 0 12px 35px rgba(255, 107, 107, 0.6);
                    animation: pulse 0.6s infinite;
                }
                
                .floating-particles {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 1;
                }
                
                .particle {
                    position: absolute;
                    animation: float 3s ease-in-out infinite, sparkle 2s infinite;
                    opacity: 0.7;
                }
                
                .star-particle {
                    color: #ffd700;
                }
                
                .heart-particle {
                    color: #ff69b4;
                }
                
                .firework {
                    position: absolute;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    animation: firework 1.5s ease-out infinite;
                }
                
                .firework-1 {
                    top: 30%;
                    left: 80%;
                    background: #ff6b6b;
                    animation-delay: 0.5s;
                }
                
                .firework-2 {
                    top: 70%;
                    left: 20%;
                    background: #4ecdc4;
                    animation-delay: 1s;
                }
                
                .firework-3 {
                    top: 50%;
                    left: 10%;
                    background: #45b7d1;
                    animation-delay: 1.5s;
                }
                
                .firework-4 {
                    top: 20%;
                    left: 30%;
                    background: #f9ca24;
                    animation-delay: 2s;
                }
                
                .trophy-icon {
                    font-size: 2.5rem;
                    color: #ffd700;
                    margin: 0 0.5rem;
                    animation: bounce 2s infinite, sparkle 3s infinite;
                    display: inline-block;
                    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.7));
                }
                
                .gift-icon {
                    font-size: 2rem;
                    color: #ff69b4;
                    margin: 0 0.5rem;
                    animation: float 2s ease-in-out infinite, pulse 3s infinite;
                    display: inline-block;
                }
                
                .success-message {
                    background: rgba(255,255,255,0.1);
                    border-radius: 16px;
                    padding: 2rem;
                    margin: 2rem 0;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.2);
                    animation: slideInUp 0.8s ease-out 1.2s both;
                }
            `}</style>

            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 999 }}>
                <CustomConfetti />
            </div>

            <div className="success-container">
                <div className="lightning-container">
                    <div className="lightning-bolt lightning-1">⚡</div>
                    <div className="lightning-bolt lightning-2">⚡</div>
                    <div className="lightning-bolt lightning-3">⚡</div>
                    <div className="lightning-bolt lightning-4">⚡</div>
                </div>

                <div className="floating-particles">
                    {particles.map(particle => (
                        <div
                            key={particle.id}
                            className={`particle ${particle.type === 'star' ? 'star-particle' : 'heart-particle'}`}
                            style={{
                                left: `${particle.x}%`,
                                top: `${particle.y}%`,
                                animationDelay: `${particle.delay}s`,
                                animationDuration: `${particle.duration}s`,
                                fontSize: `${particle.size}rem`
                            }}
                        >
                            {particle.type === 'star' ? <FaStar /> : <FaHeart />}
                        </div>
                    ))}
                </div>

                {showExtraEffects && (
                    <>
                        <div className="firework firework-1"></div>
                        <div className="firework firework-2"></div>
                        <div className="firework firework-3"></div>
                        <div className="firework firework-4"></div>
                    </>
                )}

                <div className="success-icon">
                    <FaCheckCircle />
                </div>

                <h1 className="title">🎉 Payment Successful! 🎉</h1>

                <div className="success-message">
                    <p className="message">
                        <FaTrophy className="trophy-icon" />
                        Congratulations! Your payment has been processed successfully!
                        <FaGift className="gift-icon" />
                    </p>

                    <p className="message">
                        Thank you for your purchase! <FaRegSmileBeam className="smile-icon" />
                        Your order is now being prepared with extra care.
                    </p>

                    <p className="message">
                        You will receive a confirmation email shortly
                        <FaRocket className="celebration-icon" />
                        Get ready for an amazing experience!
                    </p>
                </div>

                <Link to="/dashboard" className="dashboard-button">
                    🚀 Go to Your Dashboard 🚀
                </Link>
            </div>
        </>
    );
};

export default PaymentSuccessPage;