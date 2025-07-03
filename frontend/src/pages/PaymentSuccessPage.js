// frontend/src/pages/PaymentSuccessPage.js

import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const PaymentSuccessPage = () => {
    // useSearchParams is a hook to read URL query parameters
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    // You can use the session_id to fetch order details if you want,
    // but for now, we'll just show a success message.
    // The webhook has already handled creating the order in the database.

    useEffect(() => {
        if (sessionId) {
            console.log('Payment successful for session:', sessionId);
            // Here you could potentially fetch order details using the session ID
            // to display to the user, but it's not strictly necessary as the
            // webhook has already secured the order details in the backend.
        }
    }, [sessionId]);

    return (
        <div style={{ textAlign: 'center', margin: '4rem auto' }}>
            <h2>Payment Successful!</h2>
            <p>Thank you for your purchase.</p>
            <p>Your order has been processed and you will receive a confirmation shortly.</p>
            <br />
            <Link to="/dashboard" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
                Go to Your Dashboard
            </Link>
        </div>
    );
};

export default PaymentSuccessPage;