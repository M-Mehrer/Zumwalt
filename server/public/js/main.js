const fieldSize = 10;
const shipColor = '#40413f';
const freeBoardField = 'rgb(20, 159, 214)';

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
			$("#place-" + i + "-" + j).css("background-color", freeBoardField);
			//Debug function
			$("#place-" + i + "-" + j).html("");
		}
	}
}

function shipLiesInGamefield(row, col, shipUsedGamefields){
	var possibleDirection = [];

	//Check north
	if(row - shipUsedGamefields >= 0){
		possibleDirection.push(1);
	}
	//Check east
	if(col + shipUsedGamefields <= fieldSize){
		possibleDirection.push(2);
	}
	//Check south
	if(row + shipUsedGamefields <= fieldSize){
		possibleDirection.push(3);
	}
	//Check west
	if(col - shipUsedGamefields >= 0){
		possibleDirection.push(4);
	}

	return possibleDirection;
}

function alertArray(arrayToAlert){
	var arrayString = "";

	for(let i = 0; i < arrayToAlert.length; i++){
		if(i > 0){
			arrayString += "| ";
		}
		arrayString += arrayToAlert[i];
	}

	alert(arrayString);
}


function getFreeFields(){
	var freeFields = [];

	for(let row = 1; row <= fieldSize; row++){
		for(let col = 1; col <= fieldSize; col++){
			var isFree = true;
			if($("#place-" + row + "-" + col).css('backgroundColor') == freeBoardField){
				//Check north
				if(row - 1 > 0){
					if(!($("#place-" + (row - 1) + "-" + col).css('backgroundColor') == freeBoardField)){
						isFree = false;
					}
					if(col - 1 > 0){
						if(!($("#place-" + (row - 1) + "-" + (col - 1)).css('backgroundColor') == freeBoardField)){
							isFree = false;
						}
					}
					if(col + 1 <= fieldSize){
						if(!($("#place-" + (row - 1) + "-" + (col + 1)).css('backgroundColor') == freeBoardField)){
							isFree = false;
						}
					}
				}
				//Check east
				if(col + 1 <= fieldSize){
					if(!($("#place-" + row + "-" + (col + 1)).css('backgroundColor') == freeBoardField)){
						isFree = false;
					}
					if(row + 1 <= fieldSize){
						if(!($("#place-" + (row + 1) + "-" + (col + 1)).css('backgroundColor') == freeBoardField)){
							isFree = false;
						}
					}
				}
				//Check south
				if(row + 1 <= fieldSize){
					if(!($("#place-" + (row + 1) + "-" + col).css('backgroundColor') == freeBoardField)){
						isFree = false;
					}
					if(col - 1 > 0){
						if(!($("#place-" + (row + 1) + "-" + (col - 1)).css('backgroundColor') == freeBoardField)){
							isFree = false;
						}
					}
				}
				//Check west
				if(col - 1 > 0){
					if(!($("#place-" + row + "-" + (col - 1)).css('backgroundColor') == freeBoardField)){
						isFree = false;
					}
				}

				if(isFree){
					freeFields.push(row + "-" + col);
				}
			}	
		}
	}

	return freeFields;
}

/**
 * returns array with: array[0] = [int] row and array[1] = [int] col; from string with: var string = 'row-col';
 * @param {*} string with format: 'row-col';
 */
function getRowAndColFromString(string){
	var row = "";
	var col = "";
	var parsedCoordinates = [];

	for(let i = 0; i < string.indexOf("-"); i++){
		row += string[i];
	}
	for(let i = string.indexOf("-") + 1; i < string.length; i++){
		col += string[i];
	}

	parsedCoordinates[0] = parseInt(row);
	parsedCoordinates[1] = parseInt(col);

	return parsedCoordinates;
} 

function getAllShips(shipProperties){
	var ships = [];

	for(let actualShipProperty = 0; actualShipProperty < shipProperties.length; actualShipProperty++){
		for(let shipNumber = 0; shipNumber < ship[shipProperties[actualShipProperty]].amount; shipNumber++){
			ships.push(ship[shipProperties[actualShipProperty]].name);
		}
	}

	return ships;
}

function setUpShipsRandomly(){	
	var shipProperties = ship.shipProperties();
	var shipsToSetUp = getAllShips(shipProperties);
	
	while(shipsToSetUp.length > 0){
		clearField();
		var freeFields = getFreeFields();
		shipsToSetUp = getAllShips(shipProperties);

		for(let actualShipProperty = 0; actualShipProperty < shipProperties.length; actualShipProperty++){
			for(let shipNumber = 0; shipNumber < ship[shipProperties[actualShipProperty]].amount; shipNumber++){	
				var tmpFreeFields = freeFields.slice();		
				var actualShipNotSetInGameField = true;

				while(tmpFreeFields.length > 0 && actualShipNotSetInGameField){
					var position = getRowAndColFromString(tmpFreeFields[getRandomInt(0, tmpFreeFields.length - 1)]);
					var row = position[0];
					var col = position[1];
					var shipGamefieldDirections = shipLiesInGamefield(row, col, (ship[shipProperties[actualShipProperty]].gameFields));
					var randDirection;
					
					var possibleDirection = false;
					while(!possibleDirection && shipGamefieldDirections.length > 0){
						randDirection = shipGamefieldDirections[getRandomInt(0, shipGamefieldDirections.length - 1)];

						//First field is always free
						for(let shipFields = 1, fieldPossible = true; shipFields < ship[shipProperties[actualShipProperty]].gameFields && fieldPossible; shipFields++){
							var usedRow = row;
							var usedCol = col;

							switch(randDirection){
								case 1: usedRow -= shipFields; break;
								case 2: usedCol += shipFields; break;
								case 3: usedRow += shipFields; break;
								case 4: usedCol -= shipFields; break;
								default: alert("main.js -> setUpShipsRandomly() -> fehlerhafte Himmelsrichtung: " + randDirection);
							}

							var isFree = false;
							for(let freeFieldIndex = 0; freeFieldIndex < tmpFreeFields.length; freeFieldIndex++){
								if((usedRow + "-" + usedCol) === tmpFreeFields[freeFieldIndex]){
									isFree = true;
								}
							}

							if(!isFree){
								fieldPossible = false;
								possibleDirection = false;
								var indexPositionToShift = findIndexOfValueInArray(randDirection, shipGamefieldDirections);
								shipGamefieldDirections.splice(indexPositionToShift, 1);
							}
							else{
								possibleDirection = true;
							}
						}
					}
					
					//Set ship in gamefield
					if(possibleDirection){
						$("#place-" + row + "-" + col).css('backgroundColor', shipColor);

						//Debug feature: Show Ship directions in ship core
						//$("#place-" + row + "-" + col).html(randDirection);

						for(let shipFields = 1; shipFields < ship[shipProperties[actualShipProperty]].gameFields; shipFields++){
							let usedRow = row;
							let usedCol = col;

							switch(randDirection){
								case 1: usedRow -= shipFields; break;
								case 2: usedCol += shipFields; break;
								case 3: usedRow += shipFields; break;
								case 4: usedCol -= shipFields; break;
								default: alert("main.js -> setUpShipsRandomly -> fehlerhafte Himmelsrichtung: " + randDirection);
							}
							$("#place-" + usedRow + "-" + usedCol).css('background-color', shipColor);
						}
						freeFields = getFreeFields();
						actualShipNotSetInGameField = false;
						var indexPositionToShift = findIndexOfValueInArray(ship[shipProperties[actualShipProperty]].name, shipsToSetUp);
						shipsToSetUp.shift(indexPositionToShift);		
					}
					else{
						var indexPositionToShift = findIndexOfValueInArray(row + "-" + col, tmpFreeFields);
						tmpFreeFields.splice(indexPositionToShift, 1);
					}
				}
			}	
		}
	}
}
	
function findIndexOfValueInArray(value, array){
	for(let i = 0; i < array.length; i++){
		if(value === array[i]){
			return i;
		}
	}
	return -1;
}

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
		setUpShipsRandomly();
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
	$(".boardField").css("background-color", freeBoardField);
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
