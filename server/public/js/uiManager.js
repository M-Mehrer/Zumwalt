/*$(document).ready(function() {
	UIManager.inititializeShips("myGameFieldBody");
	UIManager.inititializeShips("otherGameFieldBody");

	UIManager.shipSetup([
		{name: "Schlachtschiff", length: 5, number: 1},
		{name: "Kreuzer", length: 4, number: 2},
		{name: "Zerstörer", length: 3, number: 3},
		{name: "U-Boot", length: 2, number: 4}
	], "myShipsToSetUp")

	UIManager.showShips([
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	], "myGameFieldBody");

	UIManager.markField(1, 1, "myGameFieldBody");
	UIManager.markField(1, 2, "myGameFieldBody");
	UIManager.markField(1, 3, "myGameFieldBody");
	UIManager.unmarkField(1, 2, "myGameFieldBody");

	UIManager.markField(8, 2, "myGameFieldBody");
	UIManager.markField(8, 3, "myGameFieldBody");
});*/

const UIManager = {
	fieldSize: 10,

	inititializeShips(id) {
		let root = $("#" + id);
		root.html("");

		for(let row = 0; row < this.fieldSize; row++) {
			let rowNode = $("<div></div>");
			rowNode.addClass("boardRow");

			for(let col = 0; col < this.fieldSize; col++) {
				let elem = $("<div></div>");
				rowNode.append(elem);

				elem.addClass("boardField waterBg");
				elem.attr("id", id + "-" + row + "-" + col);
			}

			root.append(rowNode);
		}
	},

	reset(id) {
		for(let row = 0; row < this.fieldSize; row++) {
			for(let col = 0; col < this.fieldSize; col++) {
				let field = $("#" + id + "-" + row + "-" + col);
				field.removeClass("shipBg");
				field.addClass("waterBg");
				unmarkField(row, col, id);
			}
		}
	},

	showShips(board, id) {
		for(let row = 0; row < this.fieldSize; row++) {
			for(let col = 0; col < this.fieldSize; col++) {
				let field = $("#" + id + "-" + row + "-" + col);

				if(board[row][col] === 0) {
					field.removeClass("shipBg")
						.addClass("waterBg");
					field.children().removeClass("shipDotBg")
						.addClass("waterDotBg");
				}
				else if(board[row][col] === 1) {
					field.removeClass("waterBg")
						.addClass("shipBg");
					field.children().removeClass("waterDotBg")
						.addClass("shipDotBg");
				}
			}
		}
	},
	
	setShipField(row, col, id) {
		$("#" + id + "-" + row + "-" + col)
			.removeClass("waterBg")
			.addClass("shipBg");
	},

	markField(row, col, id) {
		let dot = $("<div></div>");
		dot.addClass("dot shipDotBg");

		let field = $("#" + id + "-" + row + "-" + col);

		if(field.hasClass("waterBg")) {
			dot.removeClass("shipDotBg")
				.addClass("waterDotBg");
		}

		field.html(dot);
	},

	unmarkField(row, col, id) {
		let field = $("#" + id + "-" + row + "-" + col);
		field.html("");
	},

	isMarked(row, col, id) {
		let field = $("#" + id + "-" + row + "-" + col);
		return field.html() !== "";
	},

	cleadMarks(id) {
		for(let row = 0; row < this.fieldSize; row++) {
			for(let col = 0; col < this.fieldSize; col++) {
				$("#" + id + "-" + row + "-" + col).html("");
			}
		}
	},

	shipSetup(ships, id) {
		let root = $("#" + id);

		for(let i = 0; i < ships.length; i++) {
			let rowNode = $("<div></div>");
			rowNode.addClass("row setUpShipsRow");

			let number = $("<div></div>");
			number.addClass("col-xs-1");
			number.text(ships[i].amount);

			let name = $("<div></div>");
			name.addClass("col-xs-6");
			name.text(ships[i].name);

			let preview = $("<div></div>");
			preview.addClass("col-xs-5");
			for(let shipLength = 0; shipLength < ships[i].gameFields; shipLength++) {
				let field = $("<div></div>");
				field.addClass("setUpShipsField shipField");
				preview.append(field);
			}

			rowNode.append(number)
				.append(name)
				.append(preview);
			root.append(rowNode);
		}
	},

	clearShipSetup(id) {
		$("#" + id).html("");
	}
}
