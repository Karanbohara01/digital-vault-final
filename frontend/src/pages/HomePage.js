

// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// const HomePage = () => {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const response = await fetch('http://localhost:5001/api/products');
//                 const data = await response.json();
//                 setProducts(data);
//             } catch (error) {
//                 console.error('Failed to fetch products:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchProducts();
//     }, []);

//     const getPlaceholderImage = () => {
//         const categories = ['art', 'photography', 'abstract', 'nature', 'technology'];
//         const randomCategory = categories[Math.floor(Math.random() * categories.length)];
//         return `https://source.unsplash.com/random/300x200/?${randomCategory},${Math.random()}`;
//     };

//     return (
//         <div style={styles.container}>
//             <header style={styles.header}>
//                 <h1 style={styles.heading}>Visual Marketplace</h1>
//                 <p style={styles.subheading}>Discover and trade exceptional imagery from creators worldwide</p>
//             </header>

//             {loading ? (
//                 <div style={styles.loadingContainer}>
//                     <div style={styles.spinner}></div>
//                     <p style={styles.loadingText}>Curating visual collection...</p>
//                 </div>
//             ) : (
//                 <div style={styles.grid}>
//                     {products.map((product) => (
//                         <div key={product._id} style={styles.card}>
//                             <div style={styles.imageContainer}>
//                                 <img
//                                     src={`http://localhost:5001/${product.filePath}`}
//                                     alt={product.name}
//                                     style={styles.image}
//                                     onError={(e) => {
//                                         e.target.onerror = null;
//                                         e.target.src = getPlaceholderImage();
//                                     }}
//                                 />
//                                 <div style={styles.overlay}>
//                                     <Link to={`/products/${product._id}`} style={styles.quickView}>
//                                         Quick Preview
//                                     </Link>
//                                 </div>
//                             </div>
//                             <div style={styles.content}>
//                                 <div style={styles.badgeContainer}>
//                                     <span style={styles.resolutionBadge}>4K</span>
//                                     <span style={styles.typeBadge}>{product.category || 'Digital Art'}</span>
//                                 </div>
//                                 <h3 style={styles.title}>{product.name}</h3>
//                                 <p style={styles.description}>
//                                     {product.description.length > 80
//                                         ? `${product.description.substring(0, 80)}...`
//                                         : product.description}
//                                 </p>
//                                 <div style={styles.footer}>
//                                     <p style={styles.price}>${product.price.toFixed(2)}</p>
//                                     <Link to={`/products/${product._id}`} style={styles.detailsButton}>
//                                         <svg style={styles.icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                             <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//                                             <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//                                         </svg>
//                                         Details
//                                     </Link>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
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
//     header: {
//         textAlign: 'center',
//         marginBottom: '4rem',
//         padding: '0 1rem',
//     },
//     heading: {
//         fontSize: '2.75rem',
//         marginBottom: '1rem',
//         color: '#0f172a',
//         fontWeight: '800',
//         background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
//         WebkitBackgroundClip: 'text',
//         WebkitTextFillColor: 'transparent',
//         letterSpacing: '-0.025em',
//     },
//     subheading: {
//         fontSize: '1.25rem',
//         color: '#64748b',
//         maxWidth: '600px',
//         margin: '0 auto',
//         lineHeight: '1.6',
//     },
//     loadingContainer: {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: '50vh',
//     },
//     spinner: {
//         border: '4px solid rgba(59, 130, 246, 0.1)',
//         borderTop: '4px solid #3b82f6',
//         borderRadius: '50%',
//         width: '48px',
//         height: '48px',
//         animation: 'spin 1s linear infinite',
//         marginBottom: '1.5rem',
//     },
//     loadingText: {
//         textAlign: 'center',
//         fontSize: '1rem',
//         color: '#64748b',
//         fontWeight: '500',
//     },
//     grid: {
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
//         gap: '2rem',
//     },
//     card: {
//         borderRadius: '6px',
//         overflow: 'hidden',
//         backgroundColor: 'rgba(255, 255, 255, 0.8)',
//         backdropFilter: 'blur(10px)',

//         border: '1px solid rgba(26, 5, 5, 0.3)',
//         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//         ':hover': {
//             transform: 'translateY(-8px)',

//             borderColor: 'rgba(59, 130, 246, 0.2)',
//         },
//     },
//     imageContainer: {
//         position: 'relative',
//         width: '100%',
//         height: '220px',
//         overflow: 'hidden',
//     },
//     image: {
//         width: '100%',
//         height: '100%',
//         objectFit: 'cover',
//         transition: 'transform 0.5s ease',
//         ':hover': {
//             transform: 'scale(1.05)',
//         },
//     },
//     overlay: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
//         display: 'flex',
//         alignItems: 'flex-end',
//         justifyContent: 'center',
//         padding: '1.5rem',
//         opacity: 0,
//         transition: 'opacity 0.3s ease',
//         ':hover': {
//             opacity: 1,
//         },
//     },
//     quickView: {
//         padding: '0.75rem 1.5rem',
//         backgroundColor: 'rgba(255, 255, 255, 0.9)',
//         color: '#1e293b',
//         borderRadius: '8px',
//         textDecoration: 'none',
//         fontWeight: '600',
//         fontSize: '0.9rem',
//         transition: 'all 0.2s ease',

//         ':hover': {
//             backgroundColor: '#ffffff',
//             transform: 'translateY(-2px)',

//         },
//     },
//     content: {
//         padding: '1.5rem',
//     },
//     badgeContainer: {
//         display: 'flex',
//         gap: '0.5rem',
//         marginBottom: '0.75rem',
//     },
//     resolutionBadge: {
//         backgroundColor: '#e0f2fe',
//         color: '#0369a1',
//         padding: '0.25rem 0.5rem',
//         borderRadius: '4px',
//         fontSize: '0.75rem',
//         fontWeight: '600',
//     },
//     typeBadge: {
//         backgroundColor: '#ede9fe',
//         color: '#7c3aed',
//         padding: '0.25rem 0.5rem',
//         borderRadius: '4px',
//         fontSize: '0.75rem',
//         fontWeight: '600',
//         textTransform: 'capitalize',
//     },
//     title: {
//         fontSize: '1.25rem',
//         margin: '0 0 0.5rem',
//         color: '#0f172a',
//         fontWeight: '700',
//         lineHeight: '1.3',
//     },
//     description: {
//         fontSize: '0.95rem',
//         color: '#64748b',
//         marginBottom: '1.5rem',
//         lineHeight: '1.5',
//     },
//     footer: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     price: {
//         fontWeight: '800',
//         fontSize: '1.25rem',
//         color: '#3b82f6',
//         margin: 0,
//     },
//     detailsButton: {
//         display: 'inline-flex',
//         alignItems: 'center',
//         gap: '0.5rem',
//         padding: '0.6rem 1.25rem',
//         backgroundColor: '#3b82f6',
//         color: '#fff',
//         borderRadius: '8px',
//         textDecoration: 'none',
//         fontSize: '0.9rem',
//         transition: 'all 0.2s ease',
//         fontWeight: '600',

//         ':hover': {
//             backgroundColor: '#2563eb',
//             transform: 'translateY(-2px)',

//         },
//     },
//     icon: {
//         width: '16px',
//         height: '16px',
//     },
// };

// // Add the spin animation for the loading spinner
// const styleElement = document.createElement('style');
// styleElement.textContent = `
//     @keyframes spin {
//         0% { transform: rotate(0deg); }
//         100% { transform: rotate(360deg); }
//     }
// `;
// document.head.appendChild(styleElement);

// export default HomePage;

// import React, { useState, useEffect } from 'react';

// const HomePage = () => {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const response = await fetch('http://localhost:5001/api/products');
//                 const data = await response.json();
//                 setProducts(data);
//             } catch (error) {
//                 console.error('Failed to fetch products:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchProducts();
//     }, []);

//     const getPlaceholderImage = () => {
//         const categories = ['art', 'photography', 'abstract', 'nature', 'technology'];
//         const randomCategory = categories[Math.floor(Math.random() * categories.length)];
//         return `https://source.unsplash.com/random/300x200/?${randomCategory},${Math.random()}`;
//     };

//     return (
//         <div>
//             {/* Add global styles */}
//             <style>
//                 {`
//                     @keyframes spin {
//                         0% { transform: rotate(0deg); }
//                         100% { transform: rotate(360deg); }
//                     }

//                     @keyframes fadeIn {
//                         from { opacity: 0; transform: translateY(20px); }
//                         to { opacity: 1; transform: translateY(0); }
//                     }

//                     .card-hover:hover {
//                         transform: translateY(-2px) !important;
//                         box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
//                     }

//                     .image-hover:hover {
//                         transform: scale(1.02) !important;
//                     }

//                     .overlay-hover:hover {
//                         opacity: 1 !important;
//                     }

//                     // .button-hover:hover {
//                     //     background-color: #000 !important;
//                     //     transform: translateY(-1px) !important;
//                     // }

//                     .masonry-grid {
//                         columns: 3;
//                         column-gap: 20px;
//                         margin: 0 auto;
//                         max-width: 1200px;
//                     }

//                     @media (max-width: 1024px) {
//                         .masonry-grid {
//                             columns: 2;
//                         }
//                     }

//                     @media (max-width: 640px) {
//                         .masonry-grid {
//                             columns: 1;
//                         }
//                     }

//                     .masonry-item {
//                         break-inside: avoid;
//                         margin-bottom: 20px;
//                         page-break-inside: avoid;
//                     }
//                 `}
//             </style>

//             <div style={styles.container}>
//                 {/* Hero Section */}
//                 <div style={styles.hero}>
//                     <div style={styles.heroContent}>
//                         <h1 style={styles.heroTitle}>
//                             The internet's source of
//                             <br />
//                             <span style={styles.heroTitleAccent}>freely usable images.</span>
//                         </h1>
//                         <p style={styles.heroSubtitle}>
//                             Powered by creators everywhere.
//                         </p>

//                         {/* Search Bar */}
//                         <div style={styles.searchContainer}>
//                             <div style={styles.searchBox}>
//                                 <svg style={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                 </svg>
//                                 <input
//                                     type="text"
//                                     placeholder="Search for images"
//                                     style={styles.searchInput}
//                                 />
//                                 <button style={styles.searchButton}>
//                                     <svg style={styles.searchButtonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                     </svg>
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Trending searches */}
//                         <div style={styles.trendingContainer}>
//                             <span style={styles.trendingLabel}>Trending:</span>
//                             {['nature', 'business', 'texture', 'minimal', 'abstract'].map((term) => (
//                                 <button key={term} style={styles.trendingTag}>
//                                     {term}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 {loading ? (
//                     <div style={styles.loadingContainer}>
//                         <div style={styles.spinner}></div>
//                         <p style={styles.loadingText}>Loading beautiful images...</p>
//                     </div>
//                 ) : (
//                     <div style={styles.content}>
//                         {/* Masonry Grid */}
//                         <div className="masonry-grid">
//                             {products.map((product, index) => (
//                                 <div key={product._id} className="masonry-item">
//                                     <div
//                                         className="card-hover"
//                                         style={{
//                                             ...styles.imageCard,
//                                             animationDelay: `${index * 0.1}s`
//                                         }}
//                                     >
//                                         <div style={styles.imageWrapper}>
//                                             <img
//                                                 src={`http://localhost:5001/${product.filePath}`}
//                                                 alt={product.name}
//                                                 style={styles.image}
//                                                 className="image-hover"
//                                                 onError={(e) => {
//                                                     e.target.onerror = null;
//                                                     e.target.src = getPlaceholderImage();
//                                                 }}
//                                             />

//                                             {/* Overlay with hover effects */}
//                                             <div style={styles.overlay} className="overlay-hover">
//                                                 {/* Top overlay with download/like buttons */}
//                                                 <div style={styles.topOverlay}>
//                                                     <button style={styles.overlayButton}>
//                                                         <svg style={styles.overlayIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                                                         </svg>
//                                                     </button>
//                                                     <button style={styles.overlayButton}>
//                                                         <svg style={styles.overlayIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                                                         </svg>
//                                                     </button>
//                                                 </div>

//                                                 {/* Bottom overlay with user info and view button */}
//                                                 <div style={styles.bottomOverlay}>
//                                                     <div style={styles.userInfo}>
//                                                         <div style={styles.avatar}>
//                                                             <span style={styles.avatarText}>
//                                                                 {product.name?.charAt(0)?.toUpperCase() || 'U'}
//                                                             </span>
//                                                         </div>
//                                                         <span style={styles.userName}>Creator</span>
//                                                     </div>
//                                                     <a href={`/products/${product._id}`} style={styles.viewButton} className="button-hover">
//                                                         View
//                                                     </a>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* Card info */}
//                                         <div style={styles.cardInfo}>
//                                             <h3 style={styles.cardTitle}>{product.name}</h3>
//                                             <div style={styles.cardMeta}>
//                                                 <span style={styles.price}>${product.price.toFixed(2)}</span>
//                                                 <span style={styles.category}>{product.category}</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// const styles = {
//     container: {
//         fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
//         backgroundColor: '#ffffff',
//         minHeight: '100vh',
//     },
//     hero: {
//         backgroundColor: '#ffffff',
//         padding: '80px 20px 60px',
//         textAlign: 'center',
//         borderBottom: '1px solid #f1f1f1',
//     },
//     heroContent: {
//         maxWidth: '800px',
//         margin: '0 auto',
//     },
//     heroTitle: {
//         fontSize: '3.5rem',
//         fontWeight: '700',
//         color: '#111',
//         lineHeight: '1.1',
//         marginBottom: '20px',
//         letterSpacing: '-0.02em',
//     },
//     heroTitleAccent: {
//         color: '#767676',
//     },
//     heroSubtitle: {
//         fontSize: '1.125rem',
//         color: '#767676',
//         marginBottom: '40px',
//         fontWeight: '400',
//     },
//     searchContainer: {
//         marginBottom: '30px',
//     },
//     searchBox: {
//         position: 'relative',
//         maxWidth: '600px',
//         margin: '0 auto',
//         display: 'flex',
//         alignItems: 'center',
//         backgroundColor: '#f5f5f5',
//         borderRadius: '4px',
//         border: '1px solid #d1d1d1',
//         transition: 'border-color 0.2s ease',
//     },
//     searchIcon: {
//         width: '20px',
//         height: '20px',
//         color: '#767676',
//         marginLeft: '16px',
//         flexShrink: 0,
//     },
//     searchInput: {
//         flex: 1,
//         padding: '14px 16px',
//         border: 'none',
//         backgroundColor: 'transparent',
//         fontSize: '1rem',
//         color: '#111',
//         outline: 'none',
//     },
//     searchButton: {
//         padding: '12px',
//         backgroundColor: '#111',
//         border: 'none',
//         borderRadius: '0 3px 3px 0',
//         cursor: 'pointer',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         transition: 'background-color 0.2s ease',
//     },
//     searchButtonIcon: {
//         width: '20px',
//         height: '20px',
//         color: '#fff',
//     },
//     trendingContainer: {
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         flexWrap: 'wrap',
//         gap: '12px',
//     },
//     trendingLabel: {
//         fontSize: '0.875rem',
//         color: '#767676',
//         fontWeight: '500',
//     },
//     trendingTag: {
//         padding: '6px 12px',
//         backgroundColor: '#f5f5f5',
//         border: '1px solid #d1d1d1',
//         borderRadius: '20px',
//         fontSize: '0.875rem',
//         color: '#767676',
//         cursor: 'pointer',
//         transition: 'all 0.2s ease',
//         ':hover': {
//             backgroundColor: '#e8e8e8',
//             color: '#111',
//         },
//     },
//     content: {
//         padding: '40px 20px',
//     },
//     loadingContainer: {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: '50vh',
//         padding: '40px 20px',
//     },
//     spinner: {
//         border: '3px solid #f3f3f3',
//         borderTop: '3px solid #111',
//         borderRadius: '50%',
//         width: '40px',
//         height: '40px',
//         animation: 'spin 1s linear infinite',
//         marginBottom: '20px',
//     },
//     loadingText: {
//         fontSize: '1rem',
//         color: '#767676',
//         fontWeight: '400',
//     },
//     imageCard: {
//         backgroundColor: '#fff',
//         borderRadius: '6px',
//         overflow: 'hidden',
//         cursor: 'pointer',
//         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//         boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
//         animation: 'fadeIn 0.6s ease-out forwards',
//         opacity: 0,
//     },
//     imageWrapper: {
//         position: 'relative',
//         overflow: 'hidden',
//     },
//     image: {
//         width: '100%',
//         height: 'auto',
//         display: 'block',
//         transition: 'transform 0.3s ease',
//         verticalAlign: 'bottom',
//     },
//     overlay: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%)',
//         opacity: 0,
//         transition: 'opacity 0.3s ease',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'space-between',
//         padding: '16px',
//     },
//     topOverlay: {
//         display: 'flex',
//         justifyContent: 'flex-end',
//         gap: '8px',
//     },
//     bottomOverlay: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     overlayButton: {
//         width: '32px',
//         height: '32px',
//         backgroundColor: 'rgba(255, 255, 255, 0.9)',
//         border: 'none',
//         borderRadius: '4px',
//         cursor: 'pointer',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         transition: 'all 0.2s ease',
//         ':hover': {
//             backgroundColor: '#fff',
//             transform: 'scale(1.05)',
//         },
//     },
//     overlayIcon: {
//         width: '16px',
//         height: '16px',
//         color: '#111',
//     },
//     userInfo: {
//         display: 'flex',
//         alignItems: 'center',
//         gap: '8px',
//     },
//     avatar: {
//         width: '32px',
//         height: '32px',
//         backgroundColor: '#fff',
//         borderRadius: '50%',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     avatarText: {
//         fontSize: '0.875rem',
//         fontWeight: '600',
//         color: '#111',
//     },
//     userName: {
//         color: 'white',
//         fontSize: '0.875rem',
//         fontWeight: '500',
//     },
//     viewButton: {
//         padding: '8px 16px',
//         backgroundColor: 'rgba(255, 255, 255, 0.9)',
//         color: '#111',
//         textDecoration: 'none',
//         borderRadius: '4px',
//         fontSize: '0.875rem',
//         fontWeight: '500',
//         transition: 'all 0.2s ease',
//     },
//     cardInfo: {
//         padding: '12px 16px 16px',
//     },
//     cardTitle: {
//         fontSize: '0.875rem',
//         fontWeight: '500',
//         color: '#111',
//         margin: '0 0 8px 0',
//         lineHeight: '1.3',
//     },
//     cardMeta: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     price: {
//         fontSize: '0.875rem',
//         fontWeight: '600',
//         color: '#111',
//     },
//     category: {
//         fontSize: '0.75rem',
//         color: '#767676',
//         backgroundColor: '#f5f5f5',
//         padding: '2px 8px',
//         borderRadius: '12px',
//         textTransform: 'capitalize',
//     },
// };

// export default HomePage;

import React, { useState, useEffect, useMemo } from 'react';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
    const [categoryFilter, setCategoryFilter] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const getPlaceholderImage = () => {
        const categories = ['art', 'photography', 'abstract', 'nature', 'technology'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        return `https://source.unsplash.com/random/300x200/?${randomCategory},${Math.random()}`;
    };

    // Get unique categories from products
    const categories = useMemo(() => {
        return [...new Set(products.map(product => product.category))].filter(Boolean);
    }, [products]);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = products.filter(product => {
            // Search in name and description
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = !searchQuery ||
                product.name?.toLowerCase().includes(searchLower) ||
                product.description?.toLowerCase().includes(searchLower);

            // Price filter
            const minPrice = priceFilter.min ? parseFloat(priceFilter.min) : 0;
            const maxPrice = priceFilter.max ? parseFloat(priceFilter.max) : Infinity;
            const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

            // Category filter
            const matchesCategory = !categoryFilter || product.category === categoryFilter;

            return matchesSearch && matchesPrice && matchesCategory;
        });

        // Sort products
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'name':
                default:
                    return a.name?.localeCompare(b.name) || 0;
            }
        });

        return filtered;
    }, [products, searchQuery, priceFilter, categoryFilter, sortBy]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Search is handled automatically by the filteredProducts useMemo
    };

    const clearFilters = () => {
        setSearchQuery('');
        setPriceFilter({ min: '', max: '' });
        setCategoryFilter('');
        setSortBy('name');
    };

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (searchQuery) count++;
        if (priceFilter.min || priceFilter.max) count++;
        if (categoryFilter) count++;
        return count;
    }, [searchQuery, priceFilter, categoryFilter]);

    return (
        <div>
            {/* Add global styles */}
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    
                    @keyframes slideDown {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    
                    .card-hover:hover {
                        transform: translateY(-2px) !important;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
                    }
                    
                    .image-hover:hover {
                        transform: scale(1.02) !important;
                    }
                    
                    .overlay-hover:hover {
                        opacity: 1 !important;
                    }
                    
                    .button-hover:hover {
                        background-color: rgb(202, 19, 83) !important;
                        transform: translateY(-1px) !important;
                    }
                    
                    .filter-button:hover {
                        background-color: #f0f0f0 !important;
                    }
                    
                    .masonry-grid {
                        columns: 3;
                        column-gap: 20px;
                        margin: 0 auto;
                        max-width: 1200px;
                    }
                    
                    @media (max-width: 1024px) {
                        .masonry-grid {
                            columns: 2;
                        }
                    }
                    
                    @media (max-width: 640px) {
                        .masonry-grid {
                            columns: 1;
                        }
                    }
                    
                    .masonry-item {
                        break-inside: avoid;
                        margin-bottom: 20px;
                        page-break-inside: avoid;
                    }
                    
                    .filters-panel {
                        animation: slideDown 0.3s ease-out;
                    }
                `}
            </style>

            <div style={styles.container}>
                {/* Hero Section */}
                <div style={styles.hero}>
                    <div style={styles.heroContent}>
                        <h1 style={styles.heroTitle}>
                            The internet's source of
                            <br />
                            <span style={styles.heroTitleAccent}>freely usable images.</span>
                        </h1>
                        <p style={styles.heroSubtitle}>
                            Powered by creators everywhere.
                        </p>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} style={styles.searchContainer}>
                            <div style={styles.searchBox}>
                                <svg style={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search for images by name or description..."
                                    style={styles.searchInput}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button type="submit" style={styles.searchButton}>
                                    <svg style={styles.searchButtonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                            </div>
                        </form>

                        {/* Trending searches */}
                        <div style={styles.trendingContainer}>
                            <span style={styles.trendingLabel}>Trending:</span>
                            {['nature', 'business', 'texture', 'minimal', 'abstract'].map((term) => (
                                <button
                                    key={term}
                                    style={styles.trendingTag}
                                    onClick={() => setSearchQuery(term)}
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div style={styles.filtersSection}>
                    <div style={styles.filtersHeader}>
                        <div style={styles.filtersLeft}>
                            <button
                                style={{
                                    ...styles.filterToggle,
                                    backgroundColor: showFilters ? '#f0f0f0' : 'transparent'
                                }}
                                className="filter-button"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <svg style={styles.filterIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.586l-4-4V9.414a1 1 0 00-.293-.707L3.293 6.707A1 1 0 013 6V4z" />
                                </svg>
                                Filters
                                {activeFiltersCount > 0 && (
                                    <span style={styles.filterBadge}>{activeFiltersCount}</span>
                                )}
                            </button>

                            <div style={styles.resultsCount}>
                                {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
                            </div>
                        </div>

                        <div style={styles.filtersRight}>
                            <select
                                style={styles.sortSelect}
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="name">Sort by Name</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {showFilters && (
                        <div style={styles.filtersPanel} className="filters-panel">
                            <div style={styles.filtersGrid}>
                                {/* Price Filter */}
                                <div style={styles.filterGroup}>
                                    <label style={styles.filterLabel}>Price Range</label>
                                    <div style={styles.priceInputs}>
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            style={styles.priceInput}
                                            value={priceFilter.min}
                                            onChange={(e) => setPriceFilter(prev => ({ ...prev, min: e.target.value }))}
                                        />
                                        <span style={styles.priceSeparator}>-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            style={styles.priceInput}
                                            value={priceFilter.max}
                                            onChange={(e) => setPriceFilter(prev => ({ ...prev, max: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                {/* Category Filter */}
                                <div style={styles.filterGroup}>
                                    <label style={styles.filterLabel}>Category</label>
                                    <select
                                        style={styles.categorySelect}
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Clear Filters */}
                                <div style={styles.filterGroup}>
                                    <button
                                        style={styles.clearButton}
                                        onClick={clearFilters}
                                        disabled={activeFiltersCount === 0}
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div style={styles.loadingContainer}>
                        <div style={styles.spinner}></div>
                        <p style={styles.loadingText}>Loading beautiful images...</p>
                    </div>
                ) : (
                    <div style={styles.content}>
                        {filteredProducts.length === 0 ? (
                            <div style={styles.noResults}>
                                <svg style={styles.noResultsIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <h3 style={styles.noResultsTitle}>No results found</h3>
                                <p style={styles.noResultsText}>Try adjusting your search or filters</p>
                                <button style={styles.clearFiltersButton} onClick={clearFilters}>
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            /* Masonry Grid */
                            <div className="masonry-grid">
                                {filteredProducts.map((product, index) => (
                                    <div key={product._id} className="masonry-item">
                                        <div
                                            className="card-hover"
                                            style={{
                                                ...styles.imageCard,
                                                animationDelay: `${index * 0.1}s`
                                            }}
                                        >
                                            <div style={styles.imageWrapper}>
                                                <img
                                                    src={`http://localhost:5001/${product.filePath}`}
                                                    alt={product.name}
                                                    style={styles.image}
                                                    className="image-hover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = getPlaceholderImage();
                                                    }}
                                                />

                                                {/* Overlay with hover effects */}
                                                <div style={styles.overlay} className="overlay-hover">
                                                    {/* Top overlay with download/like buttons */}
                                                    <div style={styles.topOverlay}>
                                                        <button style={styles.overlayButton}>
                                                            <svg style={styles.overlayIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                            </svg>
                                                        </button>
                                                        <button style={styles.overlayButton}>
                                                            <svg style={styles.overlayIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    {/* Bottom overlay with user info and view button */}
                                                    <div style={styles.bottomOverlay}>
                                                        <div style={styles.userInfo}>
                                                            <div style={styles.avatar}>
                                                                <span style={styles.avatarText}>
                                                                    {product.name?.charAt(0)?.toUpperCase() || 'U'}
                                                                </span>
                                                            </div>
                                                            <span style={styles.userName}>Creator</span>
                                                        </div>
                                                        <a href={`/products/${product._id}`} style={styles.viewButton} className="button-hover">
                                                            View
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Card info */}
                                            <div style={styles.cardInfo}>
                                                <h3 style={styles.cardTitle}>{product.name}</h3>
                                                {product.description && (
                                                    <p style={styles.cardDescription}>{product.description}</p>
                                                )}
                                                <div style={styles.cardMeta}>
                                                    <span style={styles.price}>${product.price.toFixed(2)}</span>
                                                    <span style={styles.category}>{product.category}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        backgroundColor: '#ffffff',
        minHeight: '100vh',
    },
    hero: {
        backgroundColor: '#ffffff',
        padding: '80px 20px 60px',
        textAlign: 'center',
        borderBottom: '1px solid #f1f1f1',
    },
    heroContent: {
        maxWidth: '800px',
        margin: '0 auto',
    },
    heroTitle: {
        fontSize: '3.5rem',
        fontWeight: '700',
        color: '#111',
        lineHeight: '1.1',
        marginBottom: '20px',
        letterSpacing: '-0.02em',
    },
    heroTitleAccent: {
        color: '#767676',
    },
    heroSubtitle: {
        fontSize: '1.125rem',
        color: '#767676',
        marginBottom: '40px',
        fontWeight: '400',
    },
    searchContainer: {
        marginBottom: '30px',
    },
    searchBox: {
        position: 'relative',
        maxWidth: '600px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        border: '1px solid #d1d1d1',
        transition: 'border-color 0.2s ease',
    },
    searchIcon: {
        width: '20px',
        height: '20px',
        color: '#767676',
        marginLeft: '16px',
        flexShrink: 0,
    },
    searchInput: {
        flex: 1,
        padding: '14px 16px',
        border: 'none',
        backgroundColor: 'transparent',
        fontSize: '1rem',
        color: '#111',
        outline: 'none',
    },
    searchButton: {
        padding: '12px',
        backgroundColor: '#111',
        border: 'none',
        borderRadius: '0 3px 3px 0',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s ease',
    },
    searchButtonIcon: {
        width: '20px',
        height: '20px',
        color: '#fff',
    },
    trendingContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '12px',
    },
    trendingLabel: {
        fontSize: '0.875rem',
        color: '#767676',
        fontWeight: '500',
    },
    trendingTag: {
        padding: '6px 12px',
        backgroundColor: '#f5f5f5',
        border: '1px solid #d1d1d1',
        borderRadius: '20px',
        fontSize: '0.875rem',
        color: '#767676',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    filtersSection: {
        backgroundColor: '#fafafa',
        borderBottom: '1px solid #e5e5e5',
    },
    filtersHeader: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filtersLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    filterToggle: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        border: '1px solid #d1d1d1',
        borderRadius: '4px',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        fontSize: '0.875rem',
        color: '#111',
        transition: 'background-color 0.2s ease',
        position: 'relative',
    },
    filterIcon: {
        width: '16px',
        height: '16px',
    },
    filterBadge: {
        backgroundColor: '#111',
        color: 'white',
        borderRadius: '10px',
        padding: '2px 6px',
        fontSize: '0.75rem',
        fontWeight: '600',
        minWidth: '18px',
        textAlign: 'center',
    },
    resultsCount: {
        fontSize: '0.875rem',
        color: '#767676',
    },
    filtersRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    sortSelect: {
        padding: '8px 12px',
        border: '1px solid #d1d1d1',
        borderRadius: '4px',
        backgroundColor: '#fff',
        fontSize: '0.875rem',
        color: '#111',
        cursor: 'pointer',
        outline: 'none',
    },
    filtersPanel: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        borderTop: '1px solid #e5e5e5',
    },
    filtersGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        alignItems: 'end',
    },
    filterGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    filterLabel: {
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#111',
    },
    priceInputs: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    priceInput: {
        flex: 1,
        padding: '8px 12px',
        border: '1px solid #d1d1d1',
        borderRadius: '4px',
        fontSize: '0.875rem',
        outline: 'none',
        ':focus': {
            borderColor: '#111',
        },
    },
    priceSeparator: {
        color: '#767676',
        fontSize: '0.875rem',
    },
    categorySelect: {
        padding: '8px 12px',
        border: '1px solid #d1d1d1',
        borderRadius: '4px',
        backgroundColor: '#fff',
        fontSize: '0.875rem',
        color: '#111',
        cursor: 'pointer',
        outline: 'none',
    },
    clearButton: {
        padding: '8px 16px',
        backgroundColor: '#f5f5f5',
        border: '1px solid #d1d1d1',
        borderRadius: '4px',
        fontSize: '0.875rem',
        color: '#111',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ':hover': {
            backgroundColor: '#e8e8e8',
        },
        ':disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
        },
    },
    content: {
        padding: '40px 20px',
    },
    noResults: {
        textAlign: 'center',
        padding: '60px 20px',
        maxWidth: '400px',
        margin: '0 auto',
    },
    noResultsIcon: {
        width: '48px',
        height: '48px',
        color: '#d1d1d1',
        margin: '0 auto 20px',
    },
    noResultsTitle: {
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#111',
        margin: '0 0 12px 0',
    },
    noResultsText: {
        fontSize: '1rem',
        color: '#767676',
        margin: '0 0 24px 0',
    },
    clearFiltersButton: {
        padding: '12px 24px',
        backgroundColor: '#111',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '0.875rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '50vh',
        padding: '40px 20px',
    },
    spinner: {
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #111',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px',
    },
    loadingText: {
        fontSize: '1rem',
        color: '#767676',
        fontWeight: '400',
    },
    imageCard: {
        backgroundColor: '#fff',
        borderRadius: '6px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        animation: 'fadeIn 0.6s ease-out forwards',
        opacity: 0,
    },
    imageWrapper: {
        position: 'relative',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 'auto',
        display: 'block',
        transition: 'transform 0.3s ease',
        verticalAlign: 'bottom',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%)',
        opacity: 0,
        transition: 'opacity 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px',
    },
    topOverlay: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '8px',
    },
    bottomOverlay: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    overlayButton: {
        width: '32px',
        height: '32px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
    },
    overlayIcon: {
        width: '16px',
        height: '16px',
        color: '#111',
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    avatar: {
        width: '32px',
        height: '32px',
        backgroundColor: '#fff',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#111',
    },
    userName: {
        color: 'white',
        fontSize: '0.875rem',
        fontWeight: '500',
    },
    viewButton: {
        padding: '8px 16px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        color: '#111',
        textDecoration: 'none',
        borderRadius: '4px',
        fontSize: '0.875rem',
        fontWeight: '500',
        transition: 'all 0.2s ease',
    },
    cardInfo: {
        padding: '12px 16px 16px',
    },
    cardTitle: {
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#111',
        margin: '0 0 8px 0',
        lineHeight: '1.3',
    },
    cardDescription: {
        fontSize: '0.75rem',
        color: '#767676',
        margin: '0 0 8px 0',
        lineHeight: '1.4',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
    cardMeta: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#111',
    },
    category: {
        fontSize: '0.75rem',
        color: '#767676',
        backgroundColor: '#f5f5f5',
        padding: '2px 8px',
        borderRadius: '12px',
        textTransform: 'capitalize',
    },
};

export default HomePage;