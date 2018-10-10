const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
var http = require('http');

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function findNeighbours() {
	var env = process.env.n || "";
	return env.split(":");
}

var neighbours = findNeighbours();

setInterval(function() {
	fs.readFile("meta.json", function(err, data) {
		if(err) return;
		var meta = JSON.parse(data);
	});
}, 1000);
