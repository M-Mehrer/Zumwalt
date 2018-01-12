/* global $, UIManager, apiURL */

class Highscore {
	get shownHighscores() {
		return 5;
	}

	setHighscore(myHighscore){
		$.ajax({
			type: "POST",
			data: JSON.stringify({
				"name": $('#player1').val(),
				"points": myHighscore
			}),
			contentType: "application/json",
			dataType: "JSON",
			url: apiURL + "/highscore",
			success: UIManager.printGameLog("Dein Highscore mit " + myHighscore + " wurde erfolgreich gespeichert!")
		});
	}
	
	updateHighscores() {
		$.ajax({
			method: "GET",
			dataType: "JSON",
			url: apiURL + "/highscore"
		}).done((msg) => {
			this.showHighscores(this.getBestHighscores(msg.highscore, this.shownHighscores));
		});
	}
	
	getBestHighscores(highscores, nr) {
		highscores.sort(function(a, b){return a.points - b.points});
	
		let best = [];
		let last;
	
		for(let i = 0; i < highscores.length && i < nr; i++) {
			best.push(highscores[i]);
			last = highscores[i];
		}
	
		for(let i = nr; i < highscores.length; i++) {
			if(highscores[i].points == last.points) {
				best.push(highscores[i]);
			}
		}
	
		return best;
	}
	
	showHighscores(highscores) {
		let container = $("#highscores");
		container.html("");
	
		if(highscores.length == 0) {
			container.append($("<span>Noch keine Einträge.</span><hr/>"));
		}
	
		for(let i = 0; i < highscores.length; i++) {
			let row = $('<span/>', {class: 'highscores'});
			let name = $('<span/>', {class: "col-xs-8"});
			name.append(highscores[i].name);
			let score = $('<span/>', {class: "col-xs-4"});
			score.append(highscores[i].points + " Pt.");
			let brhr = $('<br/><hr/>');
			row.append(name);
			row.append(score);
			row.append(brhr);
			container.append(row);
		}
	}
	
}