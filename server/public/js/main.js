const fieldSize = 10;
//const fieldBackgroundColor = '#0cadf8';

var myField;

// Initializations
$(document).ready(function() {
	initializeGameField('#myShips', 'activeField');
	initializeShips('#showShips');
	//Erst Shiffe setzen dann das Gegnerboard initialisieren
	//initializeGameField('#otherShips');

	//$("#playerInputModal").modal("show");

});

//Uses ships.js which is embedded in index.html
function initializeShips(areaId){
	var shipProperties = [];
	shipProperties = ship.shipProperties();

	let node = $("<div></div>");
	for(let row = 0; row < shipProperties.length; row++){
		let rowNode = $("<div class='boardRow'></div>");
		$(node).append(rowNode);

		let shipGameFields = "<div class='shipFieldLeft frame'>";

		for(let fields = 0; fields < ship[shipProperties[row]].gameFields; fields++){
			shipGameFields += "<div class='boardField shipField'></div>";
			$(".shipField").css("width", (100 / ship[shipProperties[row]].amount) + "%");
		}

		shipGameFields += "</div>";
		rowNode.append($(shipGameFields));
		rowNode.append($("<div class='shipFieldMiddle frame'>" + ship[shipProperties[row]].name + "</div>"));
		rowNode.append($("<div class='shipFieldRight frame'>" + ship[shipProperties[row]].amount + "</div>"));
	}

	node.append($("<div class='shipFieldFooter frame'>Footer</div>"));
	$(areaId).append(node);

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

	$(".boardField").css("width", (100 / fieldSize) + "%");
	$(".boardField").css("padding-top", (100 / fieldSize) + "%");
	//$(".boardField").css("background-color", fieldBackgroundColor);
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
