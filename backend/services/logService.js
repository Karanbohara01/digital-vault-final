// services/logService.js

const Log = require('../models/Log');

/**
 * Records an activity in the database.
 * @param {string|null} userId - The ID of the user performing the action. Can be null.
 * @param {string} action - A standardized string for the action (e.g., 'USER_LOGIN_SUCCESS').
 * @param {string} level - The log level ('info', 'warn', 'error').
 * @param {object} details - Any additional details to store with the log.
 */
const logActivity = async (userId, action, level = 'info', details = {}) => {
    try {
        const logEntry = new Log({
            user: userId,
            action,
            level,
            details,
        });
        await logEntry.save();
    } catch (error) {
        // If logging fails, we just print an error to the console.
        // We don't want a logging failure to crash the entire application.
        console.error('Failed to log activity:', error);
    }
};

module.exports = { logActivity };