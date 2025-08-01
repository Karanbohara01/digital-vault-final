// frontend/src/components/dashboard/MyProducts.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const MyProducts = () => {
    const { user, token } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products/my-products', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const data = await response.json();
                if (response.ok) setProducts(data);
            } catch (error) { console.error("Failed to fetch products:", error); }
            finally { setLoading(false); }
        };
        if (token) fetchProducts();
    }, [token]);

    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
    const thStyle = { borderBottom: '2px solid #ccc', padding: '12px', textAlign: 'left', backgroundColor: '#f8f9fa' };
    const tdStyle = { borderBottom: '1px solid #ddd', padding: '12px', textAlign: 'left' };

    if (loading) return <p>Loading your products...</p>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>My Products</h3>
                <Link to="/create-product">Create New Product</Link>
            </div>
            {products.length > 0 ? (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Product Name</th>
                            <th style={thStyle}>Price</th>
                            <th style={thStyle}>Category</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td style={tdStyle}>{product.name}</td>
                                <td style={tdStyle}>${product.price}</td>
                                <td style={tdStyle}>{product.category}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p>You have not created any products yet.</p>}
        </div>
    );
};
export default MyProducts;