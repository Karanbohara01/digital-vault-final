// server.js (FINAL CORRECTED VERSION)

const express = require('express');
const dotenv = require('dotenv');
const { apiLimiter } = require('./middleware/rateLimiter'); // 1. Import the limiter
const cors = require('cors');
const helmet = require('helmet');
const hotlinkProtect = require('./middleware/hotlinkProtection');
// const mongoSanitize = require('express-mongo-sanitize'); // 1. Import the package
// const mongoSanitize = require('express-mongo-sanitize'); // Import the package
const logRoutes = require('./routes/logRoutes'); // 1. Import log routes

const sanitizeRequest = require('./middleware/sanitizeBody');
const testRoutes = require('./routes/testRoutes');



dotenv.config();

// --- We only need to import the CONTROLLER for the webhook here ---
const { handleStripeWebhook, getMyOrders } = require('./controllers/orderController');

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes'); // This is the simplified router from Step 1
const path = require('path');


const app = express();
// app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/uploads', hotlinkProtect, express.static(path.join(__dirname, '/uploads')));
app.use(cors());
app.use(sanitizeRequest);
app.use('/api/test', testRoutes);


app.use(helmet());
app.set('trust proxy', 1);
connectDB();

// <<<< THE FIX - PART 1 >>>>
// The Stripe webhook route is defined here, BEFORE any JSON parsing middleware.
// It uses express.raw() to ensure we get the raw body Stripe requires.
app.post('/api/orders/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);


// <<<< THE FIX - PART 2 >>>>
// NOW, we can safely set up the JSON parser for all OTHER routes.
app.use(express.json());
// app.use(mongoSanitize({
//     replaceWith: '_' // Replaces prohibited characters with an underscore
// }));

app.use(sanitizeRequest);


// Mount the rest of the routers that need JSON parsing
app.get('/', (req, res) => {
    res.send('Welcome to Digital Vault API!');
});
app.use('/api', apiLimiter); // 2. Add this line

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); // This handles '/create-checkout-session'
app.use('/api/logs', logRoutes); // 2. Mount the new log routes




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});