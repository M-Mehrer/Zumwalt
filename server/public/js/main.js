/* global $, ship */

 // eslint-disable-line no-unused-vars

const apiURL = "http://localhost:3000/api/v1";

let myShips = new Gamefield("myGameFieldBody");
let otherShips = new Gamefield("otherGameFieldBody");

let socket;

let isPlayerTurn;
let gameIsRunning;

// Initializations
$(document).ready(function() {

	UIManager.inititializeShips(myShips.id);
	UIManager.inititializeShips(otherShips.id);
	UIManager.shipSetup(ships.availableShips, "myShipsToSetUp")

	socket = io();

	$("#setUpShipsRandomly").on("click", (event) =>{
		myShips.setUpShipsRandomly();
	});

	//$("#playerInputModal").modal("show");

	socket.on('beginner', (beginner) => {
		$("#otherArea").hide();
		isPlayerTurn = beginner;
		//alert("Beginner: " + beginner);
		gameIsRunning = true;

		if(beginner) {
			$("#otherGameField").addClass("activeBoard");
			printGameLog("Sie sind am Zug.");
		}
		else {
			printGameLog("Auf den Gegner warten.");
		}
	});

	$("#setUpShipsRandomly").on("click", (event) =>{
		myShips.setUpShipsRandomly();
		UIManager.showShips(myShips.board, myShips.id);

		$("#sendShips").removeClass("disabled");
		$("#sendShips").text("Bereit");
	});


	$("#sendShips").on('click', (event) => {
		socket.emit('ships', {ships:myShips.shipCoordinatesForServer});
		$("#shipSetup").hide();
		$("#otherGameField").show();
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
			//alert("klick at: " + position);
		}

	});

	socket.on('miss', (position)=> {
		position = position.coordinates;
		if (isPlayerTurn){
			//mark position with white dot on enemy board
			UIManager.markField(position[0], position[1], "otherGameFieldBody");
			isPlayerTurn = false;
			$("#otherGameField").removeClass("activeBoard");
		}
		else{
			//mark position with white dot on own board
			UIManager.markField(position[0], position[1], "myGameFieldBody");
			isPlayerTurn = true;
			$("#otherGameField").addClass("activeBoard");
		}

		printGameLog("Player missed: [" + position[0] + ", " + position[1] + "]");
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

		printGameLog("Player hit: [" + position[0] + ", " + position[1] + "]");
		gameIsRunning = true;
	});

	socket.on('destroyed', (position)=> {
		position = position.coordinates;
		if (isPlayerTurn){
			//mark ship with dark red dots on enemy board
			UIManager.setShipField(position[0], position[1], "otherGameFieldBody");
			UIManager.markField(position[0], position[1], "otherGameFieldBody");
		}
		else{
			//mark ship with dark red dots on own board
			UIManager.markField(position[0], position[1], "myGameFieldBody");
		}

		printGameLog("Player destroyed: [" + position[0] + ", " + position[1] + "]");
		gameIsRunning = true;
	});

	socket.on('gameFinished', (winner)=>{
		gameIsRunning = false;
		if (winner){
			//TODO: Highscore senden
			//alert("Glückwunsch, du hast gesiegt!");
			printGameLog("Glückwunsch, du hast gesiegt!");
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
		//let row = $('<span/>', {class: 'row'});
		let name = $('<span/>', {class: "col-xs-8"});
		name.append(highscores[i].name);
		let score = $('<span/>', {class: "col-xs-4"});
		score.append(highscores[i].points + " Pt.");
		container.append(name);
		container.append(score);
		container.append('<br/><hr/>');
	}
}
