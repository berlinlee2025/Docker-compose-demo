// rootDir/routes/userRoutes.js

const express = require('express');
const router = express.Router();

router.get('/api/get-user-data', (req, res) => {
    console.log(`\nSession: `, req.session);
    if (req.session && req.session.user) {
        res.json(req.session.user);
    } else {
        res.status(401).json({ error: `Not authenticated` });
    }
});

module.exports = router;