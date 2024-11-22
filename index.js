require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Import routes
const registerRoute = require('./src/register');
const loginRoute = require('./src/login');
const protectedRoute = require('./src/protected');
const classificationRoute = require('./src/classification');
const predictHistoryRoute = require('./src/predict_history');
const userRoute = require('./src/user'); // Import the user route

// Use routes
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/protected', protectedRoute);
app.use('/classification', classificationRoute);
app.use('/predict_history', predictHistoryRoute);
app.use('/user', userRoute); // Register the user route

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
