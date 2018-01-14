const MISS = 0, HIT = 1, SANK = 2;
const resultNames = ["miss", "hit", "destroyed"];

let ships = [];
let players = [];
let activePlayer = [];
let shots = [];

// Initialize socket connections
function newConnection(socket) {
	console.log('A player connected.');

	let i, enemy;

	socket.on('ships', (shipData) => {
		let validBoard = true;
		// Check shipData's format
		if( (shipData === undefined)
		|| (!shipData.hasOwnProperty("ships"))
		|| (!shipData.ships instanceof Array)
		|| (!shipData.ships.length === 10)) {
			validBoard = false;
		}

		if(!isBoardValid(shipData.ships)) {
			validBoard = false;
		}

		if(!validBoard) {
			socket.emit('message', 'Invalid game board.');
			return;
		}

		players.push(socket);

		i = players.length - 1;
		enemy = (i % 2) === 0 ? i + 1 : i - 1;

		
		shots[i] = [];

		console.log("A player is ready.");

		ships[i] = shipData.ships;

		if(ships[enemy] != undefined) {
			// Starten
			let rand = (Math.floor(Math.random() * 2)) ? true : false; // Choose random start player
			players[i].emit('beginner', rand);
			players[enemy].emit('beginner', !rand);

			activePlayer[Math.trunc(i / 2)] = rand ? (i % 2) : (enemy % 2);

			console.log("A game started.");
		}
	});

	socket.on('shot', (turn) => {
		// checks if current player is at the turn
		// checks if the turn fits the format
		if(shots[i] === undefined
		|| activePlayer[Math.trunc(i / 2)] !== (i % 2)
		|| (turn === undefined)
		|| (!turn.hasOwnProperty('coordinates'))
		|| (!turn.coordinates instanceof Array)
		|| (!turn.coordinates.length === 2)
		|| (turn.coordinates[0] < 0) || (turn.coordinates[0] >= 10)
		|| (turn.coordinates[1] < 0) || (turn.coordinates[1] >= 10)
		|| (shots[i].includes(turn.coordinates))) {
			socket.emit('message', 'Invalid game turn.');
			return;
		}

		let turnData = turn.coordinates;
		shots[i].push(turnData);

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

		if(result === MISS) {
			activePlayer[Math.trunc(i / 2)] = (activePlayer[Math.trunc(i / 2)] + 1) % 2;
		}

		if(ships[enemy].length == 0) {
			socket.emit('gameFinished', true);
			players[enemy].emit('gameFinished', false);

			activePlayer[Math.trunc(i / 2)] = undefined;

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

		activePlayer[Math.trunc(i / 2)] = undefined;

		console.log("A player disconnected.");
	})
}


function isBoardValid(ships) {
	if(!ships instanceof Array) {
		return false;
	}

	// Check if ship array format matches target
	for(let shipNr = 0; shipNr < ships.length; shipNr++) {
		let ship = ships[shipNr];
		if(!ship instanceof Array) {
			return false;
		}

		for(let shipFieldNr = 0; shipFieldNr < ship.length; shipFieldNr++) {
			let shipField = ship[shipFieldNr];

			if((!shipField instanceof Array)
			|| (!shipField.length === 2)
			|| (shipField[0] < 0) || (shipField[0] >= 10)
			|| (shipField[1] < 0) || (shipField[1] >= 10)) {
				return false;
			}
		}
	}

	// Check if ships are placed valid on the board
	// Initialize empty game board
	let testBoard = [];
	for(let i = 0; i < 100; i++) {
		testBoard[i] = 0;
	}

	// Place ships on board
	let remainingShips = ships.length;
	for(let shipNr = 0; shipNr < ships.length; shipNr++) {
		let ship = ships[shipNr];
		for(let shipFieldNr = 0; shipFieldNr < ship.length; shipFieldNr++) {
			let shipField = ship[shipFieldNr];

			let pos = shipField[0] * 10 + shipField[1];

			if( (testBoard[pos] >= remainingShips) // Check current field
			|| ((pos % 10) !== 0 && testBoard[pos - 1] > remainingShips) // Check left
			|| ((pos % 10) !== 9 && testBoard[pos + 1] > remainingShips) // Chek right
			|| ((pos - 10) >= 0 && testBoard[pos - 10] > remainingShips) // Check top
			|| ((pos + 10) < 100 && testBoard[pos + 10] > remainingShips) // Check bottom
			|| ((pos + 9) % 10 !== 9 && (pos - 11) >= 0 && testBoard[pos - 11] > remainingShips) // Check top left
			|| ((pos + 9) % 10 !== 9 && (pos + 9) < 100 && testBoard[pos + 9] > remainingShips) // Check bottom left
			|| ((pos + 11) % 10 !== 0 && (pos - 9) >= 0 && testBoard[pos - 9] > remainingShips) // Check top right
			|| ((pos + 11) % 10 !== 0 && (pos + 11) < 100 && testBoard[pos + 11] > remainingShips) // Check bottom left
			) {
				return false;
			}

			testBoard[pos] = remainingShips;
		}

		remainingShips--;
	}

	return true;
}

function removeIndex(array, index) {
	let result = [];
	for(let i = 0; i < array.length; i++) {
		if(i != index)
			result.push(array[i]);
	}
	return result;
}

module.exports = newConnection;