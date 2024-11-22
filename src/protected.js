// src/protected.js
const express = require('express');
const authenticateToken = require('./authenticateToken');

const router = express.Router();

// Protected route that requires authentication
router.get('/', authenticateToken, (req, res) => {
    res.status(200).json({
        message: 'Welcome to the protected route!',
        user: req.user, // Contains the data from the decoded token
    });
});

module.exports = router;
