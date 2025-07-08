const express = require('express');
const router = express.Router();

router.post('/test-sanitize', (req, res) => {
    console.log('Received:', req.body); // will show sanitized version
    res.json({ sanitized: req.body });
});

module.exports = router;
