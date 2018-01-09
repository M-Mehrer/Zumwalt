/* global $, fieldSize, freeBoardField, shipColor, ship */

function countAmountOfShipsToSetUp(shipProperties){ // eslint-disable-line no-unused-vars 
	var amountOfShips = 0;

	if(shipProperties instanceof Array){
		for(let i = 0; i < shipProperties.length; i++){
			amountOfShips += ship[shipProperties[i]].amount;
		}
	}

	return amountOfShips;
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

/**
 * Initializes the gamefield cells with 0 (empty).
 * The Zero Positions are reservated for Koordinates (1 - 10)(A - J)
 */
function initializeBoard(){
	let emptyBoard = [];

	for(let row = 0; row <= fieldSize; row++){
		emptyBoard[row] = [];

		for(let col = 0; col <= fieldSize; col++){
			emptyBoard[row][col] = 0;
		}
	}

	return emptyBoard;
}

function getAvailableFields(board){
	var availableFields = [];
	
	for(let row = 1; row <= fieldSize; row++){
		for(let col = 1; col <= fieldSize; col++){
			let isAvailable = true;

			if(board[row][col] === 0){
				//Check north
				if(row - 1 > 0){
					if(!(board[row - 1][col] === 0)){
						isAvailable = false;
					}
					if(col - 1 > 0){
						if(!(board[row - 1][col - 1] === 0)){
							isAvailable = false;
						}
					}
					if(col + 1 <= fieldSize){
						if(!(board[row - 1][col + 1] === 0)){
							isAvailable = false;
						}
					}
				}
				//Check east
				if(col + 1 <= fieldSize){
					if(!(board[row][col + 1] === 0)){
						isAvailable = false;
					}
					if(row + 1 <= fieldSize){
						if(!(board[row + 1][col + 1] === 0)){
							isAvailable = false;
						}
					}
				}
				//Check south
				if(row + 1 <= fieldSize){
					if(!(board[row + 1][col] === 0)){
						isAvailable = false;
					}
					if(col - 1 > 0){
						if(!(board[row + 1][col - 1] === 0)){
							isAvailable = false;
						}
					}
				}
				//Check west
				if(col - 1 > 0){
					if(!(board[row][col - 1] === 0)){
						isAvailable = false;
					}
				}
			}
			else{
				isAvailable = false;
			}

			if(isAvailable){
				availableFields.push(row + "-" + col);
			}
		}
	}

	return availableFields;
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

/**
 * Uses a two dimensional array of int to create the gamefield.
 * 0 -> No ship
 * 1 -> Ship
 * @param {2dim int Array} board 
 * @param {html id to bind the gamefield} idHtmlContainer 
 * @param {true/false if the gamefield be active to shoot on it} isActiveField 
 */
function renderGameField(board, idHtmlContainer, isActiveField){
	let alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
	let id;
	let activeFieldClass = "";
	if(isActiveField){
		activeFieldClass = "activeField";
	}

	for(let row = 0; row <= fieldSize; row++){
		let rowNode = $('<div class="boardRow"></div>');

		for(let col = 0; col <= fieldSize; col++){
			if(row === 0 && col === 0){
				rowNode.append($('<div class="boardField"></div>'));
			}
			else if(row === 0){
				rowNode.append($('<div class="boardField boardFieldCoordinate">' + alphabet[col - 1] + '</div>'));
			}
			else if(col === 0){
				rowNode.append($('<div class="boardField boardFieldCoordinate">' + row + '</div>'));
			}
			else{
				let id = "#place-" + row + "-" + col;

				if(board[row][col] === 1){
					rowNode.append($('<div id="' + id + '" class="boardField ' + activeFieldClass + ' shipBgColor"></div>'));
				}
				else{
					rowNode.append($('<div id="' + id + '" class="boardField ' + activeFieldClass + ' freeBordfieldBgColor"></div>'));
				}
			}
		}
		$(idHtmlContainer).append(rowNode);
	}

	//Dynamic size of cells
	$(".boardRow").css("height", (100 / (fieldSize + 1)) + "%");
	$(".boardField").css("width", (100 / (fieldSize + 1)) + "%");
}

function setUpShipsRandomly(){ // eslint-disable-line no-unused-vars 
	let shipProperties = ship.shipProperties();
	let shipsToSetUp = getAllShips(shipProperties);
	let shipCoordinatesForServerIndex = 0;
	shipCoordinatesForServer = {"ships":[]};
	
	while(shipsToSetUp.length > 0){
		board = initializeBoard();
		let freeFields = getAvailableFields(board);
		shipsToSetUp = getAllShips(shipProperties);

		for(let actualShipProperty = 0; actualShipProperty < shipProperties.length; actualShipProperty++){
			for(let shipNumber = 0; shipNumber < ship[shipProperties[actualShipProperty]].amount; shipNumber++){	
				let tmpFreeFields = freeFields.slice();		
				let actualShipNotSetInGameField = true;
				shipCoordinatesForServer.ships[shipCoordinatesForServerIndex] = [];

				while(tmpFreeFields.length > 0 && actualShipNotSetInGameField){
					let position = getRowAndColFromString(tmpFreeFields[getRandomInt(0, tmpFreeFields.length - 1)]); // eslint-disable-line no-undef
					let row = position[0];
					let col = position[1];
					let shipGamefieldDirections = shipLiesInGamefield(row, col, (ship[shipProperties[actualShipProperty]].gameFields));
					let randDirection;
					
					let possibleDirection = false;
					while(!possibleDirection && shipGamefieldDirections.length > 0){
						randDirection = shipGamefieldDirections[getRandomInt(0, shipGamefieldDirections.length - 1)]; // eslint-disable-line no-undef

						//First field is always free
						for(let shipFields = 1, fieldPossible = true; shipFields < ship[shipProperties[actualShipProperty]].gameFields && fieldPossible; shipFields++){
							let usedRow = row;
							let usedCol = col;

							switch(randDirection){
							case 1: usedRow -= shipFields; break;
							case 2: usedCol += shipFields; break;
							case 3: usedRow += shipFields; break;
							case 4: usedCol -= shipFields; break;
							default: 
								if(debug){
									alert("main.js -> setUpShipsRandomly() -> fehlerhafte Himmelsrichtung: " + randDirection);
								}			
							}

							let isFree = false;
							for(let freeFieldIndex = 0; freeFieldIndex < tmpFreeFields.length; freeFieldIndex++){
								if((usedRow + "-" + usedCol) === tmpFreeFields[freeFieldIndex]){
									isFree = true;
								}
							}

							if(!isFree){
								fieldPossible = false;
								possibleDirection = false;
								let indexPositionToShift = shipGamefieldDirections.indexOf(randDirection);
								shipGamefieldDirections.splice(indexPositionToShift, 1);
							}
							else{
								possibleDirection = true;
							}
						}
					}
					
					//Set ship in gamefield
					if(possibleDirection){
						//Wenn die Information über den Schiffsnamen gebraucht wird. row und col liegen dann auf Index 1 und 2
						//shipCoordinatesForServer.ships[shipCoordinatesForServerIndex][0][0] = ship[shipProperties[actualShipProperty]].name;
						shipCoordinatesForServer.ships[shipCoordinatesForServerIndex][0] = [];
						shipCoordinatesForServer.ships[shipCoordinatesForServerIndex][0][0] = row;
						shipCoordinatesForServer.ships[shipCoordinatesForServerIndex][0][1] = col;
						
						//Set ship core
						board[row][col] = 1;

						for(let shipFields = 1; shipFields < ship[shipProperties[actualShipProperty]].gameFields; shipFields++){
							shipCoordinatesForServer.ships[shipCoordinatesForServerIndex][shipFields] = [];
							let usedRow = row;
							let usedCol = col;

							switch(randDirection){
							case 1: usedRow -= shipFields; break;
							case 2: usedCol += shipFields; break;
							case 3: usedRow += shipFields; break;
							case 4: usedCol -= shipFields; break;
							default: 
								if(debug){
									alert("main.js -> setUpShipsRandomly -> fehlerhafte Himmelsrichtung: " + randDirection);
								}	 		
							}				
							shipCoordinatesForServer.ships[shipCoordinatesForServerIndex][shipFields][0] = usedRow;
							shipCoordinatesForServer.ships[shipCoordinatesForServerIndex][shipFields][1] = usedCol;
							board[usedRow][usedCol] = 1;
						}
						shipCoordinatesForServerIndex++;
						freeFields = getAvailableFields(board);
						actualShipNotSetInGameField = false;
						let indexPositionToShift = shipsToSetUp.indexOf(ship[shipProperties[actualShipProperty]].name);
						shipsToSetUp.shift(indexPositionToShift);
						
						$("#buttonNumberOfShips").text(shipsToSetUp.length);	
						if(shipsToSetUp.length == 0){
							$("#sendShipsToServer").removeClass("disabled").addClass("active");
							$("#sendShipsToServer").text("Bereit");
						}	
					}
					else{
						let indexPositionToShift = tmpFreeFields.indexOf(row + "-" + col);
						tmpFreeFields.splice(indexPositionToShift, 1);
					}
				}
			}	
		}
	}
	$('#myGameField').html("");
	renderGameField(board, '#myGameField', true);
}