// routes/orderRoutes.js (NEW SIMPLIFIED VERSION)

const express = require('express');
const router = express.Router();
const { createCheckoutSession, getMyOrders } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

// This file's ONLY job now is to handle creating the checkout session.
router.post('/create-checkout-session', protect, authorize('customer'), createCheckoutSession);
// Add the new route for a customer to get their own orders
router.get('/my-orders', protect, authorize('customer'), getMyOrders);


// The /webhook route has been REMOVED from this file.

module.exports = router;