const uniqid = require('uniqid');
const ROT = require('rot-js');

const World = require('./../utility/global');
const WorldTile = require('./WorldTile');
const createObject = require('./../content/createObject');
const { randBetween, displayError } = require('./../utility/utility');

class WorldMap {
  constructor(config) {
    this.id = uniqid();
    this.name = config.name;
    this.mapWidth = config.mapWidth || 60;
    this.mapHeight = config.mapHeight || 30;
    this.mapTemp = config.mapTemp || 20;
    this.mapType = config.mapType || 'Cellular';
    this.tileMap = {};

    // Generate the map itself
    this.mapType === 'Cellular' ? this.generateCellularMap() : this.generateMapByType({ mapType: this.mapType });

    World.allMaps.push(this);
  }

  getTileAt(coords) {
    if (!this.withinMapBounds(coords)) return false;
    return this.tileMap[`${coords[0]},${coords[1]}`];
  }

  getObjectsAt(coords) {
    return World.allObjects.filter(
      worldObject => worldObject.getTile().x === coords[0] && worldObject.getTile().y === coords[1]
    );
  }

  getEmptyTile() {
    let randomTile = null;
    for (let i = 0; i < 9999; i++) {
      const randomX = randBetween(0, this.mapWidth - 1);
      const randomY = randBetween(0, this.mapHeight - 1);
      if (!this.getTileAt([randomX, randomY]).checkBlocked()) {
        randomTile = this.getTileAt([randomX, randomY]);
        break;
      }
    }
    if (!randomTile) return displayError('No empty tile found', this.name, 'getEmptyTile');
    return randomTile;
  }

  generateCellularMap() {
    const map = new ROT.Map.Cellular(this.mapWidth, this.mapHeight, {
      connected: true,
    });

    map.randomize(0.5);
    for (let i = 0; i < 5; i += 1) {
      map.create();
    }
    map.connect(null, 1);

    for (let i = 0; i < this.mapWidth; i++) {
      for (let j = 0; j < this.mapHeight; j++) {
        const key = i + ',' + j;
        this.tileMap[key] = new WorldTile(i, j, this);
        if (!map._map[i][j]) {
          createObject('Wall').place({ worldMap: this, coords: [i, j] });
        }
      }
    }
  }

  generateMapByType(mapConfig) {
    let map = null;
    if (mapConfig.mapType === 'Arena') {
      map = new ROT.Map.Arena(this.mapWidth, this.mapHeight);
    } else if (mapConfig.mapType === 'Rogue') {
      map = new ROT.Map.Rogue(this.mapWidth, this.mapHeight);
    } else if (mapConfig.mapType === 'EllerMaze') {
      map = new ROT.Map.EllerMaze(this.mapWidth, this.mapHeight);
    }

    const createMapCallback = function(x, y, isWall) {
      const key = x + ',' + y;
      this.tileMap[key] = new WorldTile(x, y, this);
      if (isWall) {
        createObject('Wall').place({ worldMap: this, coords: [x, y] });
      }
    };

    map.create(createMapCallback.bind(this));
  }

  withinMapBounds(coords) {
    if (coords[0] < 0 || coords[0] >= this.mapWidth) { return false; }
    if (coords[1] < 0 || coords[1] >= this.mapHeight) { return false; }
    return true;
  }
}

module.exports = WorldMap;
