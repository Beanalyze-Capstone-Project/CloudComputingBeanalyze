const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Database Configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// JWT Secret
const jwtSecret = process.env.JWT_SECRET;

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user; // Attach user info from the token
        next();
    });
};

// Route to get user profile
router.get('/', authenticateToken, async (req, res) => {
    try {
        const user_id = req.user.id; // Get user ID from the JWT

        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT username, name, city, email FROM users WHERE id = ?', [user_id]);
        await connection.end();

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = rows[0];
        res.status(200).json({
            username: user.username,
            name: user.name,
            city: user.city,
            email: user.email
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error retrieving user data', error: err.message });
    }
});

// POST /user/edit: Update user details
router.post('/edit', authenticateToken, async (req, res) => {
    const { username, name, city, email } = req.body;

    try {
        const user_id = req.user.id; // Get user ID from the JWT

        const connection = await mysql.createConnection(dbConfig);

        // Retrieve current user data
        const [currentUser] = await connection.execute('SELECT * FROM users WHERE id = ?', [user_id]);

        if (currentUser.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prepare values to update
        const updatedUsername = username || currentUser[0].username;
        const updatedName = name || currentUser[0].name;
        const updatedCity = city || currentUser[0].city;
        const updatedEmail = email || currentUser[0].email;

        // Update user data in the database
        const query = `UPDATE users SET username = ?, name = ?, city = ?, email = ? WHERE id = ?`;
        const values = [updatedUsername, updatedName, updatedCity, updatedEmail, user_id];

        const [result] = await connection.execute(query, values);
        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or no changes made' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
});



module.exports = router;
