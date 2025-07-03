// models/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // Reference to the user who placed the order
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    // Reference to the product that was purchased
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
    },
    // We store the price at the time of purchase
    // This is important in case the product price changes later
    price: {
        type: Number,
        required: true,
    },
    // We will store payment information from Stripe here later
    paymentInfo: {
        id: { type: String },
        status: { type: String },
    },
    // The status of the order itself
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;