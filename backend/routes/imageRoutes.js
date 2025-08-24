// routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const FormData = require('form-data');

// The middleware is already applied in server.js, so we don't need fileUpload here

router.post('/', async (req, res) => {
    try {
        console.log('Received request to process image');
        console.log('Files:', req.files);

        if (!req.files || !req.files.file) {
            console.log('No files uploaded');
            return res.status(400).json({ error: 'No files were uploaded.' });
        }

        const imageFile = req.files.file;
        console.log('Image file details:', {
            name: imageFile.name,
            mimetype: imageFile.mimetype,
            size: imageFile.size
        });

        // Create form data for the Flask API
        const form = new FormData();
        form.append('file', imageFile.data, {
            filename: imageFile.name,
            contentType: imageFile.mimetype
        });

        console.log('Sending request to Flask server...');
        
        const flaskResponse = await fetch('http://127.0.0.1:5002/api/process-image', {
            method: 'POST',
            body: form,
            headers: form.getHeaders()
        });

        console.log('Flask server response status:', flaskResponse.status);

        if (!flaskResponse.ok) {
            const errorText = await flaskResponse.text();
            console.error('Flask API error:', errorText);
            return res.status(flaskResponse.status).json({ 
                error: 'Flask API error',
                details: errorText 
            });
        }

        const data = await flaskResponse.json();
        console.log('Flask server response data:', data);
        
        // Send the Flask response directly back to the client
        res.status(200).json(data);

    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ 
            error: 'Failed to process image through the proxy server.',
            details: error.message 
        });
    }
});

module.exports = router;