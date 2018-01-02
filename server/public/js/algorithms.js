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

//Returns a random integer between min (inclusive) and 1624770 (inclusive)
function getRandomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
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

function findIndexOfValueInArray(value, array){
	for(let i = 0; i < array.length; i++){
		if(value === array[i]){
			return i;
		}
	}
	return -1;
}