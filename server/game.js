const Player = require('./constructors/Player');
const Projectile = require('./constructors/Projectile');
const Sfx = require('./utility/Sfx');
const Vis = require('./utility/Vis');
const World = require('./utility/global');
// const { runXTimes } = require('./utility/utility');
const createMap = require('./content/createMap');
const createObject = require('./content/createObject');

const map = createMap('Test Map');

World.io.on('connection', socket => {
  console.log('Player connected: ' + socket.id);

  const newPlayerObject = createObject('Player', socket.handshake.query.user);
  socket.player = new Player(socket.id, newPlayerObject);
  socket.player.myObject.placeRandom({ worldMap: map });

  socket.use((incomingSocket, next) => {
    if (socket.player && socket.player.myObject && socket.player.myObject.Destructible.condition <= 0) {
      World.io.to(socket.id).emit('gameOver', 'YOU ARE DEAD');
      return;
    }
    next();
  });

  socket.on('tileInfo', coords => {
    const tile = map.getTileAt(coords);
    if (tile) Vis.sendTileInfoTo(tile, socket.id);
  });

  socket.on('rightClickTile', coords => {
    const tile = map.getTileAt(coords);
    const bullet = createObject('Bullet');
    bullet.place({ worldMap: map, coords: socket.player.myObject.getTile().getCoords() });
    new Projectile({
      projectileObject: bullet,
      launchObject: socket.player.myObject,
      destinationCoords: tile.getCoords(),
      speed: 50,
    });
    Sfx.playSound('rifle_sound');
  });

  socket.on('sendMap', () => {
    Vis.sendMapTo(map, socket.id);
  });

  socket.on('move', moveData => {
    if (socket.player.myObject.Moving.moveRelative([moveData.dx, moveData.dy])) {
      World.io.to(`${socket.id}`).emit('updateCamera', {
        x: socket.player.myObject.getTile().x,
        y: socket.player.myObject.getTile().y,
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected: ' + socket.id);
    World.allPlayers = World.allPlayers.filter(player => player.socketId !== socket.id);
    socket.player.myObject.removeFromUniverse();
  });
});