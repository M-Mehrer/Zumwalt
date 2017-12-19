const fieldSize = 10;

var myField;

// Initializations
$(document).ready(function() {
	initializeGameField('#myShips', 'activeField');
	initializeShips('#otherShips');
	//Erst Shiffe setzen dann das Gegnerboard initialisieren
	//initializeGameField('#otherShips');

	//$("#playerInputModal").modal("show");

});

//Uses ships.js which is embedded in index.html
function initializeShips(areaId){
	var shipProperties = [];
	shipProperties = ship.shipProperties();

	let node = $("<div class='setUpShips rFrame'></div>");

	//todo: Hinzufügen weiterer Schiffe darf nicht das Layout sprengen 
	//let setUpShipsRowAreaHeight = 
	for(let row = 0; row < shipProperties.length; row++){
		let shipsRowNode = $("<div class='row area setUpShipsRowArea bFrame'></div>");
		$(node).append(shipsRowNode);

		shipsRowNode.append($("<div class='col-xs-1 col-md-1 setUpShipsRowAreaRow frame'>" + ship[shipProperties[row]].amount + "</div>"));
		shipsRowNode.append($("<div class='col-xs-7 col-md-7 setUpShipsRowAreaRow frame'>" + ship[shipProperties[row]].name + "</div>"));

		let shipGameFields = "<div class='col-xs-4 col-md-4 setUpShipsRowAreaRow frame'>";
		for(let fields = 0; fields < ship[shipProperties[row]].gameFields; fields++){
			shipGameFields += "<div class='setUpShipsRowAreaRowUsedGameFields'></div>";
		}
		shipGameFields += "</div>";
		shipsRowNode.append($(shipGameFields));
	}

	node.append($("<div class='setUpShipsFooter pFrame'>Footer</div>"));
	$(areaId).append(node);

	$(".setUpShipsRowArea").css("height", (76 / (shipProperties.length + (shipProperties.length * 0.1) - 0.4)) + "%");
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

	$(".boardRow").css("height", (100 / fieldSize) + "%");
	$(".boardField").css("width", (100 / fieldSize) + "%");
	//$(".boardField").css("padding-top", (100 / fieldSize) + "%");
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
