function alertArray(arrayToAlert){
	if(debug){
		alert(arrayToAlert.join("| "));
	}
}

//Returns a random integer between min (inclusive) and max (inclusive)
function getRandomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * returns array with: array[0] = [int] row and array[1] = [int] col; from string with: var string = 'row-col';
 * @param {*} string with format: 'row-col';
 */
function getRowAndColFromString(string){
	let parts = string.split("-");

	return [parseInt(parts[0]), parseInt(parts[1])];
}