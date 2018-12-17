class Camera {
  constructor(displayWidth, displayHeight, tileSize) {
    this.tileX = null;
    this.tileY = null;
    this.tileSize = tileSize;
    this.displayWidth = displayWidth;
    this.displayHeight = displayHeight;
  }

  pixelToTile(pixelCoordsArray) {
    const tileX = Math.floor(pixelCoordsArray[0] / this.tileSize);
    const tileY = Math.floor(pixelCoordsArray[1] / this.tileSize);
    return [tileX, tileY];
  }

  tileToPixel(tileCoordsArray) {
    const pixelOffset = Math.floor(this.tileSize / 2);
    return [tileCoordsArray[0] * this.tileSize + pixelOffset, tileCoordsArray[1] * this.tileSize + pixelOffset];
  }

  screenToActual(coords) {
    const cameraX = this.tileX ? this.tileX : 0;
    const cameraY = this.tileY ? this.tileY : 0;
    return [coords[0] + cameraX, coords[1] + cameraY];
  }

  actualToScreen(coords) {
    const cameraX = this.tileX ? this.tileX : 0;
    const cameraY = this.tileY ? this.tileY : 0;
    return [coords[0] - cameraX, coords[1] - cameraY];
  }

  computeTileCoord(coord, screenSize, mapSize) {
    const halfScreenSize = Math.floor(screenSize / 2);
    if (coord < halfScreenSize) {
      return 0;
    } else if (coord >= mapSize - halfScreenSize) {
      return mapSize - screenSize;
    } else {
      return coord - halfScreenSize;
    }
  }

  updatePosition(newCameraPosition, world) {
    const displayScreenWidth = Math.min(this.displayWidth, world.mapWidth);
    const displayScreenHeight = Math.min(this.displayHeight, world.mapHeight);
    this.tileX = this.computeTileCoord(newCameraPosition.x, displayScreenWidth, world.mapWidth);
    this.tileY = this.computeTileCoord(newCameraPosition.y, displayScreenHeight, world.mapHeight);
  }

  withinCameraBounds(coords) {
    if (coords[0] < 0 || coords[0] >= this.displayWidth) { return false; }
    if (coords[1] < 0 || coords[1] >= this.displayHeight) { return false; }
    return true;
  }
}

export default Camera;
