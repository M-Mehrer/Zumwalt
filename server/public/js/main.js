const fieldSize = 10;
const shipColor = '#40413f';

var myField;

// Initializations
$(document).ready(function() {
	initializeGameField('#myShips', 'activeField');
	initializeShips('#otherShips');
	//Erst Shiffe setzen dann das Gegnerboard initialisieren
	//initializeGameField('#otherShips');

	//$("#playerInputModal").modal("show");

});

function countAmountOfShipsToSetUp(shipProperties){
	var amountOfShips = 0;

	if(shipProperties instanceof Array){
		for(let i = 0; i < shipProperties.length; i++){
			amountOfShips += ship[shipProperties[i]].amount;
		}
	}

	return amountOfShips;
}

//Returns a random integer between min (inclusive) and 1624770 (inclusive)
function getRandomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clearField(){
	for(let i = 1; i <= fieldSize; i++){
		for(let j = 1; j <= fieldSize; j++){
			$("#place-" + i + "-" + j).css("background-color", "#0cadf8");
		}
	}
}

function setUpShipsRandomly(shipProperties){
	clearField();

	for(let i = 0; i < shipProperties.length; i++){
		for(let j = 0; j < ship[shipProperties[i]].amount; j++){
			var possibileDirection = [];
			var setRow;
			var setCol;
			var setDirection;

			var failure = true;
			while(failure){
				var row = getRandomInt(1, fieldSize);
				var col = getRandomInt(1, fieldSize);

				//1 = north, clockwise
				//direction north possible
				if(row - ship[shipProperties[i]].gameFields >= 0){
					possibileDirection.push(1);
				}
				if(col + ship[shipProperties[i]].gameFields <= fieldSize){
					possibileDirection.push(2);
				}
				if(row + ship[shipProperties[i]].gameFields <= fieldSize){
					possibileDirection.push(3);
				}
				if(col - ship[shipProperties[i]].gameFields >= 0){
					possibileDirection.push(4);
				}

				if(possibileDirection.length > 0){
					failure = false;
					setRow = row;
					setCol = col;
					setDirection = possibileDirection[getRandomInt(0, possibileDirection.length - 1)];
				}
			}
			//Set Ship
			for(let shipFields = 0; shipFields < ship[shipProperties[i]].gameFields; shipFields++){
				//Mark ship core
				var usedColor = '#aa681d';
				if(shipFields > 0){
					usedColor = shipColor;
				}
				switch(setDirection){
					case 1: 
						$("#place-" + (setRow - shipFields) + "-" + setCol).css("background-color", usedColor);
						break;
					case 2: 
						$("#place-" + setRow + "-" + (setCol + shipFields)).css("background-color", usedColor);
						break;
					case 3: 
						$("#place-" + (setRow + shipFields) + "-" + setCol).css("background-color", usedColor);
						break;
					case 4:
						$("#place-" + setRow + "-" + (setCol - shipFields)).css("background-color", usedColor);
						break;
					default: alert("Fehler beim Setzen des Schiffes: " + ship[shipProperties[i]].name);
				}
			}
		}
	}
}
//Fehler, soll sein: for(let j = 0; j < ship[shipProperties[i]].amount; j++){
/*function setUpShipsRandomly(shipProperties){
	var failurePosition = [];

	for(let i = 0; i < shipProperties.length; i++){
		for(let j = 0; j < ship[shipProperties[i]].gameFields; j++){
			var failure = true;
			var possibileDirection = [];
			var setRow;
			var setCol;
			//Or free fields
			while(failure){
				var row = getRandomInt(1, fieldSize);
				var col = getRandomInt(1, fieldSize);
				
				//There is already a ship
				if($("#place-" + row + "-" + col).css("background-color") == shipColor){
					//failurePosition.push([...]); Mögl.?
					failurePosition[failurePosition.length][0] = row;
					failurePosition[failurePosition.length][1] = col;
				}
				else{
					//1 = north, clockwise
					//Ship can set up to north
					if(row - ship[shipProperties[i]].gameFields - 1 >= 0){
						var northDirection = true;
						for(let shipFields = 1; shipFields < ship[shipProperties[i]].gameFields; shipFields++){
							if($("#place-" + (row - shipFields) + "-" + col).css("background-color") == shipColor){
								northDirection = false;
								//skip 
								shipFields += ship[shipProperties[i]].gameFields;
							}							}
						if(northDirection){
							possibileDirection.push(1);
						}
					}
					//Ship can set up to east
					if(col + ship[shipProperties[i]].gameFields <= fieldSize){
						var eastDirection = true;
						for(let shipFields = 1; shipFields < ship[shipProperties[i]].gameFields; shipFields++){
							if($("#place-" + row + "-" + (col + shipFields)).css("background-color") == shipColor){
								eastDirection = false;
								//skip
								shipFields += ship[shipProperties[i]].gameFields;
							}
						}
						if(eastDirection){
							possibileDirection.push(2);
						}
					}
					//Ship can set up to south		
					if(row + ship[shipProperties[i]].gameFields - 1 <= fieldSize){
						var southDirection = true;
						for(let shipFields = 1; shipFields < ship[shipProperties[i]].gameFields; shipFields++){
							if($("#place-" + (row + shipFields) + "-" + col).css("background-color") == shipColor){
								southDirection = false;
								//skip
								shipFields += ship[shipProperties[i]].gameFields;
							}
						}
						if(southDirection){
							possibileDirection.push(3);
						}
					}
					//Ship can set up to west
					if(col - ship[shipProperties[i]].gameFields >= 0){
						var westDirection = true;
						for(let shipFields = 1; shipFields < ship[shipProperties[i]].gameFields; shipFields++){
							if($("#place-" + row + "-" + (col - shipFields)).css("background-color") == shipColor){
								westDirection = false;
								//skip
								shipFields += ship[shipProperties[i]].gameFields;
							}
						}
						if(westDirection){
							possibileDirection.push(4);
						}
					}		
				}

				if(possibileDirection.length > 0){
					failure = false;
					setRow = row;
					setCol = col;
				}
				else{
					failurePosition[failurePosition.length][0] = row;
					failurePosition[failurePosition.length][1] = col;
				}
			}
			//Get direction
			//var direction
			//Set ship in game field
			for(let shipFields = 1; shipFields < shipProperties[i].gameFields; shipFields++){

			}


		}
	}
}*/

//Uses ships.js which is embedded in index.html
function initializeShips(areaId){
	var shipProperties = ship.shipProperties();
	var amountOfShips = countAmountOfShipsToSetUp(shipProperties);
	var settedShipsCoordinates = [];

	let node = $("<div class='setUpShips rFrame'></div>");

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

	let setUpShipsFooterNode = "<div class='setUpShipsFooter pFrame'>";
			setUpShipsFooterNode += "<div class='btn-group btn-group-justified height'>";
				setUpShipsFooterNode += "<div class='btn-group height'>";
					setUpShipsFooterNode += "<button id='setUpShipsRandomly' type='button' class='btn btn-primary active setUpShipsFooterButtons'>Zufällig anordnen</button>";
				setUpShipsFooterNode += "</div>";
				setUpShipsFooterNode += "<div class='btn-group height'>";
					setUpShipsFooterNode += "<button id='sendShipsToServer' type='button' class='btn btn-primary disabled setUpShipsFooterButtons'><span class='badge'>" + amountOfShips + "</span> Noch zu setzen</button>";
					setUpShipsFooterNode += "</div>";
			setUpShipsFooterNode += "</div>";
		setUpShipsFooterNode += "</div>";
	
	node.append($(setUpShipsFooterNode));
	$(areaId).append(node);

	//Buttons click events
	$("#setUpShipsRandomly").click(function(){
		setUpShipsRandomly(shipProperties);
	});

	//Dynamic css
	$(".setUpShipsRowAreaRowUsedGameFields").css("background-color", shipColor);
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
