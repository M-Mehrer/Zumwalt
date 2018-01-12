/* global $, ship */

 // eslint-disable-line no-unused-vars

const apiURL = "http://localhost:3000/api/v1";

let myShips = new Gamefield("myGameFieldBody");
let otherShips = new Gamefield("otherGameFieldBody");

let socket;

let isPlayerTurn;
let gameIsRunning;
let myHighscore = 0;

// Initializations
$(document).ready(function() {

	UIManager.inititializeShips(myShips.id);
	UIManager.inititializeShips(otherShips.id);
	UIManager.shipSetup(ships.availableShips, "myShipsToSetUp")

	socket = io();
	
	//$("#playerInputModal").modal("show");

	socket.on('beginner', (beginner) => {
		$("#otherArea").hide();
		isPlayerTurn = beginner;
		//alert("Beginner: " + beginner);
		gameIsRunning = true;

		if(beginner) {
			$("#otherGameField").addClass("activeBoard");
			printGameLog("Sie sind am Zug.");

			$("#turn-otherGameFieldBody").addClass("myTurnBg");
		}
		else {
			printGameLog("Auf den Gegner warten.");

			$("#turn-otherGameFieldBody").addClass("enemyTurnBg");
		}
	});

	$("#setUpShipsRandomly").on("click", (event) =>{
		myShips.setUpShipsRandomly();
		UIManager.showShips(myShips.board, myShips.id);

		$("#sendShips").removeClass("disabled");
		$("#sendShips").text("Bereit");

		$("#sendShips").on('click', (event) => {
			socket.emit('ships', {ships:myShips.shipCoordinatesForServer});
			$("#shipSetup").hide();
			$("#otherGameField").show();
			printGameLog("Gegner wird gesucht...");
		});
	});

	socket.on('message', (msg) => {
		// Print message
		printGameLog(msg);
	});

	socket.on('end', (msg) => {
		// Print message
		printGameLog(msg);
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

		printGameLog("Player missed: [" + UIManager.alphabet[position[1]] + ", " + (position[0] + 1) + "]");
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

		printGameLog("Player hit: [" + UIManager.alphabet[position[1]] + ", " + (position[0] + 1) + "]");
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

		printGameLog("Player destroyed: [" + UIManager.alphabet[position[1]] + ", " + (position[0] + 1) + "]");
		gameIsRunning = true;
	});

	socket.on('gameFinished', (winner)=>{
		gameIsRunning = false;
		if (winner){
			//TODO: Highscore senden
			//alert("Glückwunsch, du hast gesiegt!");
			printGameLog("Glückwunsch, du hast gesiegt!");
			$("#otherGameField").removeClass("activeBoard");
			setHighscore();
			updateHighscores();
		}
		else{
			//alert("Schade, du hast leider verloren!");
			printGameLog("Schade, du hast leider verloren!");
		}
	});

	updateHighscores();
});

function printGameLog(msg) {
	let log = $("#messageBox");

	let node = $("<p></p>");
	node.text("- " + msg);
	log.append(node);
}

function savePlayer() {

	if(playerNamesValid('#player1', '#player2')) {
		$('#player1Name').html( $('#player1').val());
		$('#player2Name').html( $('#player2').val());

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

function setHighscore(){
	$.ajax({
		type: "POST",
		data: JSON.stringify({
			"name": "EinName",
			"points": myHighscore
		}),
		contentType: "application/json",
		dataType: "JSON",
		url: apiURL + "/highscore",
		success: printGameLog("Dein Highscore mit " + myHighscore + " wurde erfolgreich gespeichert!")
	});
}

function updateHighscores() {
	$.ajax({
		method: "GET",
		dataType: "JSON",
		url: apiURL + "/highscore"
	}).done((msg) => {
		showHighscores(getBestHighscores(msg.highscore, 5));
	});
}

function getBestHighscores(highscores, nr) {
	highscores.sort(function(a, b){return a.points - b.points});

	let best = [];
	let last;

	for(let i = 0; i < highscores.length && i < nr; i++) {
		best.push(highscores[i]);
		last = highscores[i];
	}

	for(let i = nr; i < highscores.length; i++) {
		if(highscores[i].points == last.points) {
			best.push(highscores[i]);
		}
	}

	return best;
}

function showHighscores(highscores) {
	let container = $("#highscores");
	container.html("");

	if(highscores.length == 0) {
		container.append($("<span>Noch keine Einträge.</span><hr/>"));
	}

	for(let i = 0; i < highscores.length; i++) {
		let row = $('<span/>', {class: 'highscores'});
		let name = $('<span/>', {class: "col-xs-8"});
		name.append(highscores[i].name);
		let score = $('<span/>', {class: "col-xs-4"});
		score.append(highscores[i].points + " Pt.");
		let brhr = $('<br/><hr/>');
		row.append(name);
		row.append(score);
		row.append(brhr);
		container.append(row);
	}
}
