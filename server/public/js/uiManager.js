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
		let alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
		let root = $("#" + id);
		root.html("");

		for(let row = 0; row <= this.fieldSize; row++) {
			let rowNode = $("<div></div>");
			rowNode.addClass("boardRow");

			for(let col = 0; col <= this.fieldSize; col++) {
				let elem = $("<div></div>");
				rowNode.append(elem);

				elem.addClass("boardField");
				if(row === 0 || col === 0){
					elem.addClass("coordinatesBG coordinates");

					if(row === 0 && col > 0){
						elem.text(alphabet[col - 1]);
					}
					else if(col === 0 && row > 0){
						elem.text(row);
					}
				}	
				else{
					elem.addClass("waterBg waterHover");
					elem.attr("id", id + "-" + (row - 1) + "-" + (col - 1));
				}
			}

			
			root.append(rowNode);
		}
		let paddingPercentages = 100 / (this.fieldSize + 1);
		let dynamicWidth = paddingPercentages;
		let paddingTop = paddingPercentages * 0.3;
		let paddingBottom = paddingPercentages * 0.7;

		$(".boardField").css("width", dynamicWidth + "%");
		$(".boardField").css("padding-left", paddingTop + "%");
		$(".boardField").css("padding-right", paddingTop + "%");
		$(".boardField").css("padding-top", paddingTop + "%");
		$(".boardField").css("padding-bottom", paddingBottom + "%");
		
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

	sinkShip(row, col, id) {
		let rowDir, colDir, nextField;

		// Check west
		rowDir = -1, colDir = 0;

		for(let i = 1; $("#" + id + "-" + (row + rowDir * i) + "-" + (col + colDir * i)).hasClass("shipBg"); i++) {
			$("#" + id + "-" + (row + rowDir * i) + "-" + (col + colDir * i)).removeClass("waterBg shipBg").addClass("sunkBg");
		}

		// Check north
		rowDir = 0, colDir = -1;

		for(let i = 1; $("#" + id + "-" + (row + rowDir * i) + "-" + (col + colDir * i)).hasClass("shipBg"); i++) {
			$("#" + id + "-" + (row + rowDir * i) + "-" + (col + colDir * i)).removeClass("waterBg shipBg").addClass("sunkBg");
		}

		// Check east
		rowDir = 1, colDir = 0;

		for(let i = 1; $("#" + id + "-" + (row + rowDir * i) + "-" + (col + colDir * i)).hasClass("shipBg"); i++) {
			$("#" + id + "-" + (row + rowDir * i) + "-" + (col + colDir * i)).removeClass("waterBg shipBg").addClass("sunkBg");
		}

		// Check south
		rowDir = 0, colDir = 1;

		for(let i = 1; $("#" + id + "-" + (row + rowDir * i) + "-" + (col + colDir * i)).hasClass("shipBg"); i++) {
			$("#" + id + "-" + (row + rowDir * i) + "-" + (col + colDir * i)).removeClass("waterBg shipBg").addClass("sunkBg");
		}
		
		$("#" + id + "-" + row + "-" + col).removeClass("waterBg shipBg").addClass("sunkBg");
	},

	markField(row, col, id) {
		let dot = $("<div></div>");
		dot.addClass("dot shipDotBg");

		let field = $("#" + id + "-" + row + "-" + col);
		field.removeClass("waterHover");

		if(field.hasClass("waterBg")) {
			dot.removeClass("shipDotBg")
				.addClass("waterDotBg");
		}

		field.html(dot);
	},

	unmarkField(row, col, id) {
		let field = $("#" + id + "-" + row + "-" + col);
		field.addClass("waterHover");
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
