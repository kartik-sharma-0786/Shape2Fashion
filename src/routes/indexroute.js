var express = require("express");
var path = require("path");
var router = express.Router();
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const upload = multer({ dest: "uploads/" });

// Serve frontend
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =============================
// Upload image → Flask /predict
// =============================
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Create form data and append file stream
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const headers = formData.getHeaders();

    // Forward to Flask server
    const response = await axios.post(
      "https://saber07-modelbodyshape.hf.space/predict",
      formData,
      { headers }
    );

    console.log("Flask prediction response:", response.data);
    res.json(response.data);  // Send back Flask's prediction result
  } catch (error) {
    console.error("Error in prediction:", error.message);
    res.status(500).json({ error: "Error in prediction" });
  }
});

// =============================
// Dresses query → Flask /query
// =============================
router.post("/dresses", async (req, res) => {
  try {
    const body_shape = req.body.body_shape; // match Flask parameter name
    console.log("okk till now");
    if (!body_shape) {
      return res.status(400).json({ error: "Provide body_shape parameter" });
    }

    // Call Flask server
    const response = await axios.get(
      `https://saber07-modelbodyshape.hf.space/query?body_shape=${encodeURIComponent(body_shape)}`
    );

    console.log("Flask dresses response:", response.data);

    // Return dresses list to client
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching dresses:", error.message);
    res.status(500).json({ error: "Error fetching dresses" });
  }
});

module.exports = router;
