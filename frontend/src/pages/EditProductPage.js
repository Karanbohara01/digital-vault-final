

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const EditProductPage = () => {
    const { productId } = useParams(); // Get product ID from the URL
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    // State for form fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');

    // State for loading and feedback
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const categories = ['Photography', 'Digital Art', 'Software', 'Music', 'eBooks', 'Templates', 'Other'];

    // 1. Fetch the existing product data when the page loads
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${productId}`);
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Could not fetch product data.');

                // Pre-fill the form with the fetched data
                setName(data.name);
                setDescription(data.description);
                setPrice(data.price);
                setCategory(data.category);
                // --- NEW: Set the image preview URL ---
                if (data.filePath) {
                    setImagePreviewUrl(`/${data.filePath}`);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    // 2. Handle the form submission to UPDATE the product
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'PUT', // Use PUT for updating
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description, price, category }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update product');

            setSuccess('Product updated successfully! Redirecting to dashboard...');
            setTimeout(() => navigate('/dashboard'), 2000);

        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        border: '2px solid #d1d5db',
                        borderTop: '2px solid black',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '14px',
                        margin: 0
                    }}>Loading product for editing...</p>
                </div>
                <style>
                    {`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}
                </style>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
            {/* Header */}
            <div style={{
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: 'white',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <div style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: '0 16px'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: '64px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <button
                                onClick={() => navigate('/dashboard')}
                                style={{
                                    color: '#6b7280',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    transition: 'color 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.color = 'black'}
                                onMouseOut={(e) => e.target.style.color = '#6b7280'}
                            >
                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h1 style={{
                                fontSize: '20px',
                                fontWeight: '500',
                                color: 'black',
                                margin: 0
                            }}>Edit Product</h1>
                        </div>
                        <button
                            onClick={handleSubmit}
                            style={{
                                backgroundColor: 'black',
                                color: 'white',
                                padding: '8px 24px',
                                borderRadius: '6px',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '500',
                                fontSize: '14px',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#374151'}
                            onMouseOut={(e) => e.target.style.backgroundColor = 'black'}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{
                maxWidth: '1024px',
                margin: '0 auto',
                padding: '32px 16px'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '32px'
                }}>
                    {/* Left Column - Form */}
                    <div style={{ gridColumn: 'span 2' }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            {/* Product Name */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label style={{
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#111827',
                                    margin: 0
                                }}>
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Enter product name"
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        color: '#111827',
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'black';
                                        e.target.style.boxShadow = '0 0 0 2px rgba(0, 0, 0, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#d1d5db';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            {/* Description */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label style={{
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#111827',
                                    margin: 0
                                }}>
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    rows={6}
                                    placeholder="Describe your product..."
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        color: '#111827',
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        resize: 'none',
                                        boxSizing: 'border-box',
                                        fontFamily: 'inherit'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'black';
                                        e.target.style.boxShadow = '0 0 0 2px rgba(0, 0, 0, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#d1d5db';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                                <p style={{
                                    fontSize: '12px',
                                    color: '#6b7280',
                                    margin: 0
                                }}>
                                    Write a compelling description that highlights the key features and benefits of your product.
                                </p>
                            </div>

                            {/* Price and Category Row */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '24px'
                            }}>
                                {/* Price */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <label style={{
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: '#111827',
                                        margin: 0
                                    }}>
                                        Price
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: '16px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#6b7280'
                                        }}>$</span>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            required
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                            style={{
                                                width: '100%',
                                                paddingLeft: '32px',
                                                paddingRight: '16px',
                                                paddingTop: '12px',
                                                paddingBottom: '12px',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '8px',
                                                fontSize: '16px',
                                                color: '#111827',
                                                outline: 'none',
                                                transition: 'all 0.2s',
                                                boxSizing: 'border-box'
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = 'black';
                                                e.target.style.boxShadow = '0 0 0 2px rgba(0, 0, 0, 0.1)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = '#d1d5db';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Category */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <label style={{
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: '#111827',
                                        margin: 0
                                    }}>
                                        Category
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '16px',
                                            color: '#111827',
                                            outline: 'none',
                                            transition: 'all 0.2s',
                                            backgroundColor: 'white',
                                            boxSizing: 'border-box'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = 'black';
                                            e.target.style.boxShadow = '0 0 0 2px rgba(0, 0, 0, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#d1d5db';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right Column - Preview/Info */}
                    <div style={{ gridColumn: 'span 1' }}>
                        <div style={{
                            backgroundColor: '#f9fafb',
                            borderRadius: '8px',
                            padding: '24px',
                            position: 'sticky',
                            top: '96px'
                        }}>
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{
                                    fontSize: '18px',
                                    fontWeight: '500',
                                    color: '#111827',
                                    margin: '0 0 16px 0'
                                }}>Product Preview</h3>
                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    border: '1px solid #e5e7eb'
                                }}>
                                    <div style={{
                                        width: '100%',
                                        height: '128px',
                                        backgroundColor: '#e5e7eb',
                                        borderRadius: '8px',
                                        marginBottom: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {imagePreviewUrl ? (
                                            <img src={imagePreviewUrl} alt="Product Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                        ) : (
                                            <svg width="32" height="32" fill="none" stroke="#9ca3af" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </div>
                                    <h4 style={{
                                        fontWeight: '500',
                                        color: '#111827',
                                        margin: '0 0 4px 0',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>{name || 'Product Name'}</h4>
                                    <p style={{
                                        fontSize: '14px',
                                        color: '#6b7280',
                                        margin: '0 0 12px 0',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>{description || 'Product description will appear here...'}</p>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            color: '#111827'
                                        }}>${price || '0.00'}</span>
                                        <span style={{
                                            fontSize: '12px',
                                            color: '#6b7280',
                                            backgroundColor: '#f3f4f6',
                                            padding: '4px 8px',
                                            borderRadius: '4px'
                                        }}>{category || 'Category'}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                borderTop: '1px solid #e5e7eb',
                                paddingTop: '24px'
                            }}>
                                <h4 style={{
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#111827',
                                    margin: '0 0 12px 0'
                                }}>Tips</h4>
                                <ul style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px'
                                }}>
                                    {[
                                        'Use a clear, descriptive product name',
                                        'Write a detailed description highlighting key features',
                                        'Set a competitive price for your market',
                                        'Choose the most relevant category'
                                    ].map((tip, index) => (
                                        <li key={index} style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '8px',
                                            fontSize: '12px',
                                            color: '#6b7280'
                                        }}>
                                            <span style={{
                                                width: '4px',
                                                height: '4px',
                                                backgroundColor: '#9ca3af',
                                                borderRadius: '50%',
                                                marginTop: '8px',
                                                flexShrink: 0
                                            }}></span>
                                            <span>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Save Button */}
                <div style={{
                    marginTop: '32px',
                    display: 'block'
                }}>
                    <button
                        onClick={handleSubmit}
                        style={{
                            width: '100%',
                            backgroundColor: 'black',
                            color: 'white',
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: '500',
                            fontSize: '16px',
                            transition: 'background-color 0.2s',
                            display: 'none'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#374151'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'black'}
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Toast Messages */}
            {(error || success) && (
                <div style={{
                    position: 'fixed',
                    bottom: '16px',
                    right: '16px',
                    zIndex: 50
                }}>
                    {error && (
                        <div style={{
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#991b1b',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            maxWidth: '300px'
                        }}>
                            <svg width="20" height="20" fill="none" stroke="#ef4444" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span style={{ fontSize: '14px' }}>{error}</span>
                        </div>
                    )}
                    {success && (
                        <div style={{
                            backgroundColor: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            color: '#166534',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            maxWidth: '300px'
                        }}>
                            <svg width="20" height="20" fill="none" stroke="#22c55e" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span style={{ fontSize: '14px' }}>{success}</span>
                        </div>
                    )}
                </div>
            )}

            <style>
                {`
                    @media (max-width: 1024px) {
                        .grid-container {
                            grid-template-columns: 1fr !important;
                        }
                        .mobile-save-button {
                            display: block !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default EditProductPage;