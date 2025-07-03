// // backend/routes/logRoutes.js

// const express = require('express');
// const router = express.Router();
// const { getAllLogs } = require('../controllers/logController');
// const { protect, authorize } = require('../middleware/authMiddleware');

// // This route is protected and can only be accessed by an admin
// router.route('/').get(protect, authorize('admin'), getAllLogs);

// module.exports = router;

// backend/routes/logRoutes.js

const express = require('express');
const router = express.Router();
const { getAllLogs } = require('../controllers/logController');
const { protect, authorize } = require('../middleware/authMiddleware');
const Log = require('../models/Log'); // ✅ You must import this!

// GET all logs (Admin only)
router.get('/', protect, authorize('admin'), getAllLogs);

// DELETE a log by ID (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const log = await Log.findByIdAndDelete(req.params.id);
        if (!log) {
            return res.status(404).json({ message: 'Log not found' });
        }
        res.json({ message: 'Log deleted successfully' });
    } catch (err) {
        console.error('Log delete error:', err);
        res.status(500).json({ error: 'Failed to delete log' });
    }
});

module.exports = router;
