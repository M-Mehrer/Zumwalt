const fieldSize = 10;
const shipColor = 'rgb(64, 64, 64)';
const freeBoardField = 'rgb(20, 159, 214)';

const apiURL = "http://52.166.12.116:3000/api";

var myField;

// Initializations
$(document).ready(function() {
	initializeGameField('#myGameFieldShips', 'activeField');
	initializeShips('#otherGameFieldShips');
	//Erst Shiffe setzen dann das Gegnerboard initialisieren
	//initializeGameField('#otherShips');

	//$("#playerInputModal").modal("show");

	updateHighscores();

});

function clearField(){
	for(let i = 1; i <= fieldSize; i++){
		for(let j = 1; j <= fieldSize; j++){
			$("#place-" + i + "-" + j).css("background-color", freeBoardField);
			//$("#place-" + i + "-" + j).addClass("freeBordfieldBgColor").removeClass("shipBgColor");
			//Debug function
			$("#place-" + i + "-" + j).html("");
		}
	}
}

//Uses ships.js which is embedded in index.html
function initializeShips(areaId){
	var shipProperties = ship.shipProperties();
	var amountOfShips = countAmountOfShipsToSetUp(shipProperties);
	var settedShipsCoordinates = [];

	let node = $("<div id='myShipsToSetUp' class='rFrame'></div>");

	for(let row = 0; row < shipProperties.length; row++){
		let shipsRowNode = $("<div class='row area setUpShipsRowArea bFrame'></div>");
		$(node).append(shipsRowNode);

		shipsRowNode.append($("<div class='col-xs-1 col-md-1 setUpShipsRowAreaRow gFrame'>" + ship[shipProperties[row]].amount + "</div>"));
		shipsRowNode.append($("<div class='col-xs-7 col-md-7 setUpShipsRowAreaRow gFrame'>" + ship[shipProperties[row]].name + "</div>"));

		let shipGameFields = "<div class='col-xs-4 col-md-4 setUpShipsRowAreaRow gFrame'>";
		for(let fields = 0; fields < ship[shipProperties[row]].gameFields; fields++){
			shipGameFields += "<div class='setUpShipsRowAreaRowUsedGameFields'></div>";
		}
		shipGameFields += "</div>";
		shipsRowNode.append($(shipGameFields));
	}

	let setUpShipsFooterNode = "<div id='myShipsFooter' class='setUpShipsFooter pFrame'>";
			setUpShipsFooterNode += "<div class='btn-group btn-group-justified height'>";
				setUpShipsFooterNode += "<div class='btn-group height'>";
					setUpShipsFooterNode += "<button id='setUpShipsRandomly' type='button' class='btn btn-primary active setUpShipsFooterButtons'>Zufällig anordnen</button>";
				setUpShipsFooterNode += "</div>";
				setUpShipsFooterNode += "<div class='btn-group height'>";
					setUpShipsFooterNode += "<button id='sendShipsToServer' type='button' class='btn btn-primary disabled setUpShipsFooterButtons'><span id='buttonNumberOfShips' class='badge'>" + amountOfShips + "</span> Noch zu setzen</button>";
					setUpShipsFooterNode += "</div>";
			setUpShipsFooterNode += "</div>";
		setUpShipsFooterNode += "</div>";
	
	$(areaId).append($(setUpShipsFooterNode));
	$(areaId).append(node);

	//Buttons click events
	$("#setUpShipsRandomly").click(function(){
		setUpShipsRandomly();
	});

	//Dynamic css
	$(".setUpShipsRowAreaRowUsedGameFields").addClass("shipBgColor");
	//$(".setUpShipsRowArea").css("height", (76 / (shipProperties.length + (shipProperties.length * 0.1) - 0.4)) + "%");
	//$(".setUpShipsRowArea").css("position", "relative");
	$(".setUpShipsRowArea").css("margin-top", "5%");

	$(".setUpShipsRowAreaRowUsedGameFields").css("width", (100 / ship.biggestShip().gameFields) + "%");
}

//Cell ids: place-x-y where x = (row + 1) and y = (col + 1); fieldSize + 1 > x,y >= 1
function initializeGameField(areaId, fieldClass = "") {
	for(let row = 0; row < fieldSize; row++) {
		let rowNode = $("<div class='boardRow'></div>");
		$(areaId).append(rowNode);

		for(let col = 0; col < fieldSize; col++) {
			let id = "place-" + (row + 1) + "-" + (col + 1);
			rowNode.append($("<div class='boardField " + fieldClass + "' id='" + id + "'></div>"));
		}
	}

	//$(".boardRow").css("height", (100 / fieldSize) + "%");
	$(".boardField").css("position", "relative");
	$(".boardField").css("padding-top", (100 / fieldSize) + "%");

	$(".boardField").css("width", (100 / fieldSize) + "%");
	$(".boardField").css("background-color", freeBoardField);
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

	for(i = 0; i < highscores.length; i++) {
		let row = $('<span/>', {class: 'row'});
		let name = $('<span/>', {class: "col-xs-8"});
		name.append(highscores[i].name);
		let score = $('<span/>', {class: "col-xs-4"});
		score.append(highscores[i].points + " Pt.");
		container.append(name);
		container.append(score);
		container.append('<br/><hr/>');
	}
}
