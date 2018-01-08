/* eslint no-console: "off" */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const highscores = require('./api/highscores');

let ships = [];
let players = [];
let names = [];


io.on('connection', function(socket){ // eslint-disable-line no-unused-vars
	players.push(socket);
	//ships.push([]);
	//names.push([]);

	let i = players.length - 1;
	let enemy = (i % 2) === 0 ? i + 1 : i - 1;

	socket.on('ships', (shipData) => {
		console.log(i + ": Ships sent.");
		// TODO: Check ships
		ships[i] = shipData.ships;

		if(ships[enemy] != undefined) {
			// Starten
			let rand = (Math.floor(Math.random() * 2))?true:false;
			players[i].emit('beginner', rand);
			players[enemy].emit('beginner', !rand);
		}
	});

	socket.on('turn', (turnData) => {
		// TODO

	});
	
	socket.on('disconnect', (reason) => {
		players[enemy].emit('error', 'Enemy disconnected.');
	})


	console.log('A user connected.');
});





app.use(function(req, res, next) {
	// TODO: Enable
	//res.header("Access-Control-Allow-Origin", "*");
	//res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(bodyParser.json());
app.use(serveStatic('public'));

// API
app.use("/api/v1/highscore/", highscores);
   
http.listen(3000, function() {
	console.log('Server started: http://localhost:3000');
})


