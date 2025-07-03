

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // Assuming you have a CSS file for styling

const LandingPage = () => {
    const [featuredImages, setFeaturedImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [heroImages, setHeroImages] = useState([]);
    const carouselRef = useRef(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Featured images for grid
                const mockImages = Array(12).fill().map((_, i) => ({
                    _id: `mock-${i}`,
                    name: `${['Sunset Valley', 'Urban Night', 'Forest Path', 'Ocean Waves', 'Mountain Peak', 'City Lights', 'Desert Dunes', 'Misty Lake', 'Autumn Trees', 'Snowy Hills', 'Tropical Beach', 'Starry Sky'][i]}`,
                    price: (12.99 + i * 3).toFixed(2),
                    category: ['Nature', 'Urban', 'Abstract', 'Landscape', 'Architecture', 'Travel', 'Wildlife', 'Portrait', 'Street', 'Macro', 'Aerial', 'Minimal'][i],
                    filePath: `placeholder-${i}.jpg`,
                    photographer: ['Alex Rivera', 'Sarah Chen', 'Marcus Johnson', 'Elena Kowalski', 'David Park', 'Maya Patel', 'Jordan Smith', 'Luna Martinez', 'Kai Thompson', 'Zoe Williams', 'Ryan Foster', 'Aria Singh'][i]
                }));
                setFeaturedImages(mockImages);

                // Hero carousel images
                const heroImageData = Array(5).fill().map((_, i) => ({
                    id: i,
                    url: `https://picsum.photos/1920/1080?random=${i + 100}`,
                    title: ['Capture the Extraordinary', 'Visual Stories Await', 'Discover Amazing Photography', 'Premium Quality Images', 'Creative Excellence'][i],
                    subtitle: ['Professional photography marketplace', 'Sell & buy stunning visuals', 'Curated by expert photographers', 'High-resolution downloads', 'Join the creative community'][i]
                }));
                setHeroImages(heroImageData);
            } catch (error) {
                console.error('Failed to fetch images:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    // Auto-advance hero carousel
    useEffect(() => {
        if (heroImages.length > 0) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % heroImages.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [heroImages.length]);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail('');
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };

    const getPlaceholderImage = (index, width = 600, height = 400) => {
        return `https://picsum.photos/${width}/${height}?random=${index}`;
    };

    const scrollCarousel = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = 320;
            carouselRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="container">
            <style jsx>{`
                .container {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                    color: #111;
                    line-height: 1.6;
                    overflow-x: hidden;
                }

                /* Hero Carousel Section */
                .hero-carousel {
                    position: relative;
                    height: 100vh;
                    min-height: 600px;
                    overflow: hidden;
                }

                .carousel-slide {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-size: cover;
                    background-position: center;
                    opacity: 0;
                    transition: opacity 1.5s ease-in-out;
                }

                .carousel-slide.active {
                    opacity: 1;
                }

                .carousel-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2;
                }

                .carousel-content {
                    text-align: center;
                    color: white;
                    max-width: 800px;
                    padding: 0 2rem;
                    animation: slideUp 1s ease-out;
                }

                .carousel-title {
                    font-size: 4rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                    letter-spacing: -0.02em;
                    text-shadow: 0 4px 20px rgba(0,0,0,0.3);
                }

                .carousel-subtitle {
                    font-size: 1.5rem;
                    margin-bottom: 2rem;
                    opacity: 0.9;
                    font-weight: 300;
                }

                .carousel-nav {
                    position: absolute;
                    bottom: 2rem;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    gap: 0.5rem;
                    z-index: 3;
                }

                .nav-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.5);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .nav-dot.active {
                    background: white;
                    transform: scale(1.2);
                }

                /* Navigation */
                .navbar {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 10;
                    padding: 1.5rem 2rem;
                    background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%);
                }

                .nav-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .logo {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: white;
                    text-decoration: none;
                }

                .nav-buttons {
                    display: flex;
                    gap: 1rem;
                }

                .nav-btn {
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .nav-btn.primary {
                    background: rgba(255,255,255,0.2);
                    color: white;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.3);
                }

                .nav-btn.primary:hover {
                    background: rgba(255,255,255,0.3);
                    transform: translateY(-2px);
                }

                /* Featured Section */
                .featured-section {
                    padding: 6rem 2rem 4rem;
                    background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
                }

                .section-header {
                    text-align: center;
                    margin-bottom: 3rem;
                    max-width: 600px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .section-title {
                    font-size: 2.5rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .section-subtitle {
                    font-size: 1.1rem;
                    color: #666;
                    margin-bottom: 2rem;
                }

                /* Image Grid */
                .masonry-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .image-card {
                    position: relative;
                    border-radius: 12px;
                    overflow: hidden;
                    background: white;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    cursor: pointer;
                }

                .image-card:nth-child(odd) {
                    transform: translateY(20px);
                }

                .image-card:hover {
                    transform: translateY(-10px) scale(1.02);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                }

                .image-wrapper {
                    position: relative;
                    overflow: hidden;
                }

                .card-image {
                    width: 100%;
                    height: 250px;
                    object-fit: cover;
                    transition: transform 0.6s ease;
                }

                .image-card:hover .card-image {
                    transform: scale(1.1);
                }

                .image-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .image-card:hover .image-overlay {
                    opacity: 1;
                }

                /* Image Info */
                .image-info {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 1.5rem;
                    color: white;
                    transform: translateY(100%);
                    transition: transform 0.3s ease;
                }

                .image-card:hover .image-info {
                    transform: translateY(0);
                }

                .image-title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }

                .image-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.9rem;
                    opacity: 0.9;
                }

                .photographer {
                    font-weight: 500;
                }

                .price {
                    background: rgba(255,255,255,0.2);
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    backdrop-filter: blur(10px);
                    font-weight: 600;
                }

                /* Category Filter */
                .category-filters {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-bottom: 3rem;
                    flex-wrap: wrap;
                }

                .filter-btn {
                    padding: 0.75rem 1.5rem;
                    background: white;
                    border: 2px solid #e9ecef;
                    border-radius: 25px;
                    color: #666;
                    text-decoration: none;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }

                .filter-btn:hover,
                .filter-btn.active {
                    background: #667eea;
                    color: white;
                    border-color: #667eea;
                    transform: translateY(-2px);
                }

                /* Trending Carousel */
                .trending-section {
                    padding: 6rem 2rem;
                    background: white;
                }

                .carousel-container {
                    position: relative;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .trending-carousel {
                    display: flex;
                    gap: 1.5rem;
                    overflow-x: auto;
                    scroll-behavior: smooth;
                    padding: 1rem 0;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }

                .trending-carousel::-webkit-scrollbar {
                    display: none;
                }

                .trending-card {
                    flex: 0 0 300px;
                    position: relative;
                    border-radius: 16px;
                    overflow: hidden;
                    height: 400px;
                    cursor: pointer;
                    transition: all 0.4s ease;
                }

                .trending-card:hover {
                    transform: scale(1.05);
                }

                .trending-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .trending-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(transparent, rgba(0,0,0,0.8));
                    padding: 2rem 1.5rem 1.5rem;
                    color: white;
                }

                .carousel-controls {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 50px;
                    height: 50px;
                    background: rgba(255,255,255,0.9);
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    color: #333;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    transition: all 0.3s ease;
                    z-index: 2;
                }

                .carousel-controls:hover {
                    background: white;
                    transform: translateY(-50%) scale(1.1);
                }

                .carousel-controls.prev {
                    left: -25px;
                }

                .carousel-controls.next {
                    right: -25px;
                }

                /* Stats Section */
                .stats-section {
                    padding: 4rem 2rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 2rem;
                    max-width: 1000px;
                    margin: 0 auto;
                    text-align: center;
                }

                .stat-item {
                    animation: countUp 2s ease-out;
                }

                .stat-number {
                    font-size: 3rem;
                    font-weight: 800;
                    margin-bottom: 0.5rem;
                    display: block;
                }

                .stat-label {
                    font-size: 1.1rem;
                    opacity: 0.9;
                }

                /* Newsletter */
                .newsletter-section {
                    padding: 4rem 2rem;
                    background: #f8f9fa;
                    text-align: center;
                }

                .newsletter-content {
                    max-width: 600px;
                    margin: 0 auto;
                }

                .newsletter-title {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                }

                .newsletter-form {
                    display: flex;
                    gap: 1rem;
                    margin-top: 2rem;
                    max-width: 400px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .newsletter-input {
                    flex: 1;
                    padding: 1rem;
                    border: 2px solid #e9ecef;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: border-color 0.3s ease;
                }

                .newsletter-input:focus {
                    outline: none;
                    border-color: #667eea;
                }

                .newsletter-btn {
                    padding: 1rem 2rem;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .newsletter-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
                }

                .success-message {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 1rem;
                    background: #d4edda;
                    color: #155724;
                    border-radius: 8px;
                    margin-top: 1rem;
                    animation: slideIn 0.5s ease;
                }

                /* Loading Animation */
                .loading-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .loading-card {
                    height: 300px;
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    border-radius: 12px;
                    animation: shimmer 2s infinite;
                }

                /* Animations */
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes shimmer {
                    0% {
                        background-position: -200% 0;
                    }
                    100% {
                        background-position: 200% 0;
                    }
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes countUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .carousel-title {
                        font-size: 2.5rem;
                    }
                    
                    .carousel-subtitle {
                        font-size: 1.2rem;
                    }
                    
                    .section-title {
                        font-size: 2rem;
                    }
                    
                    .masonry-grid {
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                        gap: 1rem;
                    }
                    
                    .trending-card {
                        flex: 0 0 250px;
                        height: 350px;
                    }
                    
                    .newsletter-form {
                        flex-direction: column;
                    }
                    
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    
                    .stat-number {
                        font-size: 2rem;
                    }
                }
            `}</style>

            {/* Navigation */}
            <nav className="navbar">
                <div className="nav-content">
                    <a href="/" className="logo">PhotoMarket</a>
                    <div className="nav-buttons">
                        <a href="/login" className="nav-btn primary">Sign In</a>
                    </div>
                </div>
            </nav>

            {/* Hero Carousel */}
            <section className="hero-carousel">
                {heroImages.map((image, index) => (
                    <div
                        key={image.id}
                        className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${image.url})` }}
                    >
                        <div className="carousel-overlay">
                            <div className="carousel-content">
                                <h1 className="carousel-title">{image.title}</h1>
                                <p className="carousel-subtitle">{image.subtitle}</p>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                    <Link to="/marketplace" className="nav-btn primary">Explore Photos</Link>
                                    <Link to="/sell" className="nav-btn primary">Start Selling</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="carousel-nav">
                    {heroImages.map((_, index) => (
                        <div
                            key={index}
                            className={`nav-dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            </section>

            {/* Featured Images */}
            <section className="featured-section">
                <div className="section-header">
                    <h2 className="section-title">Discover Amazing Photography</h2>
                    <p className="section-subtitle">
                        Explore thousands of high-quality images from talented photographers worldwide
                    </p>
                </div>

                <div className="category-filters">
                    {['All', 'Nature', 'Urban', 'Abstract', 'Landscape', 'Portrait', 'Street'].map((category, index) => (
                        <Link
                            key={category}
                            to={`/category/${category.toLowerCase()}`}
                            className={`filter-btn ${index === 0 ? 'active' : ''}`}
                        >
                            {category}
                        </Link>
                    ))}
                </div>

                {loading ? (
                    <div className="loading-grid">
                        {Array(8).fill().map((_, i) => (
                            <div key={i} className="loading-card" />
                        ))}
                    </div>
                ) : (
                    <div className="masonry-grid">
                        {featuredImages.slice(0, 8).map((image, index) => (
                            <div key={image._id} className="image-card">
                                <div className="image-wrapper">
                                    <img
                                        src={getPlaceholderImage(index, 400, 300)}
                                        alt={image.name}
                                        className="card-image"
                                    />
                                    <div className="image-overlay" />
                                    <div className="image-info">
                                        <h3 className="image-title">{image.name}</h3>
                                        <div className="image-meta">
                                            <span className="photographer">by {image.photographer}</span>
                                            <span className="price">${image.price}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Trending Carousel */}
            <section className="trending-section">
                <div className="section-header">
                    <h2 className="section-title">Trending This Week</h2>
                    <p className="section-subtitle">Most popular images from our community</p>
                </div>

                <div className="carousel-container">
                    <button className="carousel-controls prev" onClick={() => scrollCarousel('left')}>
                        ←
                    </button>
                    <div className="trending-carousel" ref={carouselRef}>
                        {featuredImages.map((image, index) => (
                            <div key={`trending-${image._id}`} className="trending-card">
                                <img
                                    src={getPlaceholderImage(index + 50, 300, 400)}
                                    alt={image.name}
                                    className="trending-image"
                                />
                                <div className="trending-overlay">
                                    <h3>{image.name}</h3>
                                    <p>{image.photographer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="carousel-controls next" onClick={() => scrollCarousel('right')}>
                        →
                    </button>
                </div>
            </section>
            <section className="stats-section">
                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="stat-number">200+</span>
                        <span className="stat-label">Photos Available</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">5+</span>
                        <span className="stat-label">Artists</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">100+</span>
                        <span className="stat-label">Daily Visits</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">10+</span>
                        <span className="stat-label">Countries</span>
                    </div>
                </div>
            </section>



            {/* Newsletter */}
            <section className="newsletter-section">
                <div className="newsletter-content">
                    <h3 className="newsletter-title">Stay Inspired</h3>
                    <p>Get weekly collections of the best photography delivered to your inbox</p>

                    {isSubscribed ? (
                        <div className="success-message">
                            <span>✓</span>
                            <span>Thanks for subscribing!</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubscribe} className="newsletter-form">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="newsletter-input"
                                required
                            />
                            <button type="submit" className="newsletter-btn">
                                Subscribe
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </div>
    );
};

export default LandingPage;