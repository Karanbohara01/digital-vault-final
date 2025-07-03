// // services/logService.js

// const Log = require('../models/Log');

// /**
//  * Records an activity in the database.
//  * @param {string|null} userId - The ID of the user performing the action. Can be null.
//  * @param {string} action - A standardized string for the action (e.g., 'USER_LOGIN_SUCCESS').
//  * @param {string} level - The log level ('info', 'warn', 'error').
//  * @param {object} details - Any additional details to store with the log.
//  */
// const logActivity = async (userId, action, level = 'info', details = {}) => {
//     try {
//         const logEntry = new Log({
//             user: userId,
//             action,
//             level,
//             details,
//         });
//         await logEntry.save();
//     } catch (error) {
//         // If logging fails, we just print an error to the console.
//         // We don't want a logging failure to crash the entire application.
//         console.error('Failed to log activity:', error);
//     }
// };

// module.exports = { logActivity };

const Log = require('../models/Log');

/**
 * Recursively sanitizes an object to redact sensitive fields.
 * @param {object} obj - The original details object
 * @returns {object} - The sanitized copy
 */
const sanitizeDetails = (obj) => {
    const sensitiveKeys = [
        'password',
        'token',
        'accessToken',
        'refreshToken',
        'email',
        'ipAddress',
        'authHeader',
        'authorization',
        'cookie',
        'set-cookie',
        'session',
    ];

    const sanitize = (value) => {
        if (typeof value !== 'object' || value === null) return value;

        const result = Array.isArray(value) ? [] : {};

        for (const key in value) {
            if (sensitiveKeys.includes(key.toLowerCase())) {
                result[key] = '[REDACTED]';
            } else if (typeof value[key] === 'object') {
                result[key] = sanitize(value[key]); // Recursively sanitize nested objects
            } else if (typeof value[key] === 'function') {
                continue; // Skip functions
            } else {
                result[key] = value[key];
            }
        }

        return result;
    };

    return sanitize(obj);
};

/**
 * Logs a sanitized activity to the database.
 * @param {string|null} userId - Optional user ID (can be null for system actions)
 * @param {string} action - A clear, short string like 'USER_LOGIN_SUCCESS'
 * @param {'info' | 'warn' | 'error' | 'fatal'} level - Severity level
 * @param {object} details - Optional metadata or context (will be sanitized)
 */
// const logActivity = async (userId, action, level = 'info', details = {}) => {
//     try {
//         const cleanDetails = sanitizeDetails(details);

//         const logEntry = new Log({
//             user: userId,
//             action,
//             level,
//             details: cleanDetails,
//             method: details.method || '[UNKNOWN]',
//         });

//         await logEntry.save();
//     } catch (error) {
//         console.error('🚨 Failed to write log entry:', error.message);
//     }
// };

// logService.js
const logActivity = async (userId, action, level = 'info', details = {}) => {
    try {
        const cleanDetails = sanitizeDetails(details);

        const logEntry = new Log({
            user: userId,
            action,
            level,
            details: cleanDetails,
            method: details?.req?.method || details?.method || '[UNKNOWN]', // ✅ Extract method
        });

        await logEntry.save();
    } catch (error) {
        console.error('🚨 Failed to write log entry:', error.message);
    }
};


module.exports = { logActivity };
