var express = require("express");
var path = require("path");
var router = express.Router();
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const upload = multer({ dest: 'uploads/' });

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const filePath = req.file.path;

        // Create form data and append the file stream
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));

        // Manually set the headers for multipart form data
        const headers = {
            ...formData.getHeaders(), // Get headers from form-data (if possible)
            'Content-Type': 'multipart/form-data'
        };

        // Post the form data to the Flask server
        const response = await axios.post('http://127.0.0.1:5000/predict', formData, { headers });

        console.log(response.data);  // Log the prediction result from Flask
        res.json(response.data);     // Send prediction result to the client
    } catch (error) {
        console.error("Error in prediction:", error);
        res.status(500).send('Error in prediction');
    }
});

module.exports = router;
