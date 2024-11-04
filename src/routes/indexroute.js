var express = require("express");
var path = require("path");
var router = express.Router();
const multer = require('multer');

const upload = multer({dest: 'uploads/' });

router.get('/' , (req,res)=> {
	res.sendFile(path.join(__dirname , "public" , "index.html"));

});

// The image file received is temporarily stored in uploads directory
router.post('/upload' , upload.single('file') , (req,res) => {
	console.log("File upload successfull" , req.file);
	res.send({message: "file uploaded successfully" , file: req.file });
});

module.exports = router;
