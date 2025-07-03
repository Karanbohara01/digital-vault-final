// controllers/orderController.js (Final Correct Version)

const Order = require('../models/Order');
const Product = require('../models/Product');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { logActivity } = require('../services/logService'); // Add this line


// --- HELPER FUNCTION: This is called ONLY by the webhook after successful payment ---
const fulfillOrder = async (session) => {
    try {
        const { userId, productId } = session.metadata;
        const product = await Product.findById(productId);
        if (!product) {
            return console.error(`Webhook Error: Product not found with ID ${productId}`);
        }
        // This is where the order is created for the FIRST time.
        const newOrder = new Order({
            user: userId,
            product: productId,
            price: product.price,
            paymentInfo: {
                id: session.payment_intent,
                status: session.payment_status,
            },
            status: 'completed', // Status is set directly to 'completed'
        });
        await newOrder.save();
        console.log('Order fulfilled and saved to DB:', newOrder._id);
        // <<< LOG ORDER FULFILLMENT >>>
        await logActivity(newOrder.user, 'ORDER_FULFILL_SUCCESS', 'info', {
            orderId: newOrder._id,
            productId: newOrder.product,
            paymentIntentId: session.payment_intent // Log the Stripe payment ID
        });
    } catch (error) {
        console.error('Error fulfilling order:', error);
    }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private/Customer
const getMyOrders = async (req, res) => {
    try {
        // Find orders that belong to the user ID from the token
        // Also populate the 'product' field with its name and price
        const orders = await Order.find({ user: req.user._id }).populate('product', 'name price');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// --- CONTROLLER #1: Its ONLY job is to create a Stripe session ---
const createCheckoutSession = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // This function should NOT create a 'pending' order. It only talks to Stripe.
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { name: product.name },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: 1,
            }],
            success_url: `http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/payment-cancelled`,
            metadata: {
                userId: req.user._id.toString(),
                productId: product._id.toString(),
            }
        });
        res.status(200).json({ url: session.url });
    } catch (error) {
        res.status(500).json({ message: 'Server Error creating checkout session', error: error.message });
    }
};

// --- CONTROLLER FOR HANDLING THE WEBHOOK (DEBUGGING VERSION) ---
const handleStripeWebhook = (req, res) => {
    const signature = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // --- DEEPER DEBUGGING LOGS ---
    console.log('--- A WEBHOOK EVENT WAS RECEIVED ---');
    console.log('Signature from Stripe header:', signature);
    console.log('Webhook Secret from .env file:', endpointSecret);
    console.log('Is the request body a Buffer?', Buffer.isBuffer(req.body));
    // --- END DEBUGGING LOGS ---

    let event;

    try {
        // The line that is likely failing
        event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
    } catch (err) {
        // Log the exact error message from Stripe's library
        console.error('❌ Webhook signature verification failed!', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // If verification succeeds, handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log('✅ Webhook signature verified. Checkout session was successful!', session.id);
        fulfillOrder(session);
    } else {
        console.log(`Unhandled event type ${event.type}`);
    }

    // Acknowledge receipt of the event
    res.status(200).send();
};


module.exports = {
    createCheckoutSession,
    handleStripeWebhook,
    getMyOrders,
};