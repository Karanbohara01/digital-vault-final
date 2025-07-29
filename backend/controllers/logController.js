// backend/controllers/logController.js

const Log = require('../models/Log');


const getAllLogs = async (req, res) => {
    try {
        const logs = await Log.find({}).sort({ createdAt: -1 }).populate('user', 'name email');
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllLogs,
};