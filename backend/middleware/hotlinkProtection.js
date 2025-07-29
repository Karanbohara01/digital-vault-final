// backend/middleware/hotlinkProtection.js

const hotlinkProtect = (req, res, next) => {

    const referer = req.headers.referer;

    // This is the URL of our own frontend application from the .env file.
    const allowedReferer = process.env.FRONTEND_URL;

    if (referer && referer.startsWith(allowedReferer)) {
        // If the referer is our own website, allow the request to continue.
        next();
    } else {

        res.status(403).send('Hotlinking is not allowed.');
    }
};

module.exports = hotlinkProtect;