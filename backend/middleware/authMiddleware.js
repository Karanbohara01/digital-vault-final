// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check if the request headers contain the authorization token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Get token from header (it comes in the format 'Bearer <token>')
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify the token using our secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);


            req.user = await User.findById(decoded.id).select('-password');

            // --- CHECK FOR PASSWORD EXPIRY ---
            if (req.user && req.user.passwordChangedAt) {
                // Define your policy: password expires after 90 days
                const passwordAgeInDays = (Date.now() - req.user.passwordChangedAt.getTime()) / (1000 * 60 * 60 * 24);
                if (passwordAgeInDays > 90) {
                    return res.status(401).json({ message: 'Your password has expired. Please update it.' });
                }
            }

            // 4. Move on to the next function (the actual route controller)
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
// --- New RBAC Middleware ---
const authorize = (...roles) => {
    return (req, res, next) => {
        // 'req.user' is attached by our 'protect' middleware
        if (!req.user || !roles.includes(req.user.role)) {

            return res.status(403).json({ message: 'Your role is not authorized to access this route' });
        }
        next();
    };
};

const isLoggedIn = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next(); // It does NOT check for password expiry
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect, authorize, isLoggedIn };