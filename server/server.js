/* eslint no-console: "off" */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const highscores = require('./api/highscores');

const debug = true;
const PORT = 3000;

const FREE = 0, SHIP = 1, HITTED = 2;
const MISS = 0, HIT = 1, SANK = 2;

let ships = [];
let players = [];
let enemies = [];
let names = [];


// Initialize socket connections
io.on('connection', function(socket){
	players.push(socket);

	let i = players.length - 1;
	let enemy = (i % 2) === 0 ? i + 1 : i - 1;

	socket.on('ships', (shipData) => {
		console.log("A player is ready.")
		// TODO: Check ships
		ships[i] = shipData.ships;

		if(ships[enemy] != undefined) {
			// Starten
			let rand = (Math.floor(Math.random() * 2)) ? true : false; // Choose random start player
			players[i].emit('beginner', rand);
			players[enemy].emit('beginner', !rand);

			console.log("A game started.");
		}
	});

	socket.on('turn', (turn) => {
		// TODO: check turn
		turnData = turn.turn;

		let result = MISS;
		for(let j = 0; j < ships[enemy].length; j++) {
			let ship = ships[enemy][j];

			for(let k = 0; k < ship.length; k++) {
				let coord = ship[k];
				if(coord[0] == turnData[0] && coord[1] == turnData[1]) {
					// Remve coordinate
					ships[enemy][j] = removeIndex(ship, k);
					result = HIT;
				}
			}

			if(ships[enemy][j].length == 0) {
				// Remove sunken ship
				ships[enemy] = removeIndex(ships[enemy], j);
				result = SANK;
			}
		}

		socket.emit('turnResult', result);
		players[enemy].emit('turn', turn);

		if(ships[enemy].length == 0) {
			socket.emit('winner', true);
			players[enemy].emit('winner', false);

			console.log("A game ended.");
		}
	});

	socket.on('disconnect', (reason) => {
		if(players[enemy]) {
			ships[i] = undefined;
			players[enemy].emit('end', 'Enemy disconnected.');
		}
		console.log("A player disconnected");
	})

	console.log('A player connected.');
});

function removeIndex(array, index) {
	let result = [];
	for(let i = 0; i < array.length; i++) {
		if(i != index)
			result.push(array[i]);
	}
	return result;
}


// Middlewares
app.use(function(req, res, next) {
	if(!debug) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	}
	next();
});
app.use(bodyParser.json());
app.use(serveStatic('public'));

// API
app.use("/api/v1/highscore/", highscores);

// Start Server
http.listen(PORT, function() {
	if(debug)
		console.log('Server started: http://localhost:' + PORT);
	else {
		require('dns').lookup(require('os').hostname(), function (err, ip, fam) {
			console.log('Server started: ' + ip + ":" + PORT);
		});
	}
})
