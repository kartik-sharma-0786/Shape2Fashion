var express = require("express");
var path = require("path");
var router = express.Router();
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const upload = multer({ dest: 'uploads/' });

const bdindex=0;



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



router.post("/dresses", async (req, res) => {
    console.log('Headers:', req.headers);
    //console.log('Raw body:', req.body);
    let data = '';
    req.on('data', chunk => {
        data += chunk;
    });
    
    req.on('end', async () => {
        console.log('Raw data received:', data);

        try {
            const parsedData = JSON.parse(data);
            console.log('Parsed data:', parsedData);

            // Forward the parsed data to the Flask server
            const flaskResponse = await axios.post("http://127.0.0.1:5000/query", parsedData, {
                headers: { "Content-Type": "application/json" }
            });

            // Log Flask's response
            console.log("Response from Flask:", flaskResponse.data);

            // Send back Flask's response to the original client
            res.json({ message: "Data processed successfully", flaskData: flaskResponse.data });
        } catch (e) {
            console.error('Error parsing JSON or forwarding to Flask:', e);
            res.status(500).json({ error: "Error processing data" });
        }
    });
    });





   




// router.get('/dresses',async (req, res) => {
    
 //});  // to display the final photos



module.exports = router;
