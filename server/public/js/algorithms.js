//Returns a random integer between min (inclusive) and max (inclusive)
function getRandomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}