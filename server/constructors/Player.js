const World = require('./../utility/global');

class Player {
  constructor(socketId, myObject) {
    this.socketId = socketId;
    this.myObject = myObject;

    World.allPlayers.push(this);
  }
}

module.exports = Player;
