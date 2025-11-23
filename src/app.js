var express = require("express");
var app = express();
var path = require("path");
const indexrouter = require("./routes/indexroute");

app.use(express.static(path.join(__dirname , "public")));
app.use(express.json());
app.use('/' , indexrouter);

const PORT = process.env.PORT||3000;

app.listen(PORT , () => {
	console.log(`Server running on port ${PORT}`);
});

