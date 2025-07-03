// // models/Log.js

// const mongoose = require('mongoose');

// const logSchema = new mongoose.Schema({
//     // Optional: The user who performed the action.
//     // Not all actions might be tied to a logged-in user (e.g., a system event).
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//     },
//     // A short, standardized string describing the action.
//     action: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     // The severity level of the log.
//     level: {
//         type: String,
//         enum: ['info', 'warn', 'error', 'fatal'],
//         default: 'info',
//     },
//     // An object to store any extra details, like the IP address or affected document ID.
//     details: {
//         type: Object,
//     }
// }, {
//     timestamps: true, // Automatically adds createdAt
//     // We use a capped collection for logs. This is like a circular buffer.
//     // It's very efficient for storing recent logs without growing infinitely.
//     capped: { size: 10485760, max: 10000 } // 10MB size, max 10,000 documents
// });

// const Log = mongoose.model('Log', logSchema);

// module.exports = Log;

const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    // Optional: The user who performed the action.
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    // A short, standardized string describing the action.
    action: {
        type: String,
        required: true,
        trim: true,
    },
    // Severity level of the log
    level: {
        type: String,
        enum: ['info', 'warn', 'error', 'fatal'],
        default: 'info',
    },
    // Details should be pre-sanitized before reaching this schema
    details: {
        type: Object,
        default: {},
    },
    // Auto-delete logs after 30 days (TTL index)
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '30d', // ⏳ Logs automatically deleted after 30 days
    },
}, {
    // Don't double-define timestamps — we set createdAt manually
    capped: { size: 10 * 1024 * 1024, max: 10000 } // 10MB cap, max 10k docs
});

module.exports = mongoose.model('Log', logSchema);
