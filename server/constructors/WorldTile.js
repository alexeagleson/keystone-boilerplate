const World = require('./../utility/global');

class WorldTile {
  constructor(x, y, worldMap, fgColour, bgColour) {
    this.x = x;
    this.y = y;
    this.char = '.';
    this.fgColour = fgColour || 'WHITE';
    this.bgColour = bgColour || 'BLACK';
    this._worldMap = worldMap;
    this._objectsOnTile = [];
  }

  getCoords() {
    return [this.x, this.y];
  }

  getMap() {
    return this._worldMap;
  }

  getObjectsOnTile() {
    return this._objectsOnTile;
  }

  occupied() {
    return this._objectsOnTile.length > 0;
  }

  removeObject(worldObject) {
    return this._objectsOnTile = this._objectsOnTile.filter(objectOnTile => objectOnTile !== worldObject);
  }

  addObject(worldObject) {
    return this._objectsOnTile.push(worldObject);
  }

  checkBlocked() {
    const objectBlocking = World.allObjects.find(object => object.getTile() === this);
    if (objectBlocking) return objectBlocking;
    return false;
  }


}

module.exports = WorldTile;
