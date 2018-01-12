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