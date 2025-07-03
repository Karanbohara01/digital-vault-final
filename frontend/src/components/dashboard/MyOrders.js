// frontend/src/components/dashboard/MyOrders.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const MyOrders = () => {
    const { user, token } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/orders/my-orders', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const data = await response.json();
                if (response.ok) setOrders(data);
            } catch (error) { console.error("Failed to fetch orders:", error); }
            finally { setLoading(false); }
        };
        if (token) fetchOrders();
    }, [token]);

    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' };
    const thStyle = { borderBottom: '2px solid #ccc', padding: '12px', textAlign: 'left', backgroundColor: '#f8f9fa' };
    const tdStyle = { borderBottom: '1px solid #ddd', padding: '12px', textAlign: 'left' };

    if (loading) return <p>Loading your orders...</p>;

    return (
        <div>
            <h3>My Order History</h3>
            {orders.length > 0 ? (
                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Product Purchased</th>
                            <th style={thStyle}>Price</th>
                            <th style={thStyle}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td style={tdStyle}>{order.product ? order.product.name : 'Product not found'}</td>
                                <td style={tdStyle}>${order.price}</td>
                                <td style={tdStyle}>{new Date(order.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p>You have not made any purchases yet.</p>}
        </div>
    );
};
export default MyOrders;