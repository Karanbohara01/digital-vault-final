// // // server.js (FINAL CORRECTED VERSION)

// // const express = require('express');
// // const dotenv = require('dotenv');
// // const { apiLimiter } = require('./middleware/rateLimiter'); // 1. Import the limiter
// // const cors = require('cors');
// // const helmet = require('helmet');
// // const hotlinkProtect = require('./middleware/hotlinkProtection');
// // // const mongoSanitize = require('express-mongo-sanitize'); // 1. Import the package
// // // const mongoSanitize = require('express-mongo-sanitize'); // Import the package
// // const logRoutes = require('./routes/logRoutes'); // 1. Import log routes

// // const sanitizeRequest = require('./middleware/sanitizeBody');
// // const testRoutes = require('./routes/testRoutes');



// // dotenv.config();

// // // --- We only need to import the CONTROLLER for the webhook here ---
// // const { handleStripeWebhook, getMyOrders } = require('./controllers/orderController');

// // const connectDB = require('./config/db');
// // const userRoutes = require('./routes/userRoutes');
// // const productRoutes = require('./routes/productRoutes');
// // const orderRoutes = require('./routes/orderRoutes'); // This is the simplified router from Step 1
// // const path = require('path');


// // const app = express();
// // // app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
// // app.use('/uploads', hotlinkProtect, express.static(path.join(__dirname, '/uploads')));
// // app.use(cors());
// // app.use(sanitizeRequest);
// // app.use('/api/test', testRoutes);


// // app.use(helmet());
// // app.set('trust proxy', 1);
// // connectDB();

// // // <<<< THE FIX - PART 1 >>>>
// // // The Stripe webhook route is defined here, BEFORE any JSON parsing middleware.
// // // It uses express.raw() to ensure we get the raw body Stripe requires.
// // app.post('/api/orders/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);


// // // <<<< THE FIX - PART 2 >>>>
// // // NOW, we can safely set up the JSON parser for all OTHER routes.
// // app.use(express.json());
// // // app.use(mongoSanitize({
// // //     replaceWith: '_' // Replaces prohibited characters with an underscore
// // // }));

// // app.use(sanitizeRequest);


// // // Mount the rest of the routers that need JSON parsing
// // app.get('/', (req, res) => {
// //     res.send('Welcome to Digital Vault API!');
// // });
// // app.use('/api', apiLimiter); // 2. Add this line

// // app.use('/api/users', userRoutes);
// // app.use('/api/products', productRoutes);
// // app.use('/api/orders', orderRoutes); // This handles '/create-checkout-session'
// // app.use('/api/logs', logRoutes); // 2. Mount the new log routes




// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => {
// //     console.log(`Server is running on http://localhost:${PORT}`);
// // });

// // backend/server.js (Final Corrected Version)

// // const path = require('path');
// // const express = require('express');
// // const dotenv = require('dotenv');
// // const cors = require('cors');
// // const helmet = require('helmet');
// // const https = require('https'); // For the secure server
// // const fs = require('fs');       // To read the certificate files
// // const { apiLimiter } = require('./middleware/rateLimiter');
// // const hotlinkProtect = require('./middleware/hotlinkProtection');
// // const sanitizeRequest = require('./middleware/sanitizeBody'); // Your custom sanitizer

// // // Load environment variables at the very top
// // dotenv.config();

// // // Import controllers and route files
// // const connectDB = require('./config/db');
// // const { handleStripeWebhook } = require('./controllers/orderController');
// // const userRoutes = require('./routes/userRoutes');
// // const productRoutes = require('./routes/productRoutes');
// // const orderRoutes = require('./routes/orderRoutes');
// // const logRoutes = require('./routes/logRoutes');

// // const corsOptions = {
// //     origin: process.env.FRONTEND_URL, // Only allow requests from your React app
// //     credentials: true,
// // };

// // // Load your SSL certificate files
// // const options = {
// //     key: fs.readFileSync(path.join(__dirname, 'certificate/server.key')),
// //     cert: fs.readFileSync(path.join(__dirname, 'certificate/server.crt')),
// // };

// // // Initialize Express App
// // const app = express();


// // app.use(cors(corsOptions));

// // // Connect to Database
// // connectDB();

// // // --- GLOBAL MIDDLEWARE SETUP (Order is crucial) ---

// // // 1. Set security HTTP headers
// // app.use(helmet());

// // // 2. Enable CORS
// // app.use(cors());

// // // 3. Trust proxy to get correct IP for rate limiting
// // app.set('trust proxy', 1);

// // // 4. Stripe Webhook Endpoint
// // // This MUST come BEFORE express.json() to receive the raw request body.
// // app.post('/api/orders/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// // // 5. Body Parser Middleware
// // // This parses JSON for all other routes.
// // app.use(express.json());

// // // 6. Custom Data Sanitization against NoSQL Injection
// // // This must come AFTER the JSON parser so it has a body to sanitize.
// // app.use(sanitizeRequest);

// // // 7. Static Folder for Public Uploads (Protected by hotlinking)
// // app.use('/uploads', hotlinkProtect, express.static(path.join(__dirname, '/uploads')));

// // // 8. Apply Global Rate Limiter to all API routes
// // app.use('/api', apiLimiter);


// // // --- API ROUTE MOUNTING ---
// // app.get('/', (req, res) => {
// //     res.send('Welcome to Digital Vault Secure API!');
// // });

// // app.use('/api/users', userRoutes);
// // app.use('/api/products', productRoutes);
// // app.use('/api/orders', orderRoutes);
// // app.use('/api/logs', logRoutes);


// // // --- SERVER LISTENER ---
// // const PORT = process.env.PORT || 5001;

// // // 9. Create and start the HTTPS server
// // https.createServer(options, app).listen(PORT, () => {
// //     console.log(`✅ Secure HTTPS Server is running on https://localhost:${PORT}`);
// // });


// // backend/server.js (Final Corrected Version)

// const path = require('path');
// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const helmet = require('helmet');
// const https = require('https'); // For the secure server
// const fs = require('fs');       // To read the certificate files
// const { apiLimiter } = require('./middleware/rateLimiter');
// const hotlinkProtect = require('./middleware/hotlinkProtection');
// const sanitizeRequest = require('./middleware/sanitizeBody'); // Your custom sanitizer

// // Load environment variables at the very top
// dotenv.config();

// // Import controllers and route files
// const connectDB = require('./config/db');
// const { handleStripeWebhook } = require('./controllers/orderController');
// const userRoutes = require('./routes/userRoutes');
// const productRoutes = require('./routes/productRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const logRoutes = require('./routes/logRoutes');

// // Load your SSL certificate files
// const options = {
//     key: fs.readFileSync(path.join(__dirname, 'certificate/server.key')),
//     cert: fs.readFileSync(path.join(__dirname, 'certificate/server.crt')),
// };

// // Initialize Express App
// const app = express();

// // Connect to Database
// connectDB();

// // --- GLOBAL MIDDLEWARE SETUP (Order is crucial) ---

// // 1. Set security HTTP headers
// // app.use(helmet());
// app.use(
//     helmet({
//         crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin requests
//     })
// );

// // 2. Enable CORS with specific options
// const corsOptions = {
//     origin: process.env.FRONTEND_URL, // Only allow requests from your React app
//     credentials: true,
// };

// app.use(cors(corsOptions));

// // 3. Trust proxy to get correct IP for rate limiting
// app.set('trust proxy', 1);

// // 4. Stripe Webhook Endpoint
// // This MUST come BEFORE express.json() to receive the raw request body.
// app.post('/api/orders/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// // 5. Body Parser Middleware
// // This parses JSON for all other routes.
// app.use(express.json());

// // 6. Custom Data Sanitization against NoSQL Injection
// // This must come AFTER the JSON parser so it has a body to sanitize.
// app.use(sanitizeRequest);

// // 7. Static Folder for Public Uploads (Protected by hotlinking)
// app.use('/uploads', hotlinkProtect, express.static(path.join(__dirname, '/uploads')));

// // 8. Apply Global Rate Limiter to all API routes
// app.use('/api', apiLimiter);


// // --- API ROUTE MOUNTING ---
// app.get('/', (req, res) => {
//     res.send('Welcome to Digital Vault Secure API!');
// });

// app.use('/api/users', userRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/logs', logRoutes);


// // --- SERVER LISTENER ---
// const PORT = process.env.PORT || 5001;

// // 9. Create and start the HTTPS server
// https.createServer(options, app).listen(PORT, () => {
//     console.log(`✅ Secure HTTPS Server is running on https://localhost:${PORT}`);
// });

// backend/server.js (Final Corrected Version)

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