const ships = { // eslint-disable-line no-unused-vars

	availableShips: [
		{
			name: 'Schlachtschiff',
			gameFields: 5,
			amount: 1
		},
		{
			name: 'Kreuzer',
			gameFields: 4,
			amount: 2
		},
		{
			name: 'Zerstörer',
			gameFields: 3,
			amount: 3
		}, 
		{
			name: 'U-Boot',
			gameFields: 2,
			amount: 4
		}
	],

	getShip(index) {
		return this.availableShips[index];
	},

	biggestShip: function(){
		return this.availableShips.reduce((total, val) => {
			return val.gameFields > total ? val.gameFields : total;
		});
	}

};