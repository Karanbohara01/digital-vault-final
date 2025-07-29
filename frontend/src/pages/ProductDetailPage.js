


import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProductDetailPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPurchasing, setIsPurchasing] = useState(false);

    const { isAuthenticated, user, token } = useContext(AuthContext);

    const getPlaceholderImage = () => {
        const categories = ['photography', 'art', 'digital', 'nature', 'abstract'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        return `https://source.unsplash.com/random/800x600/?${randomCategory},${Math.random()}`;
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/products/${productId}`);
                if (!response.ok) throw new Error('Product not found!');
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const handlePurchase = async () => {
        if (!isAuthenticated) {
            alert('Please log in to purchase an item.');
            return;
        }

        setIsPurchasing(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5001/api/orders/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ productId: product._id }),
            });

            const session = await response.json();
            if (!response.ok) throw new Error(session.message || 'Could not initiate payment.');
            window.location.href = session.url;
        } catch (err) {
            setError(err.message);
        } finally {
            setIsPurchasing(false);
        }
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorContent}>
                    <h2 style={styles.errorHeading}>Something went wrong</h2>
                    <p style={styles.errorMessage}>{error}</p>
                    <Link to="/" style={styles.backLink}>
                        Go back home
                    </Link>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorContent}>
                    <h2 style={styles.errorHeading}>Photo not found</h2>
                    <p style={styles.errorMessage}>This photo may have been removed or doesn't exist.</p>
                    <Link to="/" style={styles.backLink}>
                        Browse photos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Top Navigation */}
            <div style={styles.topNav}>
                <Link to="/marketplace" style={styles.backButton}>
                    <svg style={styles.backIcon} viewBox="0 0 24 24" fill="none">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Link>

                <div style={styles.actionBar}>
                    {isAuthenticated && user.role === 'customer' ? (
                        <button
                            onClick={handlePurchase}
                            disabled={isPurchasing}
                            style={{
                                ...styles.downloadButton,
                                ...(isPurchasing && styles.downloadButtonDisabled)
                            }}
                        >
                            {isPurchasing ? 'Processing...' : 'Download'}
                        </button>
                    ) : (
                        !isAuthenticated && (
                            <Link to="/login" style={styles.downloadButton}>
                                Download
                            </Link>
                        )
                    )}
                </div>
            </div>

            {/* Main Image */}
            <div style={styles.imageContainer}>
                <img
                    src={`http://localhost:5001/${product.filePath}`}
                    alt={product.name}
                    style={styles.mainImage}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getPlaceholderImage();
                    }}
                />
            </div>

            {/* Content Below Image */}
            <div style={styles.contentSection}>
                <div style={styles.contentWrapper}>
                    <div style={styles.leftContent}>
                        <div style={styles.titleSection}>
                            <h1 style={styles.title}>{product.name}</h1>
                            <p style={styles.description}>
                                {product.description || 'A beautiful image from our collection'}
                            </p>
                        </div>

                        <div style={styles.metaInfo}>
                            <div style={styles.metaItem}>
                                <span style={styles.metaLabel}>Category</span>
                                <span style={styles.metaValue}>{product.category || 'Photography'}</span>
                            </div>
                            <div style={styles.metaItem}>
                                <span style={styles.metaLabel}>License</span>
                                <span style={styles.metaValue}>Digital License</span>
                            </div>
                        </div>
                    </div>

                    <div style={styles.rightContent}>
                        <div style={styles.priceSection}>
                            <div style={styles.priceContainer}>
                                <span style={styles.priceLabel}>License</span>
                                <span style={styles.price}>${product.price.toFixed(2)}</span>
                            </div>

                            {error && (
                                <div style={styles.errorAlert}>
                                    <span style={styles.errorText}>{error}</span>
                                </div>
                            )}

                            <div style={styles.downloadSection}>
                                {isAuthenticated && user.role === 'customer' ? (
                                    <button
                                        onClick={handlePurchase}
                                        disabled={isPurchasing}
                                        style={{
                                            ...styles.primaryButton,
                                            ...(isPurchasing && styles.primaryButtonDisabled)
                                        }}
                                    >
                                        {isPurchasing ? (
                                            <>
                                                <div style={styles.spinnerSmall}></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <svg style={styles.downloadIcon} viewBox="0 0 24 24" fill="none">
                                                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Download
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    !isAuthenticated && (
                                        <Link to="/login" style={styles.primaryButton}>
                                            <svg style={styles.downloadIcon} viewBox="0 0 24 24" fill="none">
                                                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Download
                                        </Link>
                                    )
                                )}

                                <p style={styles.licenseNote}>
                                    Download includes commercial license
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    topNav: {
        position: 'sticky',
        top: '65px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e5e5e5',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
    },
    backButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '6px',
        backgroundColor: 'transparent',
        border: '1px solid #e5e5e5',
        color: '#767676',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
    },
    backIcon: {
        width: '20px',
        height: '20px',
    },
    actionBar: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    downloadButton: {
        backgroundColor: '#111111',
        color: '#ffffff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    downloadButtonDisabled: {
        backgroundColor: '#d4d4d4',
        cursor: 'not-allowed',
    },
    imageContainer: {
        maxWidth: '1320px',
        margin: '0 auto',
        padding: '0 24px',
    },
    mainImage: {
        width: '100%',
        maxHeight: '80vh',
        objectFit: 'contain',
        display: 'block',
        margin: '0 auto',
        borderRadius: '8px',
    },
    contentSection: {
        maxWidth: '1320px',
        margin: '0 auto',
        padding: '48px 24px 96px',
    },
    contentWrapper: {
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: '80px',
        alignItems: 'start',
    },
    leftContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
    },
    titleSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    title: {
        fontSize: '36px',
        fontWeight: '600',
        color: '#111111',
        margin: '0',
        lineHeight: '1.2',
    },
    description: {
        fontSize: '18px',
        color: '#767676',
        margin: '0',
        lineHeight: '1.5',
    },
    metaInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    metaItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '16px',
        borderBottom: '1px solid #f0f0f0',
    },
    metaLabel: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#767676',
    },
    metaValue: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#111111',
    },
    rightContent: {
        position: 'sticky',
        top: '140px',
    },
    priceSection: {
        backgroundColor: '#f8f8f8',
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    priceContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceLabel: {
        fontSize: '16px',
        fontWeight: '500',
        color: '#111111',
    },
    price: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#111111',
    },
    errorAlert: {
        backgroundColor: '#fee2e2',
        color: '#b91c1c',
        padding: '12px',
        borderRadius: '6px',
        fontSize: '14px',
    },
    errorText: {
        fontSize: '14px',
        fontWeight: '500',
    },
    downloadSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    primaryButton: {
        backgroundColor: '#111111',
        color: '#ffffff',
        border: 'none',
        padding: '12px 20px',
        borderRadius: '6px',
        fontSize: '15px',
        fontWeight: '500',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: '100%',
    },
    primaryButtonDisabled: {
        backgroundColor: '#d4d4d4',
        cursor: 'not-allowed',
    },
    downloadIcon: {
        width: '16px',
        height: '16px',
    },
    licenseNote: {
        fontSize: '13px',
        color: '#767676',
        margin: '0',
        textAlign: 'center',
    },
    spinnerSmall: {
        width: '16px',
        height: '16px',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        borderTop: '2px solid #ffffff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#ffffff',
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '2px solid #f0f0f0',
        borderTop: '2px solid #111111',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '16px',
    },
    loadingText: {
        fontSize: '15px',
        color: '#767676',
        fontWeight: '500',
    },
    errorContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#ffffff',
        padding: '24px',
    },
    errorContent: {
        textAlign: 'center',
        maxWidth: '400px',
    },
    errorHeading: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#111111',
        marginBottom: '8px',
    },
    errorMessage: {
        fontSize: '16px',
        color: '#767676',
        marginBottom: '24px',
        lineHeight: '1.5',
    },
    backLink: {
        display: 'inline-block',
        backgroundColor: '#111111',
        color: '#ffffff',
        padding: '10px 20px',
        borderRadius: '6px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s ease',
    },
    // Add CSS animations
    '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
    },
};

// Add the CSS animation to the document
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

export default ProductDetailPage;
