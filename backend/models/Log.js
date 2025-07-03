// models/Log.js

const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    // Optional: The user who performed the action.
    // Not all actions might be tied to a logged-in user (e.g., a system event).
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    // A short, standardized string describing the action.
    action: {
        type: String,
        required: true,
        trim: true,
    },
    // The severity level of the log.
    level: {
        type: String,
        enum: ['info', 'warn', 'error', 'fatal'],
        default: 'info',
    },
    // An object to store any extra details, like the IP address or affected document ID.
    details: {
        type: Object,
    }
}, {
    timestamps: true, // Automatically adds createdAt
    // We use a capped collection for logs. This is like a circular buffer.
    // It's very efficient for storing recent logs without growing infinitely.
    capped: { size: 10485760, max: 10000 } // 10MB size, max 10,000 documents
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;