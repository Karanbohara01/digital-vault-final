


// import React, { useState, useEffect, useContext } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';

// const ProductDetailPage = () => {
//     const { productId } = useParams();
//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [isPurchasing, setIsPurchasing] = useState(false);

//     const { isAuthenticated, user, token } = useContext(AuthContext);

//     const getPlaceholderImage = () => {
//         const categories = ['photography', 'art', 'digital', 'nature', 'abstract'];
//         const randomCategory = categories[Math.floor(Math.random() * categories.length)];
//         return `https://source.unsplash.com/random/800x600/?${randomCategory},${Math.random()}`;
//     };

//     useEffect(() => {
//         const fetchProduct = async () => {
//             try {
//                 const response = await fetch(`http://localhost:5001/api/products/${productId}`);
//                 if (!response.ok) throw new Error('Product not found!');
//                 const data = await response.json();
//                 setProduct(data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchProduct();
//     }, [productId]);

//     const handlePurchase = async () => {
//         if (!isAuthenticated) {
//             alert('Please log in to purchase an item.');
//             return;
//         }

//         setIsPurchasing(true);
//         setError(null);

//         try {
//             const response = await fetch('http://localhost:5001/api/orders/create-checkout-session', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({ productId: product._id }),
//             });

//             const session = await response.json();
//             if (!response.ok) throw new Error(session.message || 'Could not initiate payment.');
//             window.location.href = session.url;
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setIsPurchasing(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div style={styles.loadingContainer}>
//                 <div style={styles.spinner}></div>
//                 <p style={styles.loadingText}>Loading image details...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div style={styles.errorContainer}>
//                 <div style={styles.errorCard}>
//                     <h2 style={styles.errorHeading}>Error</h2>
//                     <p style={styles.errorMessage}>{error}</p>
//                     <Link to="/" style={styles.backButton}>
//                         ← Return to Gallery
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     if (!product) {
//         return (
//             <div style={styles.errorContainer}>
//                 <div style={styles.errorCard}>
//                     <h2 style={styles.errorHeading}>Image Not Available</h2>
//                     <p style={styles.errorMessage}>This artwork may have been removed from our collection.</p>
//                     <Link to="/" style={styles.backButton}>
//                         ← Explore More Artwork
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div style={styles.container}>
//             <div style={styles.contentWrapper}>
//                 <div style={styles.imageSection}>
//                     <div style={styles.imageContainer}>
//                         <img
//                             src={`http://localhost:5001/${product.filePath}`}
//                             alt={product.name}
//                             style={styles.image}
//                             onError={(e) => {
//                                 e.target.onerror = null;
//                                 e.target.src = getPlaceholderImage();
//                             }}
//                         />
//                     </div>
//                 </div>

//                 <div style={styles.detailsSection}>
//                     <div style={styles.detailsContent}>
//                         <div style={styles.metaContainer}>
//                             <span style={styles.categoryBadge}>{product.category || 'Digital Art'}</span>
//                             <span style={styles.resolutionBadge}>High Resolution</span>
//                         </div>

//                         <h1 style={styles.title}>{product.name}</h1>

//                         <div style={styles.priceContainer}>
//                             <span style={styles.price}>${product.price.toFixed(2)}</span>
//                             <span style={styles.priceNote}>License Included</span>
//                         </div>

//                         <div style={styles.descriptionContainer}>
//                             <h3 style={styles.descriptionTitle}>About This Image</h3>
//                             <p style={styles.description}>
//                                 {product.description || 'A beautiful digital creation from our collection.'}
//                             </p>
//                         </div>

//                         {error && (
//                             <div style={styles.errorMessageBox}>
//                                 <svg style={styles.errorIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                     <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//                                 </svg>
//                                 <span>{error}</span>
//                             </div>
//                         )}

//                         <div style={styles.actionButtons}>
//                             {isAuthenticated && user.role === 'customer' ? (
//                                 <button
//                                     onClick={handlePurchase}
//                                     disabled={isPurchasing}
//                                     style={{
//                                         ...styles.primaryButton,
//                                         ...(isPurchasing && styles.primaryButtonDisabled)
//                                     }}
//                                 >
//                                     {isPurchasing ? (
//                                         <>
//                                             <svg style={styles.spinnerIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                                 <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.0784 19.0784L16.25 16.25M19.0784 4.99994L16.25 7.82837M4.92157 19.0784L7.75 16.25M4.92157 4.99994L7.75 7.82837" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//                                             </svg>
//                                             Processing...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <svg style={styles.cartIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                                 <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.70711 15.2929C4.07714 15.9229 4.52331 17 5.41421 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM9 19C9 20.1046 8.10457 21 7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                                             </svg>
//                                             Purchase License
//                                         </>
//                                     )}
//                                 </button>
//                             ) : (
//                                 !isAuthenticated && (
//                                     <Link to="/login" style={styles.primaryButton}>
//                                         <svg style={styles.loginIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                             <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" />
//                                             <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" />
//                                         </svg>
//                                         Login to Purchase
//                                     </Link>
//                                 )
//                             )}

//                             <Link to="/marketplace" style={styles.secondaryButton}>
//                                 <svg style={styles.arrowIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                     <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                                 </svg>
//                                 Continue Browsing
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const styles = {
//     container: {
//         maxWidth: '1400px',
//         margin: '0 auto',
//         padding: '2rem 1.5rem',
//         fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//         backgroundColor: '#f8fafc',
//         minHeight: '100vh',
//     },
//     contentWrapper: {
//         display: 'flex',
//         flexDirection: ['column', 'row'],
//         gap: '3rem',
//         backgroundColor: '#ffffff',
//         borderRadius: '16px',
//         boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
//         overflow: 'hidden',
//     },
//     imageSection: {
//         flex: '1 1 60%',
//         minHeight: '500px',
//         position: 'relative',
//     },
//     imageContainer: {
//         width: '100%',
//         height: '100%',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#f1f5f9',
//     },
//     image: {
//         width: '100%',
//         height: 'auto',
//         maxHeight: '80vh',
//         objectFit: 'contain',
//         display: 'block',
//     },
//     detailsSection: {
//         flex: '1 1 40%',
//         padding: '3rem 2rem',
//         display: 'flex',
//         flexDirection: 'column',
//     },
//     detailsContent: {
//         display: 'flex',
//         flexDirection: 'column',
//         height: '100%',
//     },
//     metaContainer: {
//         display: 'flex',
//         gap: '0.75rem',
//         marginBottom: '1.5rem',
//     },
//     categoryBadge: {
//         backgroundColor: '#e0f2fe',
//         color: '#0369a1',
//         padding: '0.5rem 1rem',
//         borderRadius: '20px',
//         fontSize: '0.85rem',
//         fontWeight: '600',
//         textTransform: 'capitalize',
//     },
//     resolutionBadge: {
//         backgroundColor: '#ecfdf5',
//         color: '#059669',
//         padding: '0.5rem 1rem',
//         borderRadius: '20px',
//         fontSize: '0.85rem',
//         fontWeight: '600',
//     },
//     title: {
//         fontSize: '2.25rem',
//         fontWeight: '800',
//         color: '#0f172a',
//         marginBottom: '1.5rem',
//         lineHeight: '1.2',
//     },
//     priceContainer: {
//         display: 'flex',
//         alignItems: 'baseline',
//         gap: '1rem',
//         marginBottom: '2rem',
//     },
//     price: {
//         fontSize: '2rem',
//         fontWeight: '800',
//         color: '#3b82f6',
//     },
//     priceNote: {
//         fontSize: '1rem',
//         color: '#64748b',
//         fontWeight: '500',
//     },
//     descriptionContainer: {
//         marginBottom: '2.5rem',
//     },
//     descriptionTitle: {
//         fontSize: '1.1rem',
//         fontWeight: '700',
//         color: '#0f172a',
//         marginBottom: '0.75rem',
//     },
//     description: {
//         fontSize: '1rem',
//         color: '#64748b',
//         lineHeight: '1.7',
//     },
//     actionButtons: {
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '1rem',
//         marginTop: 'auto',
//     },
//     primaryButton: {
//         display: 'inline-flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: '0.75rem',
//         padding: '1rem 1.5rem',
//         backgroundColor: '#3b82f6',
//         color: '#ffffff',
//         border: 'none',
//         borderRadius: '10px',
//         fontSize: '1rem',
//         fontWeight: '600',
//         cursor: 'pointer',
//         transition: 'all 0.2s ease',
//         textDecoration: 'none',
//         boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)',
//         ':hover': {
//             backgroundColor: '#2563eb',
//             transform: 'translateY(-2px)',
//             boxShadow: '0 6px 12px rgba(59, 130, 246, 0.3)',
//         },
//     },
//     primaryButtonDisabled: {
//         backgroundColor: '#94a3b8',
//         cursor: 'not-allowed',
//         transform: 'none',
//         boxShadow: 'none',
//         ':hover': {
//             backgroundColor: '#94a3b8',
//             transform: 'none',
//             boxShadow: 'none',
//         },
//     },
//     secondaryButton: {
//         display: 'inline-flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: '0.75rem',
//         padding: '1rem 1.5rem',
//         backgroundColor: 'transparent',
//         color: '#3b82f6',
//         border: '2px solid #3b82f6',
//         borderRadius: '10px',
//         fontSize: '1rem',
//         fontWeight: '600',
//         cursor: 'pointer',
//         transition: 'all 0.2s ease',
//         textDecoration: 'none',
//         ':hover': {
//             backgroundColor: '#f8fafc',
//             transform: 'translateY(-2px)',
//         },
//     },
//     errorMessageBox: {
//         display: 'flex',
//         alignItems: 'center',
//         gap: '0.75rem',
//         padding: '1rem',
//         backgroundColor: '#fee2e2',
//         color: '#b91c1c',
//         borderRadius: '8px',
//         marginBottom: '1.5rem',
//         fontSize: '0.95rem',
//         fontWeight: '500',
//     },
//     errorIcon: {
//         width: '20px',
//         height: '20px',
//         color: '#b91c1c',
//     },
//     cartIcon: {
//         width: '20px',
//         height: '20px',
//     },
//     loginIcon: {
//         width: '20px',
//         height: '20px',
//     },
//     arrowIcon: {
//         width: '20px',
//         height: '20px',
//     },
//     spinnerIcon: {
//         width: '20px',
//         height: '20px',
//         animation: 'spin 1s linear infinite',
//     },
//     loadingContainer: {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: '60vh',
//     },
//     spinner: {
//         width: '50px',
//         height: '50px',
//         border: '4px solid rgba(59, 130, 246, 0.1)',
//         borderTop: '4px solid #3b82f6',
//         borderRadius: '50%',
//         animation: 'spin 1s linear infinite',
//         marginBottom: '1.5rem',
//     },
//     loadingText: {
//         fontSize: '1rem',
//         color: '#64748b',
//         fontWeight: '500',
//     },
//     errorContainer: {
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: '80vh',
//         padding: '2rem',
//     },
//     errorCard: {
//         backgroundColor: '#ffffff',
//         borderRadius: '16px',
//         padding: '3rem',
//         boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
//         textAlign: 'center',
//         maxWidth: '500px',
//     },
//     errorHeading: {
//         fontSize: '1.75rem',
//         fontWeight: '700',
//         color: '#0f172a',
//         marginBottom: '1rem',
//     },
//     errorMessage: {
//         fontSize: '1rem',
//         color: '#64748b',
//         marginBottom: '2rem',
//         lineHeight: '1.6',
//     },
//     backButton: {
//         display: 'inline-flex',
//         alignItems: 'center',
//         gap: '0.5rem',
//         padding: '0.75rem 1.5rem',
//         backgroundColor: '#3b82f6',
//         color: '#ffffff',
//         borderRadius: '8px',
//         textDecoration: 'none',
//         fontSize: '0.95rem',
//         fontWeight: '600',
//         transition: 'all 0.2s ease',
//         ':hover': {
//             backgroundColor: '#2563eb',
//             transform: 'translateY(-2px)',
//         },
//     },
// };

// export default ProductDetailPage;


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
