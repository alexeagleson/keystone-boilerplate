const World = require('./global');

const generateObjectTooltip = worldObject => {
  return {
    name: worldObject.name,
    condition: worldObject.Destructible && worldObject.Destructible.condition,
  };
};

const generateTileRender = worldTile => {
  const tileRender = {
    char: worldTile.char,
    fgColour: worldTile.fgColour,
    bgColour: worldTile.fgColour,
    x: worldTile.x,
    y: worldTile.y,
  };
  if (worldTile.occupied()) {
    const topObject = worldTile.getObjectsOnTile()[0];
    tileRender.char = topObject.char;
    tileRender.fgColour = topObject.fgColour;
  }
  return tileRender;
};

const generateMapRender = worldMap => {
  const mapRender = {
    mapWidth: worldMap.mapWidth,
    mapHeight: worldMap.mapHeight,
    tileMap: {},
  };
  for (let i = 0; i < worldMap.mapWidth; i += 1) {
    for (let j = 0; j < worldMap.mapHeight; j += 1) {
      const key = `${i},${j}`;
      mapRender.tileMap[key] = generateTileRender(worldMap.tileMap[key]);
    }
  }
  return mapRender;
};

const Vis = {
  debug: (debugObject) => {
    World.io.emit('debug', debugObject);
  },

  sendMapTo: (worldMap, socketId) => {
    World.io.to(socketId).emit('sendMap', generateMapRender(worldMap));
  },

  updateTile: worldTile => {
    World.io.emit('updateTile', generateTileRender(worldTile));
  },

  sendTileInfoTo(worldTile, socketId) {
    if (worldTile.occupied()) {
      const objectOnTile = worldTile.getObjectsOnTile()[0];
      World.io.to(`${socketId}`).emit('tileInfo', generateObjectTooltip(objectOnTile));
    }
  },
};

module.exports = Vis;
