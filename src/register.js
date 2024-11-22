// src/register.js
const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const router = express.Router();

// Database Configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// Register a new user
router.post('/', async (req, res) => {
    const { username, password, name, city, email } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Check if the username already exists
        const connection = await mysql.createConnection(dbConfig);
        const [existingUser] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
        await connection.end();

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Username is already taken. Please choose a different username.' });
        }

        // Hash the password and insert the new user into the database
        const hashedPassword = await bcrypt.hash(password, 10);
        const connection2 = await mysql.createConnection(dbConfig);

        const query = `INSERT INTO users (username, password, name, city, email) VALUES (?, ?, ?, ?, ?)`;
        const values = [username, hashedPassword, name, city, email];

        await connection2.execute(query, values);
        await connection2.end();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user. Please try again later.' });
    }
});

module.exports = router;
