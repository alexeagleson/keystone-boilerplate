const uniqid = require('uniqid');
const World = require('./../utility/global');
const Vis = require('./../utility/Vis');

class WorldObject {
  constructor(config) {
    this.id = uniqid();
    this.name = config.name;
    this.type = config.type;
    this.char = config.char || '?';
    this.fgColour = config.fgColour || 'PINK';
    this.worldMap = null;
    this.worldTile = null;

    World.allObjects.push(this);
  }

  place(locationData) {
    const newMap = locationData.worldMap;
    const newCoords = locationData.coords;
    const previousTile = this.getTile();
    if (previousTile) {
      previousTile.removeObject(this);
      Vis.updateTile(previousTile);
    }

    const newTile = newMap.getTileAt(newCoords);
    this.worldMap = newMap;
    this.worldTile = newTile;
    newTile.addObject(this);
    Vis.updateTile(newTile);
    return true;
  }

  placeRandom(locationData) {
    const map = locationData.worldMap;
    this.worldMap = map;
    const emptyTile = map.getEmptyTile();
    return this.place({ worldMap: map, coords: [emptyTile.x, emptyTile.y] });
  }

  removeFromUniverse() {
    World.allObjects = World.allObjects.filter(worldObject => worldObject !== this);
    const myTile = this.getTile();
    if (myTile) {
      myTile.removeObject(this);
      Vis.updateTile(myTile);
    }
    
  }

  getMap() {
    return this.worldMap || false;
  }

  getTile() {
    return this.worldTile || false;
  }
}

module.exports = WorldObject;
