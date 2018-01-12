const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res) => {
	// Read Highscores
	fs.readFile("api/scores.json", "utf8", function(err, data){
		if(err) {
			res.status(500).json();
			return;
		}

		// Return Highscores
		res.status(200).json(JSON.parse(data));
	});
});

router.post('/', (req, res) => {
	// Read Highscores
	fs.readFile("api/scores.json", "utf8", (err, data) => {
		if(err) {
			res.status(500).json();
			return;
		}
		let json = JSON.parse(data);

		// Add new Highscore
		json.highscore.push(
			{
				name: req.body.name,
				points: req.body.points
			}
		);

		// Write new Highscores
		fs.writeFile('api/scores.json', JSON.stringify(json), 'utf8', (err) => {
			if(err) {
				res.status(500).json();
				return;
			}
			res.status(201).json();
		});
	});

})

module.exports = router;