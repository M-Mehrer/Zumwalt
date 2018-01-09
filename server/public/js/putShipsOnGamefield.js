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
			var isAvailable = true;
			if(board[row][col] === 0){
				//Check north
				if(row - 1 > 0){
					if(!board[row - 1][col] === 0){
						isAvailable = false;
					}
					if(col - 1 > 0){
						if(!board[row - 1][col - 1] === 0){
							isAvailable = false;
						}
					}
					if(col + 1 <= fieldSize){
						if(!board[row - 1][col + 1] === 0){
							isAvailable = false;
						}
					}
				}
				//Check east
				if(col + 1 <= fieldSize){
					if(!board[row][col + 1] === 0){
						isAvailable = false;
					}
					if(row + 1 <= fieldSize){
						if(!board[row + 1][col + 1] === 0){
							isAvailable = false;
						}
					}
				}
				//Check south
				if(row + 1 <= fieldSize){
					if(!board[row + 1][col] === 0){
						isAvailable = false;
					}
					if(col - 1 > 0){
						if(!board[row + 1][col - 1] === 0){
							isAvailable = false;
						}
					}
				}
				//Check west
				if(col - 1 > 0){
					if(!board[row][col - 1] === 0){
						isAvailable = false;
					}
				}
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

function renderGameField(board, idHtmlContainer, isActiveField){
	let alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
	let id;
	let activeFieldClass = "";
	if(isActiveField){
		activeFieldClass = "activeField";
	}

	for(let row = 0; row <= fieldSize; row++){
		let rowNode = $('<div class="boardRow bFrame"></div>');

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
				if(board[row][col] === 1){
					rowNode.append($('<div class="boardField ' + activeFieldClass + ' shipBgColor"></div>'));
				}
				else{
					rowNode.append($('<div class="boardField ' + activeFieldClass + ' freeBordfieldBgColor"></div>'));
				}
			}
		}
		$(idHtmlContainer).append(rowNode);
	}

	//Dynamic size of cells
	$(".boardRow").css("height", (100 / (fieldSize + 1)) + "%");
	//$(".boardField").css("padding-top", (100 / fieldSize + 1) + "%");
	//$(".boardField").css("height", (100 / (fieldSize + 1)) + "%");
	$(".boardField").css("width", (100 / (fieldSize + 1)) + "%");
	//alert(100 / fieldSize - 8.15);
	//$(".boardFieldCoordinate").css("padding-top", (100 / fieldSize - 8.15) + "%");
	//alert($(".boardFieldCoordinate").css("padding-top"));
}

function setUpShipsRandomly(){ // eslint-disable-line no-unused-vars 
	var shipProperties = ship.shipProperties();
	var shipsToSetUp = getAllShips(shipProperties);
	
	while(shipsToSetUp.length > 0){
		clearField(); // eslint-disable-line no-undef
		var freeFields = getFreeFields();
		shipsToSetUp = getAllShips(shipProperties);

		for(let actualShipProperty = 0; actualShipProperty < shipProperties.length; actualShipProperty++){
			for(let shipNumber = 0; shipNumber < ship[shipProperties[actualShipProperty]].amount; shipNumber++){	
				var tmpFreeFields = freeFields.slice();		
				var actualShipNotSetInGameField = true;

				while(tmpFreeFields.length > 0 && actualShipNotSetInGameField){
					var position = getRowAndColFromString(tmpFreeFields[getRandomInt(0, tmpFreeFields.length - 1)]); // eslint-disable-line no-undef
					var row = position[0];
					var col = position[1];
					var shipGamefieldDirections = shipLiesInGamefield(row, col, (ship[shipProperties[actualShipProperty]].gameFields));
					var randDirection;
					
					var possibleDirection = false;
					while(!possibleDirection && shipGamefieldDirections.length > 0){
						randDirection = shipGamefieldDirections[getRandomInt(0, shipGamefieldDirections.length - 1)]; // eslint-disable-line no-undef

						//First field is always free
						for(let shipFields = 1, fieldPossible = true; shipFields < ship[shipProperties[actualShipProperty]].gameFields && fieldPossible; shipFields++){
							var usedRow = row;
							var usedCol = col;

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

							var isFree = false;
							for(let freeFieldIndex = 0; freeFieldIndex < tmpFreeFields.length; freeFieldIndex++){
								if((usedRow + "-" + usedCol) === tmpFreeFields[freeFieldIndex]){
									isFree = true;
								}
							}

							if(!isFree){
								fieldPossible = false;
								possibleDirection = false;
								var indexPositionToShift = shipGamefieldDirections.indexOf(randDirection);
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
						if(debug){
							$("#place-" + row + "-" + col).html(randDirection);
						}
						

						for(let shipFields = 1; shipFields < ship[shipProperties[actualShipProperty]].gameFields; shipFields++){
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
							$("#place-" + usedRow + "-" + usedCol).css('background-color', shipColor);
						}
						freeFields = getFreeFields();
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
}