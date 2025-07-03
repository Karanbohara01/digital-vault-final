


// import React, { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { Link, useNavigate } from 'react-router-dom';
// import SettingsPage from './SettingsPage';
// import UserManagement from '../components/dashboard/UserManagement';


// const DashboardPage = () => {
//     const { user, token } = useContext(AuthContext);
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [activeTab, setActiveTab] = useState('dashboard');
//     const navigate = useNavigate();

//     // This effect now fetches data based on the ACTIVE TAB, which is more efficient.
//     useEffect(() => {
//         const fetchDataForTab = async () => {
//             // Only fetch data if a specific data-driven tab is selected
//             if (!user || !['products', 'orders', 'logs'].includes(activeTab)) {
//                 setData([]);
//                 return;
//             };

//             setLoading(true);
//             setError(null);
//             let url = '';

//             // Determine the correct API endpoint based on the active tab and user role
//             if (activeTab === 'orders' && user.role === 'customer') {
//                 url = '/api/orders/my-orders';
//             } else if (activeTab === 'products' && user.role === 'creator') {
//                 url = '/api/products/my-products';
//             } else if (activeTab === 'logs' && user.role === 'admin') {
//                 url = '/api/logs';
//             } else {
//                 setLoading(false);
//                 return; // Exit if the role doesn't match the tab
//             }

//             try {
//                 const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
//                 const result = await response.json();
//                 if (response.ok) {
//                     setData(result);
//                 } else {
//                     throw new Error(result.message || 'Failed to fetch data');
//                 }
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDataForTab();
//     }, [user, token, activeTab]); // Re-run when the active tab changes

//     const handleDeleteProduct = async (productId) => {
//         if (!window.confirm('Are you sure you want to permanently delete this product?')) return;
//         try {
//             const response = await fetch(`/api/products/${productId}`, {
//                 method: 'DELETE',
//                 headers: { 'Authorization': `Bearer ${token}` },
//             });
//             if (!response.ok) throw new Error((await response.json()).message);
//             setData(prevData => prevData.filter(p => p._id !== productId));
//         } catch (err) { setError(err.message); }
//     };

//     const handleDownload = async (productId, productName) => {
//         if (!productId) return alert('Product data is missing.');
//         try {
//             const response = await fetch(`/api/products/${productId}/download`, {
//                 headers: { 'Authorization': `Bearer ${token}` },
//             });
//             if (!response.ok) throw new Error((await response.json()).message);
//             const blob = await response.blob();
//             const url = window.URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             const fileExtension = blob.type.split('/')[1] || 'download';
//             link.setAttribute('download', `${productName}.${fileExtension}`);
//             document.body.appendChild(link);
//             link.click();
//             link.parentNode.removeChild(link);
//             window.URL.revokeObjectURL(url);
//         } catch (err) { alert(`Error: ${err.message}`); }
//     };

//     return (
//         <div style={{
//             minHeight: '100vh',
//             backgroundColor: '#fafafa',
//             fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
//         }}>
//             {/* Header */}
//             <div style={{
//                 backgroundColor: 'white',
//                 borderBottom: '1px solid #e5e5e5',
//                 padding: '24px 0',
//                 marginBottom: '40px'
//             }}>
//                 <div style={{
//                     maxWidth: '1200px',
//                     margin: '0 auto',
//                     padding: '0 24px'
//                 }}>
//                     <h1 style={{
//                         fontSize: '32px',
//                         fontWeight: '600',
//                         color: '#111',
//                         margin: '0 0 8px 0',
//                         letterSpacing: '-0.5px'
//                     }}>Dashboard</h1>
//                     <p style={{
//                         fontSize: '16px',
//                         color: '#767676',
//                         margin: '0',
//                         fontWeight: '400'
//                     }}>Welcome back, {user?.name || 'User'}</p>
//                 </div>
//             </div>

//             {/* Navigation Tabs */}
//             <div style={{
//                 maxWidth: '1200px',
//                 margin: '0 auto',
//                 padding: '0 24px',
//                 marginBottom: '40px'
//             }}>
//                 <div style={{
//                     display: 'flex',
//                     gap: '0',
//                     borderBottom: '1px solid #e5e5e5'
//                 }}>
//                     <button
//                         onClick={() => setActiveTab('dashboard')}
//                         style={{
//                             padding: '16px 24px',
//                             border: 'none',
//                             background: 'none',
//                             fontSize: '15px',
//                             fontWeight: activeTab === 'dashboard' ? '600' : '400',
//                             color: activeTab === 'dashboard' ? '#111' : '#767676',
//                             borderBottom: activeTab === 'dashboard' ? '2px solid #111' : '2px solid transparent',
//                             cursor: 'pointer',
//                             transition: 'all 0.2s ease'
//                         }}
//                     >
//                         Overview
//                     </button>

//                     {user?.role === 'customer' && (
//                         <button
//                             onClick={() => setActiveTab('orders')}
//                             style={{
//                                 padding: '16px 24px',
//                                 border: 'none',
//                                 background: 'none',
//                                 fontSize: '15px',
//                                 fontWeight: activeTab === 'orders' ? '600' : '400',
//                                 color: activeTab === 'orders' ? '#111' : '#767676',
//                                 borderBottom: activeTab === 'orders' ? '2px solid #111' : '2px solid transparent',
//                                 cursor: 'pointer',
//                                 transition: 'all 0.2s ease'
//                             }}
//                         >
//                             My Orders
//                         </button>
//                     )}

//                     {user?.role === 'creator' && (
//                         <button
//                             onClick={() => setActiveTab('products')}
//                             style={{
//                                 padding: '16px 24px',
//                                 border: 'none',
//                                 background: 'none',
//                                 fontSize: '15px',
//                                 fontWeight: activeTab === 'products' ? '600' : '400',
//                                 color: activeTab === 'products' ? '#111' : '#767676',
//                                 borderBottom: activeTab === 'products' ? '2px solid #111' : '2px solid transparent',
//                                 cursor: 'pointer',
//                                 transition: 'all 0.2s ease'
//                             }}
//                         >
//                             My Products
//                         </button>
//                     )}

//                     {user?.role === 'admin' && (
//                         <button
//                             onClick={() => setActiveTab('logs')}
//                             style={{
//                                 padding: '16px 24px',
//                                 border: 'none',
//                                 background: 'none',
//                                 fontSize: '15px',
//                                 fontWeight: activeTab === 'logs' ? '600' : '400',
//                                 color: activeTab === 'logs' ? '#111' : '#767676',
//                                 borderBottom: activeTab === 'logs' ? '2px solid #111' : '2px solid transparent',
//                                 cursor: 'pointer',
//                                 transition: 'all 0.2s ease'
//                             }}
//                         >
//                             Activity Logs
//                         </button>
//                     )}

//                     <button
//                         onClick={() => setActiveTab('settings')}
//                         style={{
//                             padding: '16px 24px',
//                             border: 'none',
//                             background: 'none',
//                             fontSize: '15px',
//                             fontWeight: activeTab === 'settings' ? '600' : '400',
//                             color: activeTab === 'settings' ? '#111' : '#767676',
//                             borderBottom: activeTab === 'settings' ? '2px solid #111' : '2px solid transparent',
//                             cursor: 'pointer',
//                             transition: 'all 0.2s ease'
//                         }}
//                     >
//                         Settings
//                     </button>
//                 </div>
//             </div>

//             {/* Content */}
//             <div style={{
//                 maxWidth: '1200px',
//                 margin: '0 auto',
//                 padding: '0 24px'
//             }}>
//                 {activeTab === 'dashboard' && (
//                     <div style={{
//                         backgroundColor: 'white',
//                         padding: '48px',
//                         borderRadius: '8px',
//                         textAlign: 'center',
//                         border: '1px solid #e5e5e5'
//                     }}>
//                         <p style={{
//                             fontSize: '16px',
//                             color: '#767676',
//                             margin: '0'
//                         }}>Use the tabs above to manage your account and access your content.</p>
//                     </div>
//                 )}

//                 {activeTab === 'settings' && <SettingsPage />}

//                 {/* CREATOR'S "MY PRODUCTS" TAB */}
//                 {activeTab === 'products' && user?.role === 'creator' && (
//                     <div>
//                         <div style={{
//                             display: 'flex',
//                             justifyContent: 'space-between',
//                             alignItems: 'center',
//                             marginBottom: '32px'
//                         }}>
//                             <h2 style={{
//                                 fontSize: '24px',
//                                 fontWeight: '600',
//                                 color: '#111',
//                                 margin: '0'
//                             }}>My Products</h2>
//                             <Link
//                                 to="/create-product"
//                                 style={{
//                                     backgroundColor: '#111',
//                                     color: 'white',
//                                     padding: '12px 24px',
//                                     borderRadius: '6px',
//                                     textDecoration: 'none',
//                                     fontSize: '14px',
//                                     fontWeight: '500',
//                                     transition: 'all 0.2s ease'
//                                 }}
//                                 onMouseOver={(e) => e.target.style.backgroundColor = '#000'}
//                                 onMouseOut={(e) => e.target.style.backgroundColor = '#111'}
//                             >
//                                 Create New Product
//                             </Link>
//                         </div>

//                         {error && (
//                             <div style={{
//                                 backgroundColor: '#fee',
//                                 color: '#c53030',
//                                 padding: '12px 16px',
//                                 borderRadius: '6px',
//                                 marginBottom: '24px',
//                                 fontSize: '14px'
//                             }}>{error}</div>
//                         )}

//                         {loading ? (
//                             <div style={{
//                                 textAlign: 'center',
//                                 padding: '48px',
//                                 color: '#767676'
//                             }}>Loading...</div>
//                         ) : data.length > 0 ? (
//                             <div style={{
//                                 backgroundColor: 'white',
//                                 borderRadius: '8px',
//                                 border: '1px solid #e5e5e5',
//                                 overflow: 'hidden'
//                             }}>
//                                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                                     <thead>
//                                         <tr style={{ backgroundColor: '#fafafa' }}>
//                                             <th style={{
//                                                 padding: '16px 24px',
//                                                 textAlign: 'left',
//                                                 fontSize: '13px',
//                                                 fontWeight: '600',
//                                                 color: '#767676',
//                                                 textTransform: 'uppercase',
//                                                 letterSpacing: '0.5px'
//                                             }}>Product</th>
//                                             <th style={{
//                                                 padding: '16px 24px',
//                                                 textAlign: 'left',
//                                                 fontSize: '13px',
//                                                 fontWeight: '600',
//                                                 color: '#767676',
//                                                 textTransform: 'uppercase',
//                                                 letterSpacing: '0.5px'
//                                             }}>Price</th>
//                                             <th style={{
//                                                 padding: '16px 24px',
//                                                 textAlign: 'right',
//                                                 fontSize: '13px',
//                                                 fontWeight: '600',
//                                                 color: '#767676',
//                                                 textTransform: 'uppercase',
//                                                 letterSpacing: '0.5px'
//                                             }}>Actions</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {data.map((product, index) => (
//                                             <tr key={product._id} style={{
//                                                 borderTop: index > 0 ? '1px solid #f0f0f0' : 'none'
//                                             }}>
//                                                 <td style={{ padding: '20px 24px' }}>
//                                                     <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//                                                         <img
//                                                             src={`http://localhost:5001/${product.filePath}`}
//                                                             alt={product.name}
//                                                             style={{
//                                                                 width: '48px',
//                                                                 height: '48px',
//                                                                 borderRadius: '6px',
//                                                                 objectFit: 'cover',
//                                                                 border: '1px solid #e5e5e5'
//                                                             }}
//                                                         />
//                                                         <span style={{
//                                                             fontSize: '15px',
//                                                             fontWeight: '500',
//                                                             color: '#111'
//                                                         }}>{product.name}</span>
//                                                     </div>
//                                                 </td>
//                                                 <td style={{
//                                                     padding: '20px 24px',
//                                                     fontSize: '15px',
//                                                     fontWeight: '600',
//                                                     color: '#111'
//                                                 }}>
//                                                     ${product.price.toFixed(2)}
//                                                 </td>
//                                                 <td style={{ padding: '20px 24px', textAlign: 'right' }}>
//                                                     <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
//                                                         <button
//                                                             onClick={() => navigate(`/edit-product/${product._id}`)}
//                                                             style={{
//                                                                 padding: '8px 16px',
//                                                                 border: '1px solid #e5e5e5',
//                                                                 backgroundColor: 'white',
//                                                                 color: '#111',
//                                                                 borderRadius: '6px',
//                                                                 fontSize: '13px',
//                                                                 fontWeight: '500',
//                                                                 cursor: 'pointer',
//                                                                 transition: 'all 0.2s ease'
//                                                             }}
//                                                             onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
//                                                             onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
//                                                         >
//                                                             Edit
//                                                         </button>
//                                                         <button
//                                                             onClick={() => handleDeleteProduct(product._id)}
//                                                             style={{
//                                                                 padding: '8px 16px',
//                                                                 border: '1px solid #ef4444',
//                                                                 backgroundColor: '#ef4444',
//                                                                 color: 'white',
//                                                                 borderRadius: '6px',
//                                                                 fontSize: '13px',
//                                                                 fontWeight: '500',
//                                                                 cursor: 'pointer',
//                                                                 transition: 'all 0.2s ease'
//                                                             }}
//                                                             onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
//                                                             onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
//                                                         >
//                                                             Delete
//                                                         </button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         ) : (
//                             <div style={{
//                                 backgroundColor: 'white',
//                                 padding: '64px 48px',
//                                 borderRadius: '8px',
//                                 textAlign: 'center',
//                                 border: '1px solid #e5e5e5'
//                             }}>
//                                 <p style={{
//                                     fontSize: '16px',
//                                     color: '#767676',
//                                     margin: '0 0 24px 0'
//                                 }}>You have not created any products yet.</p>
//                                 <Link
//                                     to="/create-product"
//                                     style={{
//                                         backgroundColor: '#111',
//                                         color: 'white',
//                                         padding: '12px 24px',
//                                         borderRadius: '6px',
//                                         textDecoration: 'none',
//                                         fontSize: '14px',
//                                         fontWeight: '500',
//                                         display: 'inline-block',
//                                         transition: 'all 0.2s ease'
//                                     }}
//                                     onMouseOver={(e) => e.target.style.backgroundColor = '#000'}
//                                     onMouseOut={(e) => e.target.style.backgroundColor = '#111'}
//                                 >
//                                     Create Your First Product
//                                 </Link>
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {/* CUSTOMER'S "MY ORDERS" TAB */}
//                 {activeTab === 'orders' && user?.role === 'customer' && (
//                     <div>
//                         <h2 style={{
//                             fontSize: '24px',
//                             fontWeight: '600',
//                             color: '#111',
//                             margin: '0 0 32px 0'
//                         }}>My Orders</h2>

//                         {error && (
//                             <div style={{
//                                 backgroundColor: '#fee',
//                                 color: '#c53030',
//                                 padding: '12px 16px',
//                                 borderRadius: '6px',
//                                 marginBottom: '24px',
//                                 fontSize: '14px'
//                             }}>{error}</div>
//                         )}

//                         {loading ? (
//                             <div style={{
//                                 textAlign: 'center',
//                                 padding: '48px',
//                                 color: '#767676'
//                             }}>Loading...</div>
//                         ) : data.length > 0 ? (
//                             <div style={{
//                                 backgroundColor: 'white',
//                                 borderRadius: '8px',
//                                 border: '1px solid #e5e5e5',
//                                 overflow: 'hidden'
//                             }}>
//                                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                                     <thead>
//                                         <tr style={{ backgroundColor: '#fafafa' }}>
//                                             <th style={{
//                                                 padding: '16px 24px',
//                                                 textAlign: 'left',
//                                                 fontSize: '13px',
//                                                 fontWeight: '600',
//                                                 color: '#767676',
//                                                 textTransform: 'uppercase',
//                                                 letterSpacing: '0.5px'
//                                             }}>Product</th>
//                                             <th style={{
//                                                 padding: '16px 24px',
//                                                 textAlign: 'left',
//                                                 fontSize: '13px',
//                                                 fontWeight: '600',
//                                                 color: '#767676',
//                                                 textTransform: 'uppercase',
//                                                 letterSpacing: '0.5px'
//                                             }}>Price</th>
//                                             <th style={{
//                                                 padding: '16px 24px',
//                                                 textAlign: 'left',
//                                                 fontSize: '13px',
//                                                 fontWeight: '600',
//                                                 color: '#767676',
//                                                 textTransform: 'uppercase',
//                                                 letterSpacing: '0.5px'
//                                             }}>Date</th>
//                                             <th style={{
//                                                 padding: '16px 24px',
//                                                 textAlign: 'right',
//                                                 fontSize: '13px',
//                                                 fontWeight: '600',
//                                                 color: '#767676',
//                                                 textTransform: 'uppercase',
//                                                 letterSpacing: '0.5px'
//                                             }}>Action</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {data.map((order, index) => (
//                                             <tr key={order._id} style={{
//                                                 borderTop: index > 0 ? '1px solid #f0f0f0' : 'none'
//                                             }}>
//                                                 <td style={{ padding: '20px 24px' }}>
//                                                     <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//                                                         <img
//                                                             src={`http://localhost:5001/${order.product?.filePath}`}
//                                                             alt={order.product?.name}
//                                                             style={{
//                                                                 width: '48px',
//                                                                 height: '48px',
//                                                                 borderRadius: '6px',
//                                                                 objectFit: 'cover',
//                                                                 border: '1px solid #e5e5e5'
//                                                             }}
//                                                         />
//                                                         <span style={{
//                                                             fontSize: '15px',
//                                                             fontWeight: '500',
//                                                             color: '#111'
//                                                         }}>{order.product?.name || 'N/A'}</span>
//                                                     </div>
//                                                 </td>
//                                                 <td style={{
//                                                     padding: '20px 24px',
//                                                     fontSize: '15px',
//                                                     fontWeight: '600',
//                                                     color: '#111'
//                                                 }}>
//                                                     ${order.price.toFixed(2)}
//                                                 </td>
//                                                 <td style={{
//                                                     padding: '20px 24px',
//                                                     fontSize: '15px',
//                                                     color: '#767676'
//                                                 }}>
//                                                     {new Date(order.createdAt).toLocaleDateString()}
//                                                 </td>
//                                                 <td style={{ padding: '20px 24px', textAlign: 'right' }}>
//                                                     <button
//                                                         onClick={() => handleDownload(order.product?._id, order.product?.name)}
//                                                         style={{
//                                                             backgroundColor: '#111',
//                                                             color: 'white',
//                                                             padding: '8px 16px',
//                                                             border: 'none',
//                                                             borderRadius: '6px',
//                                                             fontSize: '13px',
//                                                             fontWeight: '500',
//                                                             cursor: 'pointer',
//                                                             transition: 'all 0.2s ease'
//                                                         }}
//                                                         onMouseOver={(e) => e.target.style.backgroundColor = '#000'}
//                                                         onMouseOut={(e) => e.target.style.backgroundColor = '#111'}
//                                                     >
//                                                         Download
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         ) : (
//                             <div style={{
//                                 backgroundColor: 'white',
//                                 padding: '64px 48px',
//                                 borderRadius: '8px',
//                                 textAlign: 'center',
//                                 border: '1px solid #e5e5e5'
//                             }}>
//                                 <p style={{
//                                     fontSize: '16px',
//                                     color: '#767676',
//                                     margin: '0 0 24px 0'
//                                 }}>You have no orders yet.</p>
//                                 <Link
//                                     to="/"
//                                     style={{
//                                         backgroundColor: '#111',
//                                         color: 'white',
//                                         padding: '12px 24px',
//                                         borderRadius: '6px',
//                                         textDecoration: 'none',
//                                         fontSize: '14px',
//                                         fontWeight: '500',
//                                         display: 'inline-block',
//                                         transition: 'all 0.2s ease'
//                                     }}
//                                     onMouseOver={(e) => e.target.style.backgroundColor = '#000'}
//                                     onMouseOut={(e) => e.target.style.backgroundColor = '#111'}
//                                 >
//                                     Browse Products
//                                 </Link>
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {/* ADMIN'S "ACTIVITY LOGS" TAB */}
//                 {activeTab === 'logs' && user?.role === 'admin' && (
//                     <div>
//                         <h2 style={{
//                             fontSize: '24px',
//                             fontWeight: '600',
//                             color: '#111',
//                             margin: '0 0 32px 0'
//                         }}>System Activity Logs</h2>

//                         {error && (
//                             <div style={{
//                                 backgroundColor: '#fee',
//                                 color: '#c53030',
//                                 padding: '12px 16px',
//                                 borderRadius: '6px',
//                                 marginBottom: '24px',
//                                 fontSize: '14px'
//                             }}>{error}</div>
//                         )}

//                         {loading ? (
//                             <div style={{
//                                 textAlign: 'center',
//                                 padding: '48px',
//                                 color: '#767676'
//                             }}>Loading...</div>
//                         ) : data.length > 0 ? (
//                             <div style={{
//                                 backgroundColor: 'white',
//                                 borderRadius: '8px',
//                                 border: '1px solid #e5e5e5',
//                                 overflow: 'hidden'
//                             }}>
//                                 <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                                     <thead>
//                                         <tr style={{ backgroundColor: '#fafafa' }}>
//                                             <th style={{
//                                                 padding: '16px 24px',
//                                                 textAlign: 'left',
//                                                 fontSize: '13px',
//                                                 fontWeight: '600',
//                                                 color: '#767676',
//                                                 textTransform: 'uppercase',
//                                                 letterSpacing: '0.5px'
//                                             }}>Timestamp</th>
//                                             <th style={{
//                                                 padding: '16px 24px',
//                                                 textAlign: 'left',
//                                                 fontSize: '13px',
//                                                 fontWeight: '600',
//                                                 color: '#767676',
//                                                 textTransform: 'uppercase',
//                                                 letterSpacing: '0.5px'
//                                             }}>Level</th>
//                                             <th style={{
//                                                 padding: '16px 24px',
//                                                 textAlign: 'left',
//                                                 fontSize: '13px',
//                                                 fontWeight: '600',
//                                                 color: '#767676',
//                                                 textTransform: 'uppercase',
//                                                 letterSpacing: '0.5px'
//                                             }}>Action</th>
//                                             <th style={{
//                                                 padding: '16px 24px',
//                                                 textAlign: 'left',
//                                                 fontSize: '13px',
//                                                 fontWeight: '600',
//                                                 color: '#767676',
//                                                 textTransform: 'uppercase',
//                                                 letterSpacing: '0.5px'
//                                             }}>User</th>
//                                             <th style={{
//                                                 padding: '16px 24px',
//                                                 textAlign: 'left',
//                                                 fontSize: '13px',
//                                                 fontWeight: '600',
//                                                 color: '#767676',
//                                                 textTransform: 'uppercase',
//                                                 letterSpacing: '0.5px'
//                                             }}>Details</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {data.map((log, index) => (
//                                             <tr key={log._id} style={{
//                                                 borderTop: index > 0 ? '1px solid #f0f0f0' : 'none'
//                                             }}>
//                                                 <td style={{
//                                                     padding: '20px 24px',
//                                                     fontSize: '13px',
//                                                     color: '#767676',
//                                                     fontFamily: 'Monaco, "Lucida Console", monospace'
//                                                 }}>
//                                                     {new Date(log.createdAt).toLocaleString()}
//                                                 </td>
//                                                 <td style={{ padding: '20px 24px' }}>
//                                                     <span style={{
//                                                         padding: '4px 8px',
//                                                         borderRadius: '4px',
//                                                         fontSize: '11px',
//                                                         fontWeight: '600',
//                                                         textTransform: 'uppercase',
//                                                         letterSpacing: '0.5px',
//                                                         backgroundColor: log.level === 'fatal' ? '#dc3545' : '#f0f0f0',
//                                                         color: log.level === 'fatal' ? 'white' : '#767676'
//                                                     }}>
//                                                         {log.level}
//                                                     </span>
//                                                 </td>
//                                                 <td style={{
//                                                     padding: '20px 24px',
//                                                     fontSize: '14px',
//                                                     color: '#111',
//                                                     fontWeight: '500'
//                                                 }}>
//                                                     {log.action}
//                                                 </td>
//                                                 <td style={{
//                                                     padding: '20px 24px',
//                                                     fontSize: '14px',
//                                                     color: '#767676'
//                                                 }}>
//                                                     {log.user ? log.user.email : 'System/Unknown'}
//                                                 </td>
//                                                 <td style={{ padding: '20px 24px' }}>
//                                                     <pre style={{
//                                                         fontSize: '12px',
//                                                         fontFamily: 'Monaco, "Lucida Console", monospace',
//                                                         color: '#767676',
//                                                         margin: '0',
//                                                         whiteSpace: 'pre-wrap',
//                                                         maxWidth: '300px',
//                                                         overflow: 'hidden',
//                                                         textOverflow: 'ellipsis'
//                                                     }}>
//                                                         {JSON.stringify(log.details, null, 2)}
//                                                     </pre>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         ) : (
//                             <div style={{
//                                 backgroundColor: 'white',
//                                 padding: '64px 48px',
//                                 borderRadius: '8px',
//                                 textAlign: 'center',
//                                 border: '1px solid #e5e5e5'
//                             }}>
//                                 <p style={{
//                                     fontSize: '16px',
//                                     color: '#767676',
//                                     margin: '0'
//                                 }}>No activity logs found.</p>
//                             </div>
//                         )}
//                     </div>
//                 )}
//                 {/* ADMIN'S "USER MANAGEMENT" TAB */}
//                 {activeTab === 'users' && user?.role === 'admin' && <UserManagement />}

//             </div>
//         </div>
//     );
// };

// export default DashboardPage;

// frontend/src/pages/DashboardPage.js (Final Version with All Features Integrated)

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import SettingsPage from './SettingsPage';
import './DashboardPage.css';

const DashboardPage = () => {
    const { user, token } = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();

    // This single useEffect hook now fetches the correct data whenever the active tab changes.
    useEffect(() => {
        const fetchDataForTab = async () => {
            // Only fetch data if a data-driven tab is selected.
            if (!user || !['products', 'orders', 'users', 'logs'].includes(activeTab)) {
                setData([]);
                setLoading(false);
                return;
            };

            setLoading(true);
            setError(null);
            let url = '';

            // Determine the correct API endpoint based on the active tab and user role
            if (activeTab === 'orders' && user.role === 'customer') {
                url = 'http://localhost:5001/api/orders/my-orders';
            } else if (activeTab === 'products' && user.role === 'creator') {
                url = 'http://localhost:5001/api/products/my-products';
            } else if (activeTab === 'users' && user.role === 'admin') {
                url = 'http://localhost:5001/api/users'; // Use the new admin route
            } else if (activeTab === 'logs' && user.role === 'admin') {
                url = 'http://localhost:5001/api/logs'; // Use the new admin route
            } else {
                setLoading(false);
                return; // Exit if the role doesn't match the tab
            }

            try {
                const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
                const result = await response.json();
                if (response.ok) {
                    setData(result);
                } else {
                    throw new Error(result.message || 'Failed to fetch data');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDataForTab();
    }, [user, token, activeTab]); // Re-run when the active tab changes

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to permanently delete this product?')) return;
        try {
            const response = await fetch(`http://localhost:5001/api/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Requested-With': 'XMLHttpRequest' // CSRF protection
                },
            });
            if (!response.ok) throw new Error((await response.json()).message);
            setData(prevData => prevData.filter(p => p._id !== productId));
        } catch (err) { setError(err.message); }
    };

    const handleDeleteLog = async (logId) => {
        if (!window.confirm('Are you sure you want to delete this log?')) return;

        try {
            const res = await fetch(`http://localhost:5001/api/logs/${logId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error('Failed to delete log');
            // Optionally re-fetch or filter it out
            setData(prev => prev.filter(log => log._id !== logId));
        } catch (err) {
            alert('Error deleting log: ' + err.message);
        }
    };


    // --- NEW: Function to handle deleting a user (by admin) ---
    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to permanently delete the user: ${userName}? This action cannot be undone.`)) return;
        try {
            const response = await fetch(`http://localhost:5001/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Requested-With': 'XMLHttpRequest' // CSRF protection
                },
            });
            if (!response.ok) throw new Error((await response.json()).message);
            setData(prevData => prevData.filter(u => u._id !== userId));
        } catch (err) { setError(err.message); }
    };

    const handleDownload = async (productId, productName) => {
        if (!productId || !productName) return alert('Product data is missing.');
        try {
            const response = await fetch(`http://localhost:5001/api/products/${productId}/download`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Requested-With': 'XMLHttpRequest' // CSRF protection
                },
            });
            if (!response.ok) throw new Error((await response.json()).message);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const fileExtension = blob.type.split('/')[1] || 'download';
            link.setAttribute('download', `${productName}.${fileExtension}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) { alert(`Error: ${err.message}`); }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Dashboard</h1>
                    <p className="dashboard-subtitle">Welcome back, {user?.name || 'User'}!</p>
                </div>
            </div>

            <div className="dashboard-tabs">
                <button className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Overview</button>
                {user?.role === 'customer' && <button className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>My Orders</button>}
                {user?.role === 'creator' && <button className={`tab-button ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>My Products</button>}

                {/* Admin-only Tabs */}
                {user?.role === 'admin' && (
                    <>
                        <button className={`tab-button ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Manage Users</button>
                        <button className={`tab-button ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>Activity Logs</button>
                    </>
                )}

                <button className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Settings</button>
            </div>

            <div className="dashboard-content">
                {activeTab === 'dashboard' && <div className="overview-card"><h3>Dashboard Overview</h3><p>Use the tabs to manage your account and site activity.</p></div>}
                {activeTab === 'settings' && <SettingsPage />}

                {/* CREATOR'S "MY PRODUCTS" TAB */}
                {activeTab === 'products' && user?.role === 'creator' && (
                    <div className="content-section">
                        <div className="section-header"><h2>My Products</h2><Link to="/create-product" className="primary-button">Create New Product</Link></div>
                        {error && <p className="error-message">{error}</p>}
                        {loading ? <div className="loading-state"><div className="spinner"></div></div> : data.length > 0 ? (
                            <table className="data-table">
                                <thead><tr><th>Product</th><th>Price</th><th>Category</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {data.map(product => (
                                        <tr key={product._id}>
                                            <td><div className="product-info"><img className="product-thumbnail" src={`http://localhost:5001/${product.filePath}`} alt={product.name} /><span>{product.name}</span></div></td>
                                            <td>${product.price.toFixed(2)}</td>
                                            <td><span className="category-badge">{product.category}</span></td>
                                            <td>
                                                <button onClick={() => navigate(`/edit-product/${product._id}`)} className="action-button edit">Edit</button>
                                                <button onClick={() => handleDeleteProduct(product._id)} className="action-button delete">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <div className="empty-state"><p>You have not created any products yet.</p><Link to="/create-product" className="primary-button">Create Your First Product</Link></div>}
                    </div>
                )}

                {/* CUSTOMER'S "MY ORDERS" TAB */}
                {activeTab === 'orders' && user?.role === 'customer' && (
                    <div className="content-section">
                        <h2>My Orders</h2>
                        {error && <p className="error-message">{error}</p>}
                        {loading ? <div className="loading-state"><div className="spinner"></div></div> : data.length > 0 ? (
                            <table className="data-table">
                                <thead><tr><th>Product</th><th>Price</th><th>Date</th><th>Action</th></tr></thead>
                                <tbody>
                                    {data.map(order => (
                                        <tr key={order._id}>
                                            <td><div className="product-info"><img className="product-thumbnail" src={`http://localhost:5001/${order.product?.filePath}`} alt={order.product?.name} /><span>{order.product?.name || 'N/A'}</span></div></td>
                                            <td>${order.price.toFixed(2)}</td>
                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td><button className="primary-button" onClick={() => handleDownload(order.product?._id, order.product?.name)}>Download</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <div className="empty-state"><p>You have no orders yet.</p><Link to="/" className="primary-button">Browse Products</Link></div>}
                    </div>
                )}

                {/* ADMIN'S "USER MANAGEMENT" TAB */}
                {activeTab === 'users' && user?.role === 'admin' && (
                    <div className="content-section">
                        <h2>User Management</h2>
                        {error && <p className="error-message">{error}</p>}
                        {loading ? <div className="loading-state"><div className="spinner"></div></div> : (
                            <table className="data-table">
                                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Verified</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {data.map(u => (
                                        <tr key={u._id}>
                                            <td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{u.isVerified ? 'Yes' : 'No'}</td>
                                            <td><button onClick={() => navigate(`/admin/edit-user/${u._id}`)} className="action-button edit">Edit</button><button onClick={() => handleDeleteUser(u._id, u.name)} className="action-button delete">Delete</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}



                {/* ADMIN'S "ACTIVITY LOGS" TAB - SECURE IMPLEMENTATION */}
                {activeTab === 'logs' && user?.role === 'admin' && (
                    <div className="content-section">
                        <h2>System Activity Logs</h2>
                        {error && <div className="error-message">{error}</div>}
                        {loading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Loading security logs...</p>
                            </div>
                        ) : (
                            <div className="secure-logs-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Timestamp</th>
                                            <th>Severity</th>
                                            <th>Activity</th>
                                            <th>Details</th>
                                            <th>Method</th>
                                            <th>Action</th>


                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map(log => {
                                            // Sanitization function
                                            const anonymizeEmail = (email) => {
                                                if (!email) return null;
                                                const [name, domain] = email.split('@');
                                                return `${name?.substring(0, 2)}***@${domain}`;
                                            };

                                            // Redact sensitive data
                                            const sanitizedDetails = log.details ? {
                                                ...log.details,
                                                ...(log.details.password && { password: '***REDACTED***' }),
                                                ...(log.details.token && { token: '***REDACTED***' }),
                                                ...(log.details.email && { email: anonymizeEmail(log.details.email) }),
                                                ...(log.details.user && { user: '***REDACTED***' })
                                            } : null;

                                            // Severity style mapping
                                            const getLogSeverityStyle = (level) => {
                                                const styles = {
                                                    fatal: { backgroundColor: '#dc3545', color: 'white' },
                                                    error: { backgroundColor: '#ff6b6b', color: 'white' },
                                                    warn: { backgroundColor: '#ffd166', color: '#333' },
                                                    info: { backgroundColor: '#06d6a0', color: 'white' },
                                                    debug: { backgroundColor: '#adb5bd', color: 'white' }
                                                };
                                                return styles[level] || { backgroundColor: '#f8f9fa', color: '#333' };
                                            };

                                            return (
                                                <tr key={log._id || crypto.randomUUID()}>
                                                    <td>{log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'}</td>
                                                    <td>
                                                        <span
                                                            className="status-badge"
                                                            style={getLogSeverityStyle(log.level)}
                                                        >
                                                            {log.level ? log.level.toUpperCase() : 'UNKNOWN'}
                                                        </span>
                                                    </td>
                                                    <td>{log.action || 'N/A'}</td>
                                                    <td>
                                                        <pre className="log-details">
                                                            {sanitizedDetails
                                                                ? JSON.stringify(sanitizedDetails, null, 2)
                                                                : 'No details available'
                                                            }
                                                        </pre>
                                                    </td>
                                                    <td>{log.details?.method || '–'}</td>
                                                    {user?.role === 'admin' && (
                                                        <td>
                                                            <button
                                                                className="btn btn-danger"
                                                                onClick={() => handleDeleteLog(log._id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    )}


                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                <div className="logs-security-note">
                                    <span role="img" aria-label="secure">🔒</span>
                                    <span>All sensitive data has been redacted for security</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;