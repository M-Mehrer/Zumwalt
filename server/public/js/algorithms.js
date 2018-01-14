/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * @param {number} min Minimun value (inclusive) 
 * @param {number} max Maximum value (inclusive)
 */
function getRandomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}