const sanitize = require('mongo-sanitize');

module.exports = function sanitizeRequest(req, res, next) {
    try {
        if (req.body) {
            req.body = JSON.parse(JSON.stringify(sanitize(req.body)));
        }
        if (req.params) {
            req.params = JSON.parse(JSON.stringify(sanitize(req.params)));
        }
    } catch (err) {
        console.error('Sanitize error:', err);
    }
    next();
};
