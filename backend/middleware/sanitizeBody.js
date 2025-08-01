// const sanitize = require('mongo-sanitize');

// module.exports = function sanitizeRequest(req, res, next) {
//     try {
//         if (req.body) {
//             req.body = JSON.parse(JSON.stringify(sanitize(req.body)));
//         }
//         if (req.params) {
//             req.params = JSON.parse(JSON.stringify(sanitize(req.params)));
//         }
//     } catch (err) {
//         console.error('Sanitize error:', err);
//     }
//     next();
// };


// backend/middleware/sanitizeBody.js

const sanitize = (obj) => {
    for (const key in obj) {
        if (/^\$/.test(key)) { // Check if the key starts with '$'
            delete obj[key];
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            // If the value is another object, sanitize it recursively
            sanitize(obj[key]);
        }
    }
    return obj;
};

const sanitizeRequest = (req, res, next) => {
    if (req.body) {
        req.body = sanitize(req.body);
    }
    if (req.query) {
        req.query = sanitize(req.query);
    }
    if (req.params) {
        req.params = sanitize(req.params);
    }
    next();
};

module.exports = sanitizeRequest;