// backend/controllers/logController.js

const Log = require('../models/Log');

// @desc    Get all activity logs
// @route   GET /api/logs
// @access  Private/Admin
const getAllLogs = async (req, res) => {
    try {
        // Find all logs, sort them with the newest first, and populate user details
        const logs = await Log.find({}).sort({ createdAt: -1 }).populate('user', 'name email');
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllLogs,
};