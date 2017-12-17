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

  shipProperties: function(){
    //Don't calculate this function itself
    var number = -1;
    var shipProperties = [];
    var properties = [];

    for(let property in this){
      if(Object.prototype.hasOwnProperty.call(this, property)){
        number++;
        properties.push(property);
      }
    }

    for(let i = 0; i < number; i++){
      shipProperties.push(properties[i]);
    }

    return shipProperties;
  }
};
