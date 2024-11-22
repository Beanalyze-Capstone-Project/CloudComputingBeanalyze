const express = require('express');
const mysql = require('mysql2/promise');
const authenticateToken = require('./authenticateToken');
const { getPublicUrl } = require('./bucket'); // Use the bucket logic for generating public URLs

const router = express.Router();

// Database Configuration
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// GET /predict_history
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from JWT
        const connection = await mysql.createConnection(dbConfig);

        // Fetch user data
        const [userRows] = await connection.execute(`SELECT name FROM users WHERE id = ?`, [userId]);
        if (userRows.length === 0) {
            await connection.end();
            return res.status(404).json({ message: 'User not found' });
        }
        const userName = userRows[0].name;

        // Fetch prediction history for the user
        const [historyRows] = await connection.execute(
            `SELECT ph.*, d.name AS disease_name, d.image_name AS disease_image, d.impact, d.cause, d.identification, d.solution
             FROM prediction_history ph
             JOIN disease d ON ph.disease_id = d.id
             WHERE ph.user_id = ? ORDER BY ph.date_created DESC`,
            [userId]
        );

        // Format the response
        const history = historyRows.map((row) => ({
            disease_name: row.disease_name,
            confident: row.probability,
            image_link_history: getPublicUrl('predict-images', `${row.image_name}`),
            image_link_disease: getPublicUrl('disease-images', `${row.disease_image}`),
            impact: row.impact,
            cause: row.cause,
            identification: row.identification,
            solution: row.solution,
            date: row.date_created.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        }));

        await connection.end();

        // Send the response
        res.status(200).json({
            user: userName,
            history,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching prediction history', error: err.message });
    }
});

module.exports = router;
