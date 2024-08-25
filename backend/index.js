const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Cross-Origin Resource Sharing: Needed for my backend to successfully communicate with my front end
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Load environment variables from .env file
dotenv.config();

const app = express(); // Initialize Express app
const port = process.env.PORT || 3000; // Dynamic port from environment variables

// Apply CORS and allow requests from frontend's domain
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'https://eazi-tour.vercel.app/'], // both Local and production URLs are allowed
}));

// Endpoint to fetch Unsplash images
app.get('/api/photos', async (req, res) => {
    const { query } = req.query; // Get the query parameter from the request

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        // Construct Unsplash API URL with the query and orientation parameters
        const unsplashUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&client_id=${process.env.UNSPLASH_ACCESS_KEY}`;
        const response = await fetch(unsplashUrl); // Fetch images from Unsplash API
        const data = await response.json(); // Parse the response as JSON

        console.log(data);

        if (data.results.length === 0) {
            return res.status(404).json({ error: 'No images found' });
        }

        const imageUrl = data.results[0]?.urls?.regular || '';
        return res.json({ country: query, imageUrl });
    } catch (error) {
        // Handle any errors during the fetch process
        return res.status(500).json({ error: 'Failed to fetch images from Unsplash' });
    }
});

// Start the backend server on the defined port
app.listen(port, () => {
    console.log(`Backend server is running on port ${port}`);
});