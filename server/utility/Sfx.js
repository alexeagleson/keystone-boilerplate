const World = require('./global');

const Sfx = {
  playSound: (soundName) => {
    World.io.emit('playSound', soundName);
  },
};

module.exports = Sfx;
