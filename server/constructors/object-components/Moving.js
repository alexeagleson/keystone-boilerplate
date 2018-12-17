class Moving {
  constructor(worldObject, config = {}) {
    this.owner = worldObject;
    config;
  }

  move(coords) {
    const map = this.owner.getMap();
    const tile = map && map.getTileAt(coords);
    if (!tile) return false;
    const checkBlocked = tile.checkBlocked();
    if (!checkBlocked) {
      return this.owner.place({ worldMap: map, coords: coords });
    }
    return checkBlocked;
  }

  moveRelative(relativeCoords) {
    const tile = this.owner.getTile();
    const newX = tile ? tile.x + relativeCoords[0] : null;
    const newY = tile ? tile.y + relativeCoords[1] : null;
    if (tile && newX >= 0 && newX >= 0) return this.move([newX, newY]);
    return false;
  }
}

module.exports = Moving;
