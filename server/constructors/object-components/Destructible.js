const Sfx = require('./../../utility/Sfx');
const { normalizeToValue } = require('./../../utility/utility');

class Destructible {
  constructor(worldObject, config = {}) {
    this.owner = worldObject;
    this.condition = config.condition || 100;
    this.soundOnDestroy = config.soundOnDestroy || null;
  }

  processCollision(projectileObject, speed) {
    if (projectileObject.Destructible) projectileObject.Destructible.adjustConditionBy(0 - speed);
    this.adjustConditionBy(0 - speed);
  }

  adjustConditionBy(value) {
    this.condition += value;
    this.condition = normalizeToValue(this.condition, 0, 100);
    this.checkIfDestroyed();
  }

  checkIfDestroyed() {
    if (this.condition <= 0) {
      this.destroy();
      return true;
    }
    return false;
  }

  destroy() {
    if (this.soundOnDestroy) Sfx.playSound(this.soundOnDestroy);
    this.owner.removeFromUniverse();
  }
}

module.exports = Destructible;
