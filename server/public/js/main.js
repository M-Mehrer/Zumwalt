/* global $, Gamefield, Highscore, UIManager, ships, io */

let myShips = new Gamefield("myGameFieldBody");
let otherShips = new Gamefield("otherGameFieldBody");
let highscoreManager = new Highscore();

let shipsReady = false;
let isPlayerTurn;
let gameIsRunning;
let myHighscore = 0;

let player1 = "Player1", player2 = "Player2";

// Initializations
$(document).ready(function() {

	UIManager.inititializeShips(myShips.id);
	UIManager.inititializeShips(otherShips.id);
	UIManager.shipSetup(ships.availableShips, "myShipsToSetUp")

	let socket = io();

	$("#playerInputModal").modal("show");

	socket.on('beginner', (beginner) => {
		$("#otherArea").hide();
		isPlayerTurn = beginner;
		gameIsRunning = true;

		if(beginner) {
			$("#otherGameField").addClass("activeBoard");
			UIManager.printGameLog( $('#player1').val() + " ist am Zug.");

			$("#turn-otherGameFieldBody").addClass("myTurnBg");
		}
		else {
			UIManager.printGameLog("Auf " +  $('#player2').val() + " warten.");

			$("#turn-otherGameFieldBody").addClass("enemyTurnBg");
		}
	});

	$("#setUpShipsRandomly").on("click", (event) =>{
		myShips.setUpShipsRandomly();
		UIManager.showShips(myShips.board, myShips.id);

		$("#sendShips").removeClass("disabled");
		$("#sendShips").text("Bereit");
		shipsReady = true;

	});

	$("#sendShips").on('click', (event) => {
		if(shipsReady){
			socket.emit('ships', {ships:myShips.shipCoordinatesForServer});
			$("#shipSetup").hide();
			$("#otherGameField").show();
			UIManager.printGameLog("Gegner wird gesucht...");
		}
	});

	socket.on('message', (msg) => {
		// Print message
		UIManager.printGameLog(msg);
	});

	socket.on('end', (msg) => {
		// Print message
		UIManager.printGameLog(msg);
	});

	$("#otherGameField .boardField").on('click', (event)=> {
		//gets id from specific clicked field and extracts coordinates in an array
		let position = event.currentTarget.id.split("-").reverse();
		position.pop();
		position = position.reverse();
		position = position.map((val) => {return parseInt(val);});

		if (isPlayerTurn && gameIsRunning && !UIManager.isMarked(position[0], position[1], "otherGameFieldBody")){
			gameIsRunning = false;

			socket.emit('shot', {coordinates:position});
			myHighscore++;
		}
	});

	socket.on('miss', (position)=> {
		position = position.coordinates;
		if (isPlayerTurn){
			//mark position with white dot on enemy board
			UIManager.markField(position[0], position[1], "otherGameFieldBody");
			isPlayerTurn = false;
			$("#otherGameField").removeClass("activeBoard");

			$("#turn-otherGameFieldBody").removeClass("myTurnBg");
			$("#turn-otherGameFieldBody").addClass("enemyTurnBg");
		}
		else{
			//mark position with white dot on own board
			UIManager.markField(position[0], position[1], "myGameFieldBody");
			isPlayerTurn = true;
			$("#otherGameField").addClass("activeBoard");

			$("#turn-otherGameFieldBody").removeClass("enemyTurnBg");
			$("#turn-otherGameFieldBody").addClass("myTurnBg");
		}

		UIManager.printGameLog((isPlayerTurn ?  $('#player2').val(): $('#player1').val()) + " missed: [" + UIManager.alphabet[position[1]] + ", " + (position[0] + 1) + "]");
		gameIsRunning = true;
	});

	socket.on('hit', (position)=> {
		position = position.coordinates;
		if (isPlayerTurn){
			//mark position with red dot on enemy board
			UIManager.setShipField(position[0], position[1], "otherGameFieldBody");
			UIManager.markField(position[0], position[1], "otherGameFieldBody");
		}
		else{
			//mark position with red dot on own board
			UIManager.markField(position[0], position[1], "myGameFieldBody");
		}

		UIManager.printGameLog((isPlayerTurn ?  $('#player1').val(): $('#player2').val()) + " hitted: [" + UIManager.alphabet[position[1]] + ", " + (position[0] + 1) + "]");
		gameIsRunning = true;
	});

	socket.on('destroyed', (position)=> {
		position = position.coordinates;
		if (isPlayerTurn){
			//mark ship with dark red dots on enemy board
			UIManager.setShipField(position[0], position[1], "otherGameFieldBody");
			UIManager.markField(position[0], position[1], "otherGameFieldBody");
			UIManager.sinkShip(position[0], position[1], "otherGameFieldBody");
		}
		else{
			//mark ship with dark red dots on own board
			UIManager.markField(position[0], position[1], "myGameFieldBody");
			UIManager.sinkShip(position[0], position[1], "myGameFieldBody");
		}

		UIManager.printGameLog((isPlayerTurn ?  $('#player1').val(): $('#player2').val()) + " destroyed: [" + UIManager.alphabet[position[1]] + ", " + (position[0] + 1) + "]");
		gameIsRunning = true;
	});

	socket.on('gameFinished', (winner)=>{
		gameIsRunning = false;
		if (winner){
			UIManager.printGameLog("Glückwunsch, du hast gesiegt!");
			$("#otherGameField").removeClass("activeBoard");
			highscoreManager.setHighscore(myHighscore);
			highscoreManager.updateHighscores();

			$("#scoreLabel").text(myHighscore);
			$("#winnerModal").modal("show");
		}
		else{
			UIManager.printGameLog("Schade, du hast leider verloren!");

			$("#looserModal").modal("show");
		}
	});

	highscoreManager.updateHighscores();
});



function savePlayer() {

	if(playerNamesValid('#player1', '#player2')) {
		player1 = $('#player1').val();
		player2 = $('#player2').val()
		$('#player1Name').html( player1);
		$('#player2Name').html( player2);

		$('#playerInputModal').modal('hide');
	}
	else {
		validatePlayerName('#player1', '#player2');
	}
}

function validatePlayerName(id, otherId) {
	let signClass = 'alert-danger';

	$(id).removeClass(signClass);
	$(otherId).removeClass(signClass);

	if($(id).val() === $(otherId).val()) {
		$(id).addClass(signClass);
		$(otherId).addClass(signClass);
	}
	if($(id).val() === "") {
		$(id).addClass(signClass);
	}
	if($(otherId).val() === "") {
		$(otherId).addClass(signClass);
	}
}

function playerNamesValid(id, otherId) {
	return ($(id).val() !== $(otherId).val()
			&& $(id).val() !== ""
			&& $(otherId).val() !== "") ;
}
