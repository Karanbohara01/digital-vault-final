// Carousel.js
import { useState, useEffect } from 'react';
import '../pages/Carousel.css';

const Carousel = () => {
    const stats = [
        { number: "2M+", label: "Photos Available" },
        { number: "50K+", label: "Artists" },
        { number: "1M+", label: "Downloads" },
        { number: "150+", label: "Countries" }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Use Unsplash
    const getImage = (index, width = 1200, height = 400) =>
        `https://source.unsplash.com/collection/190727/${width}x${height}?sig=${index}`;

    useEffect(() => {
        let interval;
        if (isAutoPlaying) {
            interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % stats.length);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isAutoPlaying, stats.length]);

    const goToPrev = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? stats.length - 1 : prev - 1
        );
        setIsAutoPlaying(false);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % stats.length);
        setIsAutoPlaying(false);
    };

    return (
        <section className="carousel-section">
            <div className="carousel-container">
                <div
                    className="carousel-track"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="carousel-slide"
                            onMouseEnter={() => setIsAutoPlaying(false)}
                            onMouseLeave={() => setIsAutoPlaying(true)}
                        >
                            <img
                                src={getImage(index)}
                                alt="Slide"
                                className="slide-img"
                            />
                            <div className="slide-overlay" />
                            <div className="stat-content">
                                <span className="stat-number">{stat.number}</span>
                                <span className="stat-label">{stat.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button className="carousel-button prev" onClick={goToPrev}>&lt;</button>
            <button className="carousel-button next" onClick={goToNext}>&gt;</button>
            <div className="carousel-indicators">
                {stats.map((_, index) => (
                    <button
                        key={index}
                        className={`indicator ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => {
                            setCurrentIndex(index);
                            setIsAutoPlaying(false);
                        }}
                    />
                ))}
            </div>
        </section>
    );
};

export default Carousel;
