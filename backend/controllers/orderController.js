

const Order = require('../models/Order');
const Product = require('../models/Product');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { logActivity } = require('../services/logService');

const fulfillOrder = async (session) => {
    try {
        const { userId, productId } = session.metadata;
        const product = await Product.findById(productId);
        if (!product) {
            await logActivity(userId, 'ORDER_FULFILL_FAIL', 'error', {
                productId,
                reason: 'Product not found',
                paymentIntentId: session.payment_intent,
            });
            return console.error(`Webhook Error: Product not found with ID ${productId}`);
        }

        const newOrder = new Order({
            user: userId,
            product: productId,
            price: product.price,
            paymentInfo: {
                id: session.payment_intent,
                status: session.payment_status,
            },
            status: 'completed',
        });

        await newOrder.save();

        await logActivity(userId, 'ORDER_FULFILL_SUCCESS', 'info', {
            orderId: newOrder._id,
            productId: newOrder.product,
            paymentIntentId: session.payment_intent,
            method: 'webhook',
        });

        console.log('✅ Order fulfilled:', newOrder._id);
    } catch (error) {
        console.error('❌ Fulfill Order Error:', error.message);
        await logActivity(null, 'ORDER_FULFILL_CRASH', 'error', {
            error: error.message,
            stack: error.stack,
            method: 'webhook',
        });
    }
};


const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('product', 'name price');

        await logActivity(req.user._id, 'GET_MY_ORDERS', 'info', {
            count: orders.length,
            method: req.method,
        });

        res.json(orders);
    } catch (error) {
        console.error('Get Orders Error:', error.message);
        await logActivity(req.user._id, 'GET_MY_ORDERS_FAIL', 'error', {
            error: error.message,
            method: req.method,
        });
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


const createCheckoutSession = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await Product.findById(productId);

        if (!product) {
            await logActivity(req.user._id, 'CHECKOUT_SESSION_FAIL', 'warn', {
                productId,
                reason: 'Product not found',
                method: req.method,
            });
            return res.status(404).json({ message: 'Product not found' });
        }

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

        await logActivity(req.user._id, 'CHECKOUT_SESSION_CREATED', 'info', {
            productId,
            stripeSessionId: session.id,
            method: req.method,
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Checkout Session Error:', error.message);
        await logActivity(req.user._id, 'CHECKOUT_SESSION_ERROR', 'error', {
            error: error.message,
            method: req.method,
        });
        res.status(500).json({ message: 'Server Error creating checkout session', error: error.message });
    }
};


const handleStripeWebhook = (req, res) => {
    const signature = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
    } catch (err) {
        console.error(' Stripe Signature Verification Failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log(' Stripe checkout.session.completed received:', session.id);
        fulfillOrder(session);
    } else {
        console.log(`Unhandled webhook event type: ${event.type}`);
    }

    res.status(200).send();
};

module.exports = {
    createCheckoutSession,
    handleStripeWebhook,
    getMyOrders,
};
