/* eslint no-console: "off" */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const highscores = require('./api/highscores');
const env = require('./config.json');


const MISS = 0, HIT = 1, SANK = 2;
const resultNames = ["miss", "hit", "destroyed"];

/*const catPictures = [
	"https://cdn.pixabay.com/photo/2016/09/11/09/49/cat-1660964_1280.jpg",
	"https://upload.wikimedia.org/wikipedia/commons/4/4d/Cat_March_2010-1.jpg",
	"https://pixnio.com/free-images/2017/09/26/2017-09-26-09-44-30-1100x733.jpg"
];*/

let ships = [];
let players = [];
//let enemies = [];
//let names = [];


// Initialize socket connections
io.on('connection', function(socket){
	console.log('A player connected.');

	let i, enemy;

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
		let turnData = turn.coordinates;

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

		socket.emit(resultNames[result], turn);
		players[enemy].emit(resultNames[result], turn);

		if(ships[enemy].length == 0) {
			socket.emit('gameFinished', true);
			players[enemy].emit('gameFinished', false);

			console.log("A game ended.");
		}
	});

	socket.on('disconnect', () => {
		if(!players[enemy]){
			players[enemy]=players[i];
		}
		if(players[enemy]) {
			ships[i] = undefined;
			players[enemy].emit('end', 'Enemy disconnected.');
		}
		console.log("A player disconnected.");
	})
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
	if(!env.DEBUG) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	}
	next();
});
app.use(bodyParser.json());
app.use(serveStatic('public'));

// API
app.use("/api/v1/highscore/", highscores);

// Error handling (404)
app.get("/*", (req, res) => {
	res.status(404).sendFile(__dirname + '/public/error.html');
})

// Start Server
http.listen(env.PORT, env.HOST, function() {
	if(env.DEBUG)
		console.log('Server started: http://localhost:' + env.PORT);
	else {
		require('dns').lookup(require('os').hostname(), function (err, ip) {
			console.log('Server started: ' + ip + ":" + env.PORT);
		});
	}
})
