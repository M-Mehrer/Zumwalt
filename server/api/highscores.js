const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res) => {
	// Read Highscores from file
	fs.readFile("api/scores.json", "utf8", function(err, data){
		if(err) {
			res.status(500).json({
				error: "Internal server error."
			});
			return;
		}

		// Return Highscores
		let jsonString = data;
		res.status(200).json(JSON.parse(jsonString));
	});
});

router.post('/', (req, res) => {
	// Read Highscores
	fs.readFile("api/scores.json", "utf8", (err, data) => {
		if(err) {
			res.status(500).json({
				error: "Internal server error."
			});
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
				res.status(500).json({
					error: "Internal server error."
				});
				return;
			}
			res.status(201).json({
				success: "Highscore successfully saved."
			});
		});
	});

})

module.exports = router;