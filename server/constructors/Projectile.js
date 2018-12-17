const World = require('./../utility/global');
const { directionTo, directionTextToCoords, coordsMatch, isWorldObject } = require('./../utility/utility');

class Projectile {
  constructor(config) {
    config.projectileObject.Projectile = this;
    this.myObject = config.projectileObject;
    this.launchObject = config.launchObject;
    this.destinationCoords = config.destinationCoords;
    this.speed = config.speed;
    this.interval = setInterval(() => {
      this.tick();
    }, this.speed);
    World.allProjectiles.push(this);
  }

  tick() {
    const myCoords = this.myObject.getTile().getCoords();
    const relativeMoveCoords = directionTextToCoords(directionTo(myCoords, this.destinationCoords));
    const moveResult = this.myObject.Moving.moveRelative(relativeMoveCoords);

    if (coordsMatch(this.myObject.getTile().getCoords(), this.destinationCoords)) {
      this.endProjectile();
    }

    if (moveResult === true) return;

    if (isWorldObject(moveResult) && moveResult.Destructible && moveResult !== this.launchObject) {
      moveResult.Destructible.processCollision(this.myObject, this.speed);

    }
    this.endProjectile();
  }

  endProjectile() {
    World.allProjectiles = World.allProjectiles.filter(projectile => projectile !== this);
    this.myObject.Projectile = null;
    clearInterval(this.interval);
  }
}

module.exports = Projectile;
