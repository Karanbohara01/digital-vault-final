

// import React, { useState, useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';

// const CreateProductPage = () => {
//     // State for text fields
//     const [name, setName] = useState('');
//     const [description, setDescription] = useState('');
//     const [price, setPrice] = useState('');
//     const categories = ['Photography', 'Digital Art', 'Software', 'Music', 'eBooks', 'Templates', 'Other'];

//     const [category, setCategory] = useState(categories[0]); // Default to the first category


//     // --- NEW: State to hold the selected image FILE ---
//     const [image, setImage] = useState(null);

//     // State for feedback
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(null);

//     const { token } = useContext(AuthContext);

//     // --- NEW: Handler to update the image state ---
//     const handleImageChange = (e) => {
//         // e.target.files is an array of files, we want the first one
//         setImage(e.target.files[0]);
//     };

//     // In frontend/src/pages/DashboardPage.js





//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);
//         setSuccess(null);

//         if (!image) {
//             setError('Please select an image file to upload.');
//             return;
//         }

//         // --- NEW: We must use FormData to send files ---
//         const formData = new FormData();
//         formData.append('name', name);
//         formData.append('description', description);
//         formData.append('price', price);
//         formData.append('category', category);
//         formData.append('image', image); // The key 'image' must match the backend route

//         try {
//             const response = await fetch('http://localhost:5001/api/products', {
//                 method: 'POST',
//                 headers: {
//                     // IMPORTANT: DO NOT set the 'Content-Type' header.
//                     // The browser will automatically set it to 'multipart/form-data'
//                     // with the correct boundary when you send a FormData object.
//                     'Authorization': `Bearer ${token}`,
//                 },
//                 body: formData, // Send the FormData object as the body
//             });

//             const data = await response.json();
//             if (!response.ok) {
//                 throw new Error(data.message || 'Failed to create product');
//             }

//             setSuccess(`Product "${data.name}" created successfully!`);
//             // You can add logic here to clear the form if you wish

//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     return (
//         <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
//             <h2>Create a New Product</h2>
//             <form onSubmit={handleSubmit}>
//                 {/* The text input fields remain the same */}
//                 <div style={{ marginBottom: '1rem' }}>
//                     <label>Product Name:</label><br />
//                     <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '98%' }} />
//                 </div>
//                 <div style={{ marginBottom: '1rem' }}>
//                     <label>Description:</label><br />
//                     <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={{ width: '98%', minHeight: '80px' }} />
//                 </div>
//                 <div style={{ marginBottom: '1rem' }}>
//                     <label>Price ($):</label><br />
//                     <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required style={{ width: '98%' }} />
//                 </div>

//                 <div style={{ marginBottom: '1rem' }}>
//                     <label>Category:</label><br />
//                     <select
//                         value={category}
//                         onChange={(e) => setCategory(e.target.value)}
//                         required
//                         style={{ width: '100%', padding: '8px' }} // Adjusted width for consistency
//                     >
//                         {categories.map((cat) => (
//                             <option key={cat} value={cat}>
//                                 {cat}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* --- NEW: Change the text input for file path to a file input --- */}
//                 <div style={{ marginBottom: '1rem' }}>
//                     <label>Product Image:</label><br />
//                     <input type="file" onChange={handleImageChange} required accept="image/*" />
//                 </div>

//                 <button type="submit">Create Product</button>
//             </form>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//             {success && <p style={{ color: 'green' }}>{success}</p>}
//         </div>
//     );
// };

// export default CreateProductPage;


import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Upload, X, Check, AlertCircle, Camera, DollarSign, FileText, Tag } from 'lucide-react';

const CreateProductPage = () => {
    // State for text fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const categories = ['Photography', 'Digital Art', 'Software', 'Music', 'eBooks', 'Templates', 'Other'];
    const [category, setCategory] = useState(categories[0]);

    // State to hold the selected image FILE
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // State for feedback
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Handle file selection
    const handleImageChange = (file) => {
        if (file && file.type.startsWith('image/')) {
            setImage(file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
            setError(null);
        } else {
            setError('Please select a valid image file');
        }
    };

    // Handle file input change
    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) handleImageChange(file);
    };

    // Handle drag and drop
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleImageChange(file);
    };

    // Remove selected image
    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        if (!image) {
            setError('Please select an image file to upload.');
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('image', image);

        try {
            const response = await fetch('http://localhost:5001/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create product');
            }

            setSuccess(`Product "${data.name}" created successfully!`);

            // Navigate to marketplace after a short delay
            setTimeout(() => {
                navigate('/marketplace');
            }, 1500);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const containerStyle = {
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '3rem 1rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    };

    const mainContainerStyle = {
        maxWidth: '1000px',
        margin: '0 auto'
    };

    const headerStyle = {
        textAlign: 'center',
        marginBottom: '3rem'
    };

    const titleStyle = {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: '1rem',
        margin: '0'
    };

    const subtitleStyle = {
        fontSize: '1.125rem',
        color: '#666',
        margin: '0'
    };

    const cardStyle = {
        backgroundColor: 'white',
        borderRadius: '1rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden'
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0'
    };

    const uploadSectionStyle = {
        padding: '2rem',
        backgroundColor: '#f8fafc',
        borderRight: '1px solid #e2e8f0'
    };

    const sectionTitleStyle = {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    };

    const dropZoneStyle = {
        border: `2px dashed ${isDragging ? '#3b82f6' : '#cbd5e1'}`,
        borderRadius: '0.75rem',
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: isDragging ? '#eff6ff' : 'white',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
    };

    const dropZoneContentStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    };

    const uploadIconStyle = {
        width: '3rem',
        height: '3rem',
        color: '#9ca3af',
        marginBottom: '1rem'
    };

    const dropZoneTitleStyle = {
        fontSize: '1.125rem',
        fontWeight: '500',
        color: '#1a1a1a',
        marginBottom: '0.5rem'
    };

    const dropZoneSubtitleStyle = {
        fontSize: '0.875rem',
        color: '#6b7280',
        marginBottom: '1rem'
    };

    const uploadButtonStyle = {
        backgroundColor: '#000',
        color: 'white',
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        border: 'none',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
    };

    const previewContainerStyle = {
        position: 'relative'
    };

    const previewImageStyle = {
        width: '100%',
        height: '16rem',
        objectFit: 'cover',
        borderRadius: '0.75rem'
    };

    const removeButtonStyle = {
        position: 'absolute',
        top: '0.5rem',
        right: '0.5rem',
        backgroundColor: '#ef4444',
        color: 'white',
        padding: '0.5rem',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s ease'
    };

    const fileNameStyle = {
        position: 'absolute',
        bottom: '0.5rem',
        left: '0.5rem',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '0.25rem 0.75rem',
        borderRadius: '0.5rem',
        fontSize: '0.875rem'
    };

    const formSectionStyle = {
        padding: '2rem'
    };

    const formGroupStyle = {
        marginBottom: '1.5rem'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '0.5rem'
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem 1rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box'
    };

    const textareaStyle = {
        ...inputStyle,
        minHeight: '100px',
        resize: 'vertical'
    };

    const gridInputStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem'
    };

    const footerStyle = {
        padding: '1.5rem 2rem',
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #e2e8f0'
    };

    const messageStyle = {
        padding: '1rem',
        borderRadius: '0.5rem',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    };

    const errorStyle = {
        ...messageStyle,
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        color: '#b91c1c'
    };

    const successStyle = {
        ...messageStyle,
        backgroundColor: '#f0fdf4',
        border: '1px solid #bbf7d0',
        color: '#166534'
    };

    const submitButtonStyle = {
        backgroundColor: isLoading ? '#6b7280' : '#000',
        color: 'white',
        padding: '0.75rem 2rem',
        borderRadius: '0.5rem',
        border: 'none',
        fontWeight: '500',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '1rem'
    };

    const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'flex-end'
    };

    const spinnerStyle = {
        width: '1rem',
        height: '1rem',
        border: '2px solid white',
        borderTop: '2px solid transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    };

    return (
        <div style={containerStyle}>
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    .upload-button:hover {
                        background-color: #1f2937 !important;
                    }
                    .remove-button:hover {
                        background-color: #dc2626 !important;
                    }
                    .submit-button:hover:not(:disabled) {
                        background-color: #1f2937 !important;
                    }
                    .form-input:focus {
                        outline: none;
                        border-color: #3b82f6;
                        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                    }
                    @media (max-width: 768px) {
                        .grid-container {
                            grid-template-columns: 1fr !important;
                        }
                        .upload-section {
                            border-right: none !important;
                            border-bottom: 1px solid #e2e8f0;
                        }
                        .grid-inputs {
                            grid-template-columns: 1fr !important;
                        }
                    }
                `}
            </style>

            <div style={mainContainerStyle}>
                {/* Header */}
                <div style={headerStyle}>
                    <h1 style={titleStyle}>Share Your Work</h1>
                    <p style={subtitleStyle}>Upload and sell your creative content to the world</p>
                </div>

                <div style={cardStyle}>
                    <div style={gridStyle} className="grid-container">
                        {/* Image Upload Section */}
                        <div style={uploadSectionStyle} className="upload-section">
                            <h3 style={sectionTitleStyle}>
                                <Camera size={20} />
                                Upload Image
                            </h3>

                            {!imagePreview ? (
                                <div
                                    style={dropZoneStyle}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        onChange={handleFileInputChange}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                    />

                                    <div style={dropZoneContentStyle}>
                                        <Upload style={uploadIconStyle} />
                                        <h4 style={dropZoneTitleStyle}>
                                            Drop your image here
                                        </h4>
                                        <p style={dropZoneSubtitleStyle}>
                                            or click to browse
                                        </p>
                                        <button
                                            type="button"
                                            style={uploadButtonStyle}
                                            className="upload-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                fileInputRef.current?.click();
                                            }}
                                        >
                                            Choose File
                                        </button>
                                        <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '1rem', margin: '1rem 0 0 0' }}>
                                            Supports: JPG, PNG, GIF up to 10MB
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div style={previewContainerStyle}>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={previewImageStyle}
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        style={removeButtonStyle}
                                        className="remove-button"
                                    >
                                        <X size={16} />
                                    </button>
                                    <div style={fileNameStyle}>
                                        {image?.name}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Form Section */}
                        <div style={formSectionStyle}>
                            <h3 style={sectionTitleStyle}>
                                <FileText size={20} />
                                Product Details
                            </h3>

                            {/* Product Name */}
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    style={inputStyle}
                                    className="form-input"
                                    placeholder="Enter product name"
                                />
                            </div>

                            {/* Description */}
                            <div style={formGroupStyle}>
                                <label style={labelStyle}>
                                    Description *
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    style={textareaStyle}
                                    className="form-input"
                                    placeholder="Describe your product..."
                                />
                            </div>

                            {/* Price and Category */}
                            <div style={gridInputStyle} className="grid-inputs">
                                <div>
                                    <label style={labelStyle}>
                                        <DollarSign size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                        Price *
                                    </label>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                        min="0"
                                        step="0.01"
                                        style={inputStyle}
                                        className="form-input"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>
                                        <Tag size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                                        Category *
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                        style={inputStyle}
                                        className="form-input"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={footerStyle}>
                        {/* Error/Success Messages */}
                        {error && (
                            <div style={errorStyle}>
                                <AlertCircle size={20} />
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div style={successStyle}>
                                <Check size={20} />
                                <span>{success}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div style={buttonContainerStyle}>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                style={submitButtonStyle}
                                className="submit-button"
                            >
                                {isLoading ? (
                                    <>
                                        <div style={spinnerStyle}></div>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={16} />
                                        Create Product
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProductPage;