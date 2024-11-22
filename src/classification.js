// src/classification.js
const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const { uploadImageToGCS } = require('./bucket'); // Import the upload function for GCS

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
const authenticateToken = require('./authenticateToken');

// Setup multer to store image in memory (instead of disk)
const storage = multer.memoryStorage(); // Change from diskStorage to memoryStorage

const upload = multer({ storage: storage });

// Get today's date in YYYY-MM-DD format
const today = new Date();
const formattedDate = today.toISOString().split('T')[0]; // Extracts the date in YYYY-MM-DD format

// POST /classification
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
    const { file } = req;

    if (!file) {
        return res.status(400).json({ message: 'Image is required' });
    }

    try {
        // Get user from JWT
        const user = req.user;
        const userId = user.id;

        // Connect to the database
        const connection = await mysql.createConnection(dbConfig);

        // Send image to the /predict API
        const formData = new FormData();
        formData.append('image', file.buffer, { filename: 'image.jpg' }); // Use buffer for in-memory data

        const predictResponse = await axios.post(process.env.API_FORWARD_PREDICT, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        const { disease_type, confident } = predictResponse.data;

        // Get disease information from `disease` table using `slugs`
        const [diseaseRows] = await connection.execute(`SELECT * FROM disease WHERE slugs = ?`, [disease_type]);

        if (diseaseRows.length === 0) {
            await connection.end();
            return res.status(404).json({ message: 'Disease type not found' });
        }

        const diseaseId = diseaseRows[0].id;
        const diseaseName = diseaseRows[0].name;
        const diseaseImageName = diseaseRows[0].image_name;
        const impact = diseaseRows[0].impact;
        const cause = diseaseRows[0].cause;
        const identification = diseaseRows[0].identification;
        const solution = diseaseRows[0].solution;

        // Construct the URL for the disease image stored in the 'disease-images' folder
        const diseaseImageLink = `https://storage.googleapis.com/${process.env.BUCKET_NAME}/disease-images/${diseaseImageName}`;

        // Upload the image to Google Cloud Storage directly from memory
        const fileName = `${Date.now()}.jpg`; // Use a unique name for the image
        const imageLink = await uploadImageToGCS(file.buffer, fileName, 'predict-images'); // Upload buffer directly

        // Insert prediction into `prediction_history` table, including the image name
        const query = `INSERT INTO prediction_history (user_id, disease_id, probability, image_name) VALUES (?, ?, ?, ?)`;
        const values = [userId, diseaseId, confident, fileName]; // Store the filename of the uploaded image

        await connection.execute(query, values);

        // Get the date of the prediction from the `prediction_history` table
        await connection.end();

        // Respond with the result, including the image link and other details
        res.status(200).json({
            message: 'Prediction classified successfully',
            disease_name: diseaseName,
            confident,
            image_predict_link: imageLink, // Include the public URL of the image in the response
            image_disease_link: diseaseImageLink, // Include the link to the disease image from GCS
            impact,
            cause,
            identification,
            solution,
            date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error processing classification', error: err.message });
    }
});

module.exports = router;
