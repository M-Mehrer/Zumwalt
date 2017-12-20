const ship = {
  battleship: {
    name: 'Schlachtschiff',
    gameFields: 5,
    amount: 1
  },
  cruiser: {
    name: 'Kreuzer',
    gameFields: 4,
    amount: 2
  },
  destroyer: {
    name: 'Zerstörer',
    gameFields: 3,
    amount: 3
  },  
  submarine: {
    name: 'U-Boot',
    gameFields: 2,
    amount: 4
  },

  aCarryer: {
    name: 'ATräger',
    gameFields: 7,
    amount: 1
  },/*
  bCarryer: {
    name: 'BTräger',
    gameFields: 7,
    amount: 1
  },
  cCarryer: {
   name: 'CTräger',
  gameFields: 7,
   amount: 1
  },
  dCarryer: {
    name: 'DTräger',
   gameFields: 7,
    amount: 1
  },*/



  //Returns ship properties ordered by gameFields desc
  shipProperties: function(){
    //Don't count functions
    var number = -2;
    var shipProperties = [];
    var allProperties = [];

    for(let property in this){
      if(Object.prototype.hasOwnProperty.call(this, property)){
        number++;
        allProperties.push(property);
      }
    }

    for(let i = 0; i < number; i++){
      shipProperties.push(allProperties[i]);
    }

    //Insertionsort
    for(let i = 1; i < shipProperties.length; i++){
      let k = i - 1;
      while(k >= 0){
        if(this[shipProperties[k + 1]].gameFields > this[shipProperties[k]].gameFields){
          let tmp = shipProperties[k];
          shipProperties[k] = shipProperties[k + 1];
          shipProperties[k + 1] = tmp;
        }
        k--;
      }
    }

    return shipProperties;
  },

  biggestShip: function(){
    let shipProperties = this.shipProperties();
    let biggestShipProperty;

    for(let i = 0; i < shipProperties.length; i++){
      if(typeof biggestShipProperty == "undefined"){
        biggestShipProperty = this[shipProperties[i]];
      }
      if(this[shipProperties[i]].gameFields > biggestShipProperty.gameFields){
        biggestShipProperty = this[shipProperties[i]];
      }
    }
    return biggestShipProperty;
  }

};
