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
			//Debug function
			$("#place-" + i + "-" + j).html("");
		}
	}
}

function positionPossible(row, col, occupiedFields){
	for(let i = 0; i < occupiedFields.length; i++){
		var occRow = "";
		var occCol = "";

		for(let rowCharacters = 0; rowCharacters < occupiedFields[i].indexOf("-"); rowCharacters++){
			occRow += occupiedFields[i][rowCharacters];
		}
		for(let colCharacter = occupiedFields[i].indexOf("-") + 1; colCharacter < occupiedFields[i].length; colCharacter++){
			occCol += occupiedFields[i][colCharacter];
		}

		if(occRow == row && occCol == col){
			return false;
		}
	}
	return true;
}

function setUpShipsRandomly(shipProperties){
	clearField();

	var maxFields = fieldSize * fieldSize;
	var occupiedFields = [];

	for(let i = 0; i < shipProperties.length; i++){
		var usedColor = shipColor;
		//Debug feature: Mark ships with different colors
		/*
		var shipColors = ['#e01818','#0bec0b','#e40bec','#fb92ec'];
		switch(i){
			case 0: usedColor = shipColors[0]; break;
			case 1: usedColor = shipColors[1]; break;
			case 2: usedColor = shipColors[2]; break;
			case 3: usedColor = shipColors[3]; break;
		}
		*/

		for(let j = 0; j < ship[shipProperties[i]].amount; j++){
			var possibileDirection = [];
			var setRow;
			var setCol;
			var setDirection;

			var failure = true;
			while(failure){
				var row = getRandomInt(1, fieldSize);
				var col = getRandomInt(1, fieldSize);

				if(positionPossible(row, col, occupiedFields)){
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
			}
			//Set Ship
			for(let shipFields = 0; shipFields < ship[shipProperties[i]].gameFields; shipFields++){
				//Debug feature: Set direction in ship core
				
				if(shipFields == 0){
					var directionsSet = $("#place-" + setRow + "-" + setCol).html() + " " + setDirection;
					$("#place-" + setRow + "-" + setCol).html(directionsSet);
				}
				
				//Push into occupiedFields and set background-color
				switch(setDirection){
					case 1: 
						$("#place-" + (setRow - shipFields) + "-" + setCol).css("background-color", usedColor);
						//Debug feature: Set Row and Col in ship field
						//$("#place-" + (setRow - shipFields) + "-" + setCol).html(setRow - shipFields + "-" + setCol);

						occupiedFields.push(setRow - shipFields + "-" + setCol);
						//Checking field lower to the ship core
						if(shipFields == 0 && setRow + 1 <= fieldSize){
							occupiedFields.push(setRow + 1 + "-" + setCol);
							//Checking left border
							if(setCol - 1 > 0){
								occupiedFields.push(setRow + 1 + "-" + (setCol - 1));
							}
							//Checking right border
							if(setCol + 1 <= fieldSize){
								occupiedFields.push(setRow + 1 + "-" + (setCol + 1));
							}
						}
						//Checking field above the last ship field
						if(shipFields + 1 >= ship[shipProperties[i]].gameFields && setRow - shipFields - 1 > 0){
							occupiedFields.push(setRow - shipFields - 1 + "-" + setCol);
							//Checking left border
							if(setCol - 1 > 0){
								occupiedFields.push(setRow - shipFields - 1 + "-" + (setCol - 1));
							}
							//Checking right border
							if(setCol + 1 <= fieldSize){
								occupiedFields.push(setRow - shipFields - 1 + "-" + (setCol + 1));
							}
						}
						//Checking for left border
						if(setCol - 1 > 0){
							occupiedFields.push(setRow - shipFields + "-" + (setCol - 1));
						}
						//Checking for right border
						if(setCol + 1 <= fieldSize){
							occupiedFields.push(setRow - shipFields + "-" + (setCol + 1));
						}
						break;
					case 2: 
						$("#place-" + setRow + "-" + (setCol + shipFields)).css("background-color", usedColor);
						//Debug feature: Set Row and Col in ship field
						//$("#place-" + setRow + "-" + (setCol + shipFields)).html(setRow + "-" + (setCol + shipFields));

						occupiedFields.push(setRow + "-" + (setCol + shipFields));
						//Checking field left to the ship core
						if(shipFields == 0 && setCol - 1 > 0){
							occupiedFields.push(setRow + "-" + (setCol - 1));
							//Checking upper border
							if(setRow - 1 > 0){
								occupiedFields.push(setRow - 1 + "-" + (setCol - 1));
							}
							//Checking lower border
							if(setRow + 1 <= fieldSize){
								occupiedFields.push(setRow + 1 + "-" + (setCol - 1));
							}
						}
						//Checking field right to the last ship field
						if(shipFields + 1 >= ship[shipProperties[i]].gameFields && setCol + shipFields + 1 <= fieldSize){
							occupiedFields.push(setRow + "-" + (setCol + shipFields + 1));
							//Checking upper border
							if(setRow - 1 > 0){
								occupiedFields.push(setRow - 1 + "-" + (setCol + shipFields + 1));
							}
							//Checking lower border
							if(setRow + 1 <= fieldSize){
								occupiedFields.push(setRow + 1 + "-" + (setCol + shipFields + 1));
							}
						}
						//Checking for upper border
						if(setRow - 1 > 0){
							occupiedFields.push(setRow - 1 + "-" + (setCol + shipFields));
						}
						//Checking for lower border
						if(setRow + 1 <= fieldSize){
							occupiedFields.push(setRow + 1 + "-" + (setCol + shipFields));
						}
						break;
					case 3: 
						$("#place-" + (setRow + shipFields) + "-" + setCol).css("background-color", usedColor);
						//Debug feature: Set Row and Col in ship field
						//$("#place-" + (setRow + shipFields) + "-" + setCol).html(setRow + shipFields + "-" + setCol);
						
						occupiedFields.push(setRow + shipFields + "-" + setCol);
						//Checking field above the ship core
						if(shipFields == 0 && setRow - 1 > 0){
							occupiedFields.push(setRow - 1 + "-" + setCol);
							//Checking left border
							if(setCol - 1 > 0){
								occupiedFields.push(setRow - 1 + "-" + (setCol - 1));
							}
							//Checking right border
							if(setCol + 1 <= fieldSize){
								occupiedFields.push(setRow - 1 + "-" + (setCol + 1));
							}
						}
						//Checking field lower the last ship field
						if(shipFields + 1 >= ship[shipProperties[i]].gameFields && setRow + shipFields + 1 <= fieldSize){
							occupiedFields.push(setRow + shipFields + 1 + "-" + setCol);
							//Checking left border
							if(setCol - 1 > 0){
								occupiedFields.push(setRow + shipFields + 1 + "-" + (setCol - 1));
							}
							//Checking right border
							if(setCol + 1 <= fieldSize){
								occupiedFields.push(setRow + shipFields + 1 + "-" + (setCol + 1));
							}
						}
						//Checking for left border
						if(setCol - 1 > 0){
							occupiedFields.push(setRow + shipFields + "-" + (setCol - 1));
						}
						//Checking for right border
						if(setCol + 1 <= fieldSize){
							occupiedFields.push(setRow + shipFields + "-" + (setCol + 1));
						}
						break;
					case 4:
						$("#place-" + setRow + "-" + (setCol - shipFields)).css("background-color", usedColor);
						//Debug feature: Set Row and Col in ship field
						//$("#place-" + setRow + "-" + (setCol - shipFields)).html(setRow + "-" + (setCol - shipFields));
						
						occupiedFields.push(setRow + "-" + (setCol - shipFields));
						//Checking field right to the ship core
						if(shipFields == 0 && setCol + 1 <= fieldSize){
							occupiedFields.push(setRow + "-" + (setCol + 1));
							//Checking upper border
							if(setRow - 1 > 0){
								occupiedFields.push(setRow - 1 + "-" + (setCol + 1));
							}
							//Checking lower border
							if(setRow + 1 <= fieldSize){
								occupiedFields.push(setRow + 1 + "-" + (setCol + 1));
							}
						}
						//Checking field left to the last ship field
						if(shipFields + 1 >= ship[shipProperties[i]].gameFields && setCol - shipFields - 1 > 0){
							occupiedFields.push(setRow + "-" + (setCol - shipFields - 1));
							//Checking upper border
							if(setRow - 1 > 0){
								occupiedFields.push(setRow - 1 + "-" + (setCol - shipFields - 1));
							}
							//Checking lower border
							if(setRow + 1 <= fieldSize){
								occupiedFields.push(setRow + 1 + "-" + (setCol - shipFields - 1));
							}
						}
						//Checking for upper border
						if(setRow - 1 > 0){
							occupiedFields.push(setRow - 1 + "-" + (setCol - shipFields));
						}
						//Checking for lower border
						if(setRow + 1 <= fieldSize){
							occupiedFields.push(setRow + 1 + "-" + (setCol - shipFields));
						}
						break;
					default: alert("Fehler beim Setzen des Schiffes: " + ship[shipProperties[i]].name);
				}
			}
		}
	}
	//Debug feature: Show occupied fields
	/*
	var occupiedFieldsString = "";
	for(let z = 0; z < occupiedFields.length; z++){
		if(z > 0){
			occupiedFieldsString += " | ";
		}
		occupiedFieldsString += occupiedFields[z];
	}
	alert(occupiedFieldsString);
	*/
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
