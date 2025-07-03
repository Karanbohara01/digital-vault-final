// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { registerUser, deleteUserByAdmin, getUserById, updateUserByAdmin, loginUser, getUserProfile, creatorDashboard, updatePassword, mfaSetup, mfaVerify, mfaLoginVerify, forgotPassword, resetPassword, mfaRecover, verifyEmail, getUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware'); // 1. Import the protect middleware
const { authLimiter } = require('../middleware/rateLimiter'); // 1. Import the limiter

// Define the registration route
// When a POST request is made to '/register', the registerUser function will be called
router.post('/register', authLimiter, registerUser);
// Define the login route
// When a POST request is made to '/login', the loginUser function will be called
router.post('/login', authLimiter, loginUser);
// Private route - This is how you protect a route
// The request will first go through 'protect', and if the token is valid, it will then go to 'getUserProfile'
router.get('/profile', protect, getUserProfile); // 2. Add the protected route
// Creator-only route
router.get('/creator-dashboard', protect, authorize('creator'), creatorDashboard); // 3. Add the creator-only route
router.patch('/update-password', protect, updatePassword);
router.post('/mfa/setup', protect, mfaSetup);
router.post('/mfa/verify', protect, mfaVerify);
router.post('/mfa/login-verify', mfaLoginVerify);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/mfa/recover', mfaRecover);
router.get('/verify-email/:token', verifyEmail);
router.get('/', protect, authorize('admin'), getUsers); // ✅ directly handles /api/users
router.get('/:id', protect, authorize('admin'), getUserById); // <-- ADD THIS



// In backend/routes/userRoutes.js

// ... your route for '/' ...

// Add the new route for an admin to update or delete a user
router.route('/:id')
    .delete(protect, authorize('admin'), deleteUserByAdmin) // <-- Add this line
    .put(protect, authorize('admin'), updateUserByAdmin); // <-- Add this line

// router.delete('/:id', protect, authorize('admin'), deleteUserByAdmin); // Delete user by admin
// router.put('/:id', protect, authorize('admin'), updateUserByAdmin); // Update user
module.exports = router;
