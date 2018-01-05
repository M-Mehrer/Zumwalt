/* global debug */

function alertArray(arrayToAlert){ // eslint-disable-line no-unused-vars 
	if(debug){
		alert(arrayToAlert.join("| "));
	}
}

//Returns a random integer between min (inclusive) and max (inclusive)
function getRandomInt(min, max){ // eslint-disable-line no-unused-vars 
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * returns array with: array[0] = [int] row and array[1] = [int] col; from string with: var string = 'row-col';
 * @param {*} string with format: 'row-col';
 */
function getRowAndColFromString(string){ // eslint-disable-line no-unused-vars 
	let parts = string.split("-");

	return [parseInt(parts[0]), parseInt(parts[1])];
}