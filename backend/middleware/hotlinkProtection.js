// backend/middleware/hotlinkProtection.js (Updated)
const hotlinkProtect = (req, res, next) => {
    const referer = req.headers.referer;
    const allowedReferer = process.env.FRONTEND_URL;

    // Allow if the request is from our own frontend OR has no referer (direct access)
    if (!referer || referer.startsWith(allowedReferer)) {
        next();
    } else {
        console.log(`[HOTLINK BLOCKED] Request from: ${referer}`);
        res.status(403).send('Hotlinking is not permitted.');
    }
};
module.exports = hotlinkProtect;