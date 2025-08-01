

const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
const { apiLimiter } = require('./middleware/rateLimiter');
const hotlinkProtect = require('./middleware/hotlinkProtection');
const sanitizeRequest = require('./middleware/sanitizeBody');

dotenv.config();

// Import controllers and route files
const connectDB = require('./config/db');
const { handleStripeWebhook } = require('./controllers/orderController');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const logRoutes = require('./routes/logRoutes');

// Load your SSL certificate files
const options = {
    key: fs.readFileSync(path.join(__dirname, 'certificate/server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'certificate/server.crt')),
};

// Initialize Express App
const app = express();

// Connect to Database
connectDB();

// --- GLOBAL MIDDLEWARE SETUP (Order is crucial) ---

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.set('trust proxy', 1);

// Stripe Webhook Endpoint (must come BEFORE express.json())
app.post('/api/orders/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Body Parser Middleware - THIS IS THE FIX
// This line MUST come before your routes to parse JSON bodies.
app.use(express.json());

// Custom Data Sanitization
app.use(sanitizeRequest);

// Static Folder for Public Uploads
app.use('/uploads', hotlinkProtect, express.static(path.join(__dirname, '/uploads')));

// Apply Global Rate Limiter
app.use('/api', apiLimiter);


// --- API ROUTE MOUNTING ---
app.get('/', (req, res) => {
    res.send('Welcome to Digital Vault Secure API!');
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/logs', logRoutes);


// --- SERVER LISTENER ---
const PORT = process.env.PORT || 5001;

https.createServer(options, app).listen(PORT, () => {
    console.log(`✅ Secure HTTPS Server is running on https://localhost:${PORT}`);
});