// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// const LandingPage = () => {
//     const [featuredImages, setFeaturedImages] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [email, setEmail] = useState('');
//     const [isSubscribed, setIsSubscribed] = useState(false);

//     useEffect(() => {
//         const fetchFeaturedImages = async () => {
//             try {
//                 // Simulate fetching featured images
//                 await new Promise(resolve => setTimeout(resolve, 1000));
//                 const mockImages = Array(6).fill().map((_, i) => ({
//                     _id: `mock-${i}`,
//                     name: `Featured Image ${i + 1}`,
//                     price: (19.99 + i * 5).toFixed(2),
//                     category: ['Nature', 'Urban', 'Abstract', 'People', 'Technology', 'Art'][i],
//                     filePath: `placeholder-${i}.jpg`
//                 }));
//                 setFeaturedImages(mockImages);
//             } catch (error) {
//                 console.error('Failed to fetch featured images:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchFeaturedImages();
//     }, []);

//     const handleSubscribe = (e) => {
//         e.preventDefault();
//         if (email) {
//             setIsSubscribed(true);
//             setEmail('');
//             setTimeout(() => setIsSubscribed(false), 3000);
//         }
//     };

//     const getPlaceholderImage = (index) => {
//         return `https://picsum.photos/600/400?random=${index}`;
//     };

//     return (
//         <div style={styles.container}>
//             {/* Hero Section */}
//             <header style={styles.hero}>
//                 <div style={styles.heroContent}>
//                     <h1 style={styles.heroTitle}>Discover & Share Extraordinary Visuals</h1>
//                     <p style={styles.heroSubtitle}>
//                         The premier marketplace for buying and selling high-quality images from talented creators worldwide
//                     </p>
//                     <div style={styles.heroButtons}>
//                         <Link to="/marketplace" style={styles.primaryButton}>Explore Images</Link>
//                         <Link to="/login" style={styles.secondaryButton}>Start Selling</Link>
//                     </div>
//                 </div>
//                 <div style={styles.heroImageContainer}>
//                     <div style={styles.heroImageGrid}>
//                         {[0, 1, 2, 3].map((i) => (
//                             <div key={i} style={styles.heroImageWrapper}>
//                                 <img
//                                     src={getPlaceholderImage(i)}
//                                     alt={`Featured ${i}`}
//                                     style={styles.heroImage}
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </header>

//             {/* Features Section */}
//             <section style={styles.section}>
//                 <h2 style={styles.sectionTitle}>Why Choose Our Marketplace</h2>
//                 <div style={styles.featuresGrid}>
//                     <div style={styles.featureCard}>
//                         <div style={styles.featureIcon}>
//                             <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                 <path d="M7 13C7 14.1046 6.10457 15 5 15C3.89543 15 3 14.1046 3 13C3 11.8954 3.89543 11 5 11C6.10457 11 7 11.8954 7 13Z" stroke="#3B82F6" strokeWidth="2" />
//                                 <path d="M15 7C15 8.10457 14.1046 9 13 9C11.8954 9 11 8.10457 11 7C11 5.89543 11.8954 5 13 5C14.1046 5 15 5.89543 15 7Z" stroke="#3B82F6" strokeWidth="2" />
//                                 <path d="M15 17C15 18.1046 14.1046 19 13 19C11.8954 19 11 18.1046 11 17C11 15.8954 11.8954 15 13 15C14.1046 15 15 15.8954 15 17Z" stroke="#3B82F6" strokeWidth="2" />
//                                 <path d="M21 13C21 14.1046 20.1046 15 19 15C17.8954 15 17 14.1046 17 13C17 11.8954 17.8954 11 19 11C20.1046 11 21 11.8954 21 13Z" stroke="#3B82F6" strokeWidth="2" />
//                                 <path d="M14 7L10 11" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
//                                 <path d="M14 17L10 13" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
//                                 <path d="M7 13L11 13" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
//                                 <path d="M13 13L17 13" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
//                             </svg>
//                         </div>
//                         <h3 style={styles.featureTitle}>Seamless Integration</h3>
//                         <p style={styles.featureText}>
//                             Easy API access and simple licensing for all your creative projects
//                         </p>
//                     </div>
//                     <div style={styles.featureCard}>
//                         <div style={styles.featureIcon}>
//                             <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                 <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
//                             </svg>
//                         </div>
//                         <h3 style={styles.featureTitle}>Secure Transactions</h3>
//                         <p style={styles.featureText}>
//                             Protected payments and escrow services for peace of mind
//                         </p>
//                     </div>
//                     <div style={styles.featureCard}>
//                         <div style={styles.featureIcon}>
//                             <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                 <path d="M7 21C4.79086 21 3 19.2091 3 17V10.7076C3 9.30887 3.73061 8.01175 4.92679 7.28679L9.92679 4.25649C11.2011 3.48421 12.7989 3.48421 14.0732 4.25649L19.0732 7.28679C20.2694 8.01175 21 9.30887 21 10.7076V17C21 19.2091 19.2091 21 17 21H7Z" stroke="#3B82F6" strokeWidth="2" />
//                                 <path d="M12 11V15" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
//                                 <path d="M12 19V15" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
//                             </svg>
//                         </div>
//                         <h3 style={styles.featureTitle}>Premium Quality</h3>
//                         <p style={styles.featureText}>
//                             Curated collection of high-resolution, professional-grade images
//                         </p>
//                     </div>
//                 </div>
//             </section>

//             {/* Featured Images */}
//             <section style={styles.section}>
//                 <div style={styles.sectionHeader}>
//                     <h2 style={styles.sectionTitle}>Trending This Week</h2>
//                     <Link to="/explore" style={styles.viewAllLink}>View All →</Link>
//                 </div>
//                 {loading ? (
//                     <div style={styles.loadingGrid}>
//                         {[1, 2, 3, 4, 5, 6].map((i) => (
//                             <div key={i} style={styles.imageCardSkeleton}></div>
//                         ))}
//                     </div>
//                 ) : (
//                     <div style={styles.imagesGrid}>
//                         {featuredImages.map((image, index) => (
//                             <div key={image._id} style={styles.imageCard}>
//                                 <div style={styles.imageWrapper}>
//                                     <img
//                                         src={getPlaceholderImage(index)}
//                                         alt={image.name}
//                                         style={styles.image}
//                                     />
//                                     <div style={styles.imageOverlay}>
//                                         <Link to={`/products/${image._id}`} style={styles.quickViewButton}>
//                                             View Details
//                                         </Link>
//                                     </div>
//                                 </div>
//                                 <div style={styles.imageInfo}>
//                                     <h3 style={styles.imageTitle}>{image.name}</h3>
//                                     <div style={styles.imageMeta}>
//                                         <span style={styles.imageCategory}>{image.category}</span>
//                                         <span style={styles.imagePrice}>${image.price}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </section>

//             {/* Testimonials */}
//             <section style={styles.testimonialsSection}>
//                 <h2 style={styles.sectionTitle}>What Our Community Says</h2>
//                 <div style={styles.testimonialsGrid}>
//                     <div style={styles.testimonialCard}>
//                         <div style={styles.testimonialRating}>★★★★★</div>
//                         <p style={styles.testimonialText}>
//                             "As a designer, I've found incredible assets here that elevated my projects. The licensing is clear and straightforward."
//                         </p>
//                         <div style={styles.testimonialAuthor}>
//                             <div style={styles.testimonialAvatar}></div>
//                             <div>
//                                 <p style={styles.testimonialName}>Sarah Johnson</p>
//                                 <p style={styles.testimonialRole}>Graphic Designer</p>
//                             </div>
//                         </div>
//                     </div>
//                     <div style={styles.testimonialCard}>
//                         <div style={styles.testimonialRating}>★★★★☆</div>
//                         <p style={styles.testimonialText}>
//                             "Selling my photography here has become a significant income stream. The platform is photographer-friendly."
//                         </p>
//                         <div style={styles.testimonialAuthor}>
//                             <div style={styles.testimonialAvatar}></div>
//                             <div>
//                                 <p style={styles.testimonialName}>Michael Chen</p>
//                                 <p style={styles.testimonialRole}>Photographer</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* CTA Section */}
//             <section style={styles.ctaSection}>
//                 <div style={styles.ctaContent}>
//                     <h2 style={styles.ctaTitle}>Ready to Transform Your Projects?</h2>
//                     <p style={styles.ctaText}>
//                         Join thousands of creatives who trust our marketplace for their visual needs
//                     </p>
//                     <div style={styles.ctaButtons}>
//                         <Link to="/register" style={styles.primaryButton}>Get Started</Link>
//                         <Link to="/marketplace" style={styles.secondaryButtonWhite}>Browse Collections</Link>
//                     </div>
//                 </div>
//             </section>

//             {/* Newsletter */}
//             <section style={styles.newsletterSection}>
//                 <div style={styles.newsletterContent}>
//                     <div style={styles.newsletterText}>
//                         <h3 style={styles.newsletterTitle}>Stay Inspired</h3>
//                         <p style={styles.newsletterSubtitle}>
//                             Subscribe to our newsletter for weekly curated collections and exclusive deals
//                         </p>
//                     </div>
//                     {isSubscribed ? (
//                         <div style={styles.successMessage}>
//                             <svg style={styles.successIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                 <path d="M7 12L10 15L17 8M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                             </svg>
//                             <span>Thanks for subscribing!</span>
//                         </div>
//                     ) : (
//                         <form onSubmit={handleSubscribe} style={styles.newsletterForm}>
//                             <input
//                                 type="email"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 placeholder="Your email address"
//                                 style={styles.newsletterInput}
//                                 required
//                             />
//                             <button type="submit" style={styles.newsletterButton}>
//                                 Subscribe
//                             </button>
//                         </form>
//                     )}
//                 </div>
//             </section>
//         </div>
//     );
// };

// const styles = {
//     container: {
//         fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
//         color: '#0F172A',
//         lineHeight: '1.5',
//     },
//     hero: {
//         display: 'flex',
//         flexDirection: ['column', 'row'],
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         padding: '6rem 2rem',
//         backgroundColor: '#F8FAFC',
//         backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
//         overflow: 'hidden',
//     },
//     heroContent: {
//         flex: '1',
//         maxWidth: '600px',
//         padding: ['0 0 3rem 0', '0 2rem 0 0'],
//     },
//     heroTitle: {
//         fontSize: ['2.5rem', '3rem'],
//         fontWeight: '800',
//         lineHeight: '1.2',
//         marginBottom: '1.5rem',
//         background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
//         WebkitBackgroundClip: 'text',
//         WebkitTextFillColor: 'transparent',
//         letterSpacing: '-0.025em',
//     },
//     heroSubtitle: {
//         fontSize: '1.25rem',
//         color: '#64748B',
//         marginBottom: '2.5rem',
//         lineHeight: '1.6',
//     },
//     heroButtons: {
//         display: 'flex',
//         gap: '1rem',
//     },
//     primaryButton: {
//         display: 'inline-block',
//         padding: '0.875rem 1.75rem',
//         backgroundColor: '#3B82F6',
//         color: '#FFFFFF',
//         borderRadius: '8px',
//         textDecoration: 'none',
//         fontWeight: '600',
//         fontSize: '1rem',
//         transition: 'all 0.2s ease',
//         ':hover': {
//             backgroundColor: '#2563EB',
//             transform: 'translateY(-2px)',
//             boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
//         },
//     },
//     secondaryButton: {
//         display: 'inline-block',
//         padding: '0.875rem 1.75rem',
//         backgroundColor: 'transparent',
//         color: '#3B82F6',
//         border: '2px solid #3B82F6',
//         borderRadius: '8px',
//         textDecoration: 'none',
//         fontWeight: '600',
//         fontSize: '1rem',
//         transition: 'all 0.2s ease',
//         ':hover': {
//             backgroundColor: '#F8FAFC',
//             transform: 'translateY(-2px)',
//         },
//     },
//     heroImageContainer: {
//         flex: '1',
//         maxWidth: ['100%', '600px'],
//     },
//     heroImageGrid: {
//         display: 'grid',
//         gridTemplateColumns: 'repeat(2, 1fr)',
//         gap: '1rem',
//     },
//     heroImageWrapper: {
//         borderRadius: '12px',
//         overflow: 'hidden',
//         boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
//         aspectRatio: '1',
//         transition: 'all 0.3s ease',
//         ':nth-child(1)': {
//             transform: 'rotate(-5deg)',
//         },
//         ':nth-child(2)': {
//             transform: 'rotate(3deg) translateY(1rem)',
//         },
//         ':nth-child(3)': {
//             transform: 'rotate(2deg) translateY(-1rem)',
//         },
//         ':nth-child(4)': {
//             transform: 'rotate(-4deg) translateY(0.5rem)',
//         },
//         ':hover': {
//             transform: 'scale(1.05) rotate(0deg)',
//             zIndex: '1',
//         },
//     },
//     heroImage: {
//         width: '100%',
//         height: '100%',
//         objectFit: 'cover',
//     },
//     section: {
//         padding: '6rem 2rem',
//         maxWidth: '1400px',
//         margin: '0 auto',
//     },
//     sectionHeader: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: '3rem',
//     },
//     sectionTitle: {
//         fontSize: '2.25rem',
//         fontWeight: '800',
//         color: '#0F172A',
//         marginBottom: '1rem',
//         textAlign: 'center',
//     },
//     viewAllLink: {
//         color: '#3B82F6',
//         fontWeight: '600',
//         textDecoration: 'none',
//         display: 'flex',
//         alignItems: 'center',
//         gap: '0.25rem',
//         ':hover': {
//             textDecoration: 'underline',
//         },
//     },
//     featuresGrid: {
//         display: 'grid',
//         gridTemplateColumns: ['1fr', '1fr 1fr 1fr'],
//         gap: '2rem',
//         marginTop: '3rem',
//     },
//     featureCard: {
//         backgroundColor: '#FFFFFF',
//         borderRadius: '12px',
//         padding: '2rem',
//         boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
//         transition: 'all 0.3s ease',
//         ':hover': {
//             transform: 'translateY(-5px)',
//             boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
//         },
//     },
//     featureIcon: {
//         width: '48px',
//         height: '48px',
//         backgroundColor: '#EFF6FF',
//         borderRadius: '12px',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginBottom: '1.5rem',
//     },
//     featureTitle: {
//         fontSize: '1.25rem',
//         fontWeight: '700',
//         marginBottom: '1rem',
//         color: '#0F172A',
//     },
//     featureText: {
//         color: '#64748B',
//         lineHeight: '1.6',
//     },
//     loadingGrid: {
//         display: 'grid',
//         gridTemplateColumns: ['1fr', '1fr 1fr', '1fr 1fr 1fr'],
//         gap: '2rem',
//     },
//     imageCardSkeleton: {
//         backgroundColor: '#F1F5F9',
//         borderRadius: '12px',
//         aspectRatio: '1',
//         animation: 'pulse 2s infinite',
//     },
//     imagesGrid: {
//         display: 'grid',
//         gridTemplateColumns: ['1fr', '1fr 1fr', '1fr 1fr 1fr'],
//         gap: '2rem',
//     },
//     imageCard: {
//         backgroundColor: '#FFFFFF',
//         borderRadius: '12px',
//         overflow: 'hidden',
//         boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
//         transition: 'all 0.3s ease',
//         ':hover': {
//             transform: 'translateY(-5px)',
//             boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
//         },
//     },
//     imageWrapper: {
//         position: 'relative',
//         aspectRatio: '4/3',
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
//     imageOverlay: {
//         position: 'absolute',
//         top: '0',
//         left: '0',
//         right: '0',
//         bottom: '0',
//         background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
//         display: 'flex',
//         alignItems: 'flex-end',
//         justifyContent: 'center',
//         padding: '1.5rem',
//         opacity: '0',
//         transition: 'opacity 0.3s ease',
//         ':hover': {
//             opacity: '1',
//         },
//     },
//     quickViewButton: {
//         padding: '0.75rem 1.5rem',
//         backgroundColor: 'rgba(255, 255, 255, 0.9)',
//         color: '#1E293B',
//         borderRadius: '8px',
//         textDecoration: 'none',
//         fontWeight: '600',
//         fontSize: '0.9rem',
//         transition: 'all 0.2s ease',
//         boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
//         ':hover': {
//             backgroundColor: '#FFFFFF',
//             transform: 'translateY(-2px)',
//             boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
//         },
//     },
//     imageInfo: {
//         padding: '1.5rem',
//     },
//     imageTitle: {
//         fontSize: '1.1rem',
//         fontWeight: '700',
//         marginBottom: '0.5rem',
//         color: '#0F172A',
//     },
//     imageMeta: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     imageCategory: {
//         backgroundColor: '#EFF6FF',
//         color: '#1D4ED8',
//         padding: '0.25rem 0.75rem',
//         borderRadius: '20px',
//         fontSize: '0.75rem',
//         fontWeight: '600',
//     },
//     imagePrice: {
//         fontWeight: '800',
//         color: '#3B82F6',
//     },
//     testimonialsSection: {
//         padding: '6rem 2rem',
//         backgroundColor: '#F8FAFC',
//     },
//     testimonialsGrid: {
//         display: 'grid',
//         gridTemplateColumns: ['1fr', '1fr 1fr'],
//         gap: '2rem',
//         maxWidth: '1200px',
//         margin: '0 auto',
//     },
//     testimonialCard: {
//         backgroundColor: '#FFFFFF',
//         borderRadius: '12px',
//         padding: '2rem',
//         boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
//     },
//     testimonialRating: {
//         color: '#F59E0B',
//         fontSize: '1.25rem',
//         marginBottom: '1rem',
//     },
//     testimonialText: {
//         fontSize: '1.1rem',
//         color: '#334155',
//         lineHeight: '1.7',
//         fontStyle: 'italic',
//         marginBottom: '1.5rem',
//     },
//     testimonialAuthor: {
//         display: 'flex',
//         alignItems: 'center',
//         gap: '1rem',
//     },
//     testimonialAvatar: {
//         width: '48px',
//         height: '48px',
//         borderRadius: '50%',
//         backgroundColor: '#E2E8F0',
//     },
//     testimonialName: {
//         fontWeight: '600',
//         marginBottom: '0.25rem',
//     },
//     testimonialRole: {
//         color: '#64748B',
//         fontSize: '0.875rem',
//     },
//     ctaSection: {
//         padding: '8rem 2rem',
//         background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
//         color: '#FFFFFF',
//         textAlign: 'center',
//     },
//     ctaContent: {
//         maxWidth: '800px',
//         margin: '0 auto',
//     },
//     ctaTitle: {
//         fontSize: '2.5rem',
//         fontWeight: '800',
//         marginBottom: '1.5rem',
//         lineHeight: '1.2',
//     },
//     ctaText: {
//         fontSize: '1.25rem',
//         opacity: '0.9',
//         marginBottom: '2.5rem',
//     },
//     ctaButtons: {
//         display: 'flex',
//         justifyContent: 'center',
//         gap: '1.5rem',
//     },
//     secondaryButtonWhite: {
//         display: 'inline-block',
//         padding: '0.875rem 1.75rem',
//         backgroundColor: 'transparent',
//         color: '#FFFFFF',
//         border: '2px solid #FFFFFF',
//         borderRadius: '8px',
//         textDecoration: 'none',
//         fontWeight: '600',
//         fontSize: '1rem',
//         transition: 'all 0.2s ease',
//         ':hover': {
//             backgroundColor: 'rgba(255, 255, 255, 0.1)',
//             transform: 'translateY(-2px)',
//         },
//     },
//     newsletterSection: {
//         padding: '4rem 2rem',
//         backgroundColor: '#FFFFFF',
//     },
//     newsletterContent: {
//         maxWidth: '1000px',
//         margin: '0 auto',
//         display: 'flex',
//         flexDirection: ['column', 'row'],
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         gap: '2rem',
//     },
//     newsletterText: {
//         flex: '1',
//     },
//     newsletterTitle: {
//         fontSize: '1.5rem',
//         fontWeight: '700',
//         marginBottom: '0.5rem',
//     },
//     newsletterSubtitle: {
//         color: '#64748B',
//     },
//     newsletterForm: {
//         display: 'flex',
//         gap: '0.5rem',
//         flex: '1',
//     },
//     newsletterInput: {
//         flex: '1',
//         padding: '0.875rem 1rem',
//         border: '1px solid #E2E8F0',
//         borderRadius: '8px',
//         fontSize: '1rem',
//         ':focus': {
//             outline: 'none',
//             borderColor: '#3B82F6',
//             boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)',
//         },
//     },
//     newsletterButton: {
//         padding: '0.875rem 1.5rem',
//         backgroundColor: '#3B82F6',
//         color: '#FFFFFF',
//         border: 'none',
//         borderRadius: '8px',
//         fontWeight: '600',
//         fontSize: '1rem',
//         cursor: 'pointer',
//         transition: 'all 0.2s ease',
//         ':hover': {
//             backgroundColor: '#2563EB',
//         },
//     },
//     successMessage: {
//         display: 'flex',
//         alignItems: 'center',
//         gap: '0.5rem',
//         padding: '0.875rem 1.5rem',
//         backgroundColor: '#ECFDF5',
//         color: '#059669',
//         borderRadius: '8px',
//         fontWeight: '600',
//     },
//     successIcon: {
//         width: '20px',
//         height: '20px',
//     },
// };

// // Add animations
// const styleElement = document.createElement('style');
// styleElement.textContent = `
//     @keyframes spin {
//         0% { transform: rotate(0deg); }
//         100% { transform: rotate(360deg); }
//     }
//     @keyframes pulse {
//         0%, 100% { opacity: 1; }
//         50% { opacity: 0.5; }
//     }
// `;
// document.head.appendChild(styleElement);

// export default LandingPage;

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

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

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="stat-number">2M+</span>
                        <span className="stat-label">Photos Available</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">50K+</span>
                        <span className="stat-label">Artists</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">1M+</span>
                        <span className="stat-label">Downloads</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">150+</span>
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