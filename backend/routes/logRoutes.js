// backend/routes/logRoutes.js

const express = require('express');
const router = express.Router();
const { getAllLogs } = require('../controllers/logController');
const { protect, authorize } = require('../middleware/authMiddleware');

// This route is protected and can only be accessed by an admin
router.route('/').get(protect, authorize('admin'), getAllLogs);

module.exports = router;