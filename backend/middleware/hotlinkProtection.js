// backend/middleware/hotlinkProtection.js

const hotlinkProtect = (req, res, next) => {
    // Get the 'Referer' header from the incoming request.
    // This header tells us which website the request is coming from.
    const referer = req.headers.referer;

    // This is the URL of our own frontend application from the .env file.
    const allowedReferer = process.env.FRONTEND_URL;

    // We allow the request if:
    // 1. The referer exists AND it starts with our frontend's URL.
    // 2. The referer does not exist (this allows people to directly visit the image URL).
    //    We can tighten this later if we want to.
    if (referer && referer.startsWith(allowedReferer)) {
        // If the referer is our own website, allow the request to continue.
        next();
    } else {
        // If the referer is a different website, block the request.
        // We send a 403 Forbidden status.
        res.status(403).send('Hotlinking is not allowed.');
    }
};

module.exports = hotlinkProtect;