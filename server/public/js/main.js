/* global $, ship */

 // eslint-disable-line no-unused-vars 

const apiURL = "http://localhost:3000/api/v1";

let myShips = new Gamefield("myGameFieldBody");
let otherShips = new Gamefield("otherGameFieldBody");

let socket;

// Initializations
$(document).ready(function() {
	UIManager.inititializeShips(myShips.id);
	UIManager.inititializeShips(otherShips.id);
	UIManager.shipSetup(ships.availableShips, "myShipsToSetUp")

	$("#setUpShipsRandomly").on("click", (event) =>{
		myShips.setUpShipsRandomly();
		/*
		console.log(myShips.shipCoordinatesForServer[0]);
		console.log(myShips.shipCoordinatesForServer[1]);
		console.log(myShips.shipCoordinatesForServer[2]);
		console.log(myShips.shipCoordinatesForServer[3]);
		console.log(myShips.shipCoordinatesForServer[4]);
		console.log(myShips.shipCoordinatesForServer[5]);
		console.log(myShips.shipCoordinatesForServer[6]);
		console.log(myShips.shipCoordinatesForServer[7]);
		console.log(myShips.shipCoordinatesForServer[8]);
		console.log(myShips.shipCoordinatesForServer[9]);*/
		
		console.log(myShips.board[0]);
		console.log(myShips.board[1]);
		console.log(myShips.board[2]);
		console.log(myShips.board[3]);
		console.log(myShips.board[4]);
		console.log(myShips.board[5]);
		console.log(myShips.board[6]);
		console.log(myShips.board[7]);
		console.log(myShips.board[8]);
		console.log(myShips.board[9]);
	});
	
	//board = initializeBoard();
	//renderGameField(board, '#myGameField', true);
	//initializeShips('#otherGameField');

	//$("#playerInputModal").modal("show");

	socket = io();

	socket.on('beginner', (beginner) => {
		$("#otherArea").hide();
		//alert("Beginner: " + beginner);
	});

	socket.on('message', (msg) => {
		// TODO: Print message
	})

	updateHighscores();

});


function printGameLog() {
	// TODO
}

//Uses ships.js which is embedded in index.html
function initializeShips(areaId){
	let shipProperties = ship.shipProperties();
	let amountOfShips = countAmountOfShipsToSetUp(shipProperties); // eslint-disable-line no-undef 
	//let settedShipsCoordinates = [];

	let node = $("<div id='myShipsToSetUp' class='rFrame'></div>");

	for(let row = 0; row < shipProperties.length; row++){
		let shipsRowNode = $("<div class='setUpShipsArea bFrame'></div>");
		$(node).append(shipsRowNode);

		shipsRowNode.append($("<div class='col-xs-1 col-md-1 setUpShipsAreaRow gFrame'>" + ship[shipProperties[row]].amount + "</div>"));
		shipsRowNode.append($("<div class='col-xs-7 col-md-7 setUpShipsAreaRow gFrame'>" + ship[shipProperties[row]].name + "</div>"));

		let shipGameFields = "<div class='col-xs-4 col-md-4 setUpShipsAreaRow gFrame'>";
		for(let fields = 0; fields < ship[shipProperties[row]].gameFields; fields++){
			shipGameFields += "<div class='setUpShipsAreaRowUsedGameFields shipBgColor'></div>";
		}
		shipGameFields += "</div>";
		shipsRowNode.append($(shipGameFields));
	}

	let setUpShipsFooterNode = "<div id='myShipsButtons' pFrame'>";
	setUpShipsFooterNode += "<div class='btn-group btn-group-justified height'>";
	setUpShipsFooterNode += "<div class='btn-group height'>";
	setUpShipsFooterNode += "<button id='setUpShipsRandomly' type='button' class='btn btn-primary active setUpShipsButtons'>Zufällig anordnen</button>";
	setUpShipsFooterNode += "</div>";
	setUpShipsFooterNode += "<div class='btn-group height'>";
	setUpShipsFooterNode += "<button id='sendShipsToServer' type='button' class='btn btn-primary disabled setUpShipsButtons'><span id='buttonNumberOfShips' class='badge'>" + amountOfShips + "</span> Noch zu setzen</button>";
	setUpShipsFooterNode += "</div>";
	setUpShipsFooterNode += "</div>";
	setUpShipsFooterNode += "</div>";
	
	$(areaId).append($(setUpShipsFooterNode));
	$(areaId).append(node);

	$("#sendShipsToServer").click((event) => {
		socket.emit('ships', shipCoordinatesForServer.ships);
	})

	//Buttons click events
	$("#setUpShipsRandomly").click(function(){
		setUpShipsRandomly(); // eslint-disable-line no-undef
	});

	//Dynamic css
	$(".setUpShipsAreaRowUsedGameFields").css("width", (100 / ship.biggestShip().gameFields) + "%");
}

function savePlayer() { // eslint-disable-line no-unused-vars 

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
