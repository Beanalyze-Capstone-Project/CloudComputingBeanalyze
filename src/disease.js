// src/disease.js
const express = require('express');
const mysql = require('mysql2/promise');
const authenticateToken = require('./authenticateToken'); // JWT authentication middleware

const router = express.Router();

// Database Configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// GET /disease - Fetch all disease records
router.get('/', authenticateToken, async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);

        // Fetch all disease data
        const [diseaseRows] = await connection.execute('SELECT * FROM disease ORDER BY date_created DESC');

        // Format the response
        const diseases = diseaseRows.map((row) => ({
            id: row.id,
            slugs: row.slugs,
            name: row.name,
            impact: row.impact,
            cause: row.cause,
            identification: row.identification,
            solution: row.solution,
            date_created: row.date_created.toISOString().split('T')[0], // Format date as YYYY-MM-DD
            date_updated: row.date_updated.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        }));

        await connection.end();

        // Send the response
        res.status(200).json({
            diseases,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching diseases', error: err.message });
    }
});

module.exports = router;
