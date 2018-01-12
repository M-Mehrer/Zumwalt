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

const catPictures = [
	"https://cdn.pixabay.com/photo/2016/09/11/09/49/cat-1660964_1280.jpg",
	"https://upload.wikimedia.org/wikipedia/commons/4/4d/Cat_March_2010-1.jpg",
	"https://pixnio.com/free-images/2017/09/26/2017-09-26-09-44-30-1100x733.jpg"
];

let ships = [];
let players = [];
let enemies = [];
let names = [];


// Initialize socket connections
io.on('connection', function(socket){
	/*players.push(socket);

	let i = players.length - 1;
	let enemy = (i % 2) === 0 ? i + 1 : i - 1;*/

	let i;
	let enemy;

	socket.on('ships', (shipData) => {
		players.push(socket);
		i = players.length - 1;
		enemy = (i % 2) === 0 ? i + 1 : i - 1;

		console.log("A player is ready.");
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

	socket.on('shot', (turn) => {
		// TODO: check turn
		turnData = turn.coordinates;

		let result = MISS;
		for(let j = 0; j < ships[enemy].length; j++) {
			let ship = ships[enemy][j];

			for(let k = 0; k < ship.length; k++) {
				let coord = ship[k];
				if(coord[0] === turnData[0] && coord[1] === turnData[1]) {
					// Remve coordinate
					ships[enemy][j] = removeIndex(ship, k);
					result = HIT;
				}
			}

			if(ships[enemy][j].length === 0) {
				// Remove sunken ship
				ships[enemy] = removeIndex(ships[enemy], j);
				result = SANK;
			}
		}

		//console.log(turnData);
		//console.log(result);

		let resName = "";
		switch(result) {
			case 0: resName = 'miss'; break;
			case 1: resName = 'hit'; break;
			case 2: resName = 'destroyed'; break;
		}
		socket.emit(resName, turn);
		players[enemy].emit(resName, turn);

		if(ships[enemy].length == 0) {
			socket.emit('gameFinished', true);
			players[enemy].emit('gameFinished', false);

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

app.get("*", (req, res) => {
	res.status(404).send("<center><h1>404: Seite nicht gefunden.</h1><img src='https://upload.wikimedia.org/wikipedia/commons/4/4d/Cat_March_2010-1.jpg' style='width: 80%;'></center>");
})

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
