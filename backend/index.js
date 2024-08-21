const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Cross-Origin Resource Sharing: Needed for my backend to successfully communicate with my front end
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)); // Dynamic import for node-fetch

// Load environment variables from .env file
dotenv.config();

const app = express(); // Initialize Express app
const port = process.env.PORT || 3000; // Dynamic port from environment variables

// Apply CORS and allow requests from frontend's domain
app.use(cors({
    origin: 'https://eazi-tour.vercel.app', // Allows only domain of my frontend
    methods: ['GET', 'POST'], // Allowed methods
    allowedHeaders: ['Content-Type'] // ALlowed headers
}));

// Endpoint to fetch Unsplash images
app.get('/api/photos', async (req, res) => {
    const { query } = req.query; // Get the query parameter from the request
    try {
        // Construct Unsplash API URL with the query and orientation parameters
        const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&client_id=${process.env.UNSPLASH_ACCESS_KEY}`;
        const response = await fetch(unsplashUrl); // Fetch images from Unsplash API
        const data = await response.json(); // Parse the response as JSON
        res.json(data); // Send the data back to the frontend
    } catch (error) {
        // Handle any errors during the fetch process
        res.status(500).json({ error: 'Failed to fetch images from Unsplash' });
    }
});

// Start the backend server on the defined port
app.listen(port, () => {
    console.log(`Backend server is running on port ${port}`);
});