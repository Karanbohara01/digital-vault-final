// middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');
const { logActivity } = require('../services/logService');

// Limiter for sensitive actions like login and password updates
// Allows 10 requests per 15 minutes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
    handler: (req, res, next, options) => {
        // Log the blocked attempt
        logActivity(null, 'AUTH_RATE_LIMIT_EXCEEDED', 'fatal', { ipAddress: req.ip });
        res.status(options.statusCode).send(options.message);
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


// General limiter for all other API calls
// Allows 100 requests per 15 minutes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    handler: (req, res, next, options) => {
        logActivity(null, 'API_RATE_LIMIT_EXCEEDED', 'error', { ipAddress: req.ip });
        res.status(options.statusCode).send(options.message);
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    authLimiter,
    apiLimiter
};