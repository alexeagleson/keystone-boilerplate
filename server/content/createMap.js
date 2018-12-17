const WorldMap = require('./../constructors/WorldMap');
const { displayError } = require('./../utility/utility');

const createMap = name => {
  switch (name.toLowerCase()) {
    case 'test map':
      return new WorldMap({
        name,
        mapWidth: 80,
        mapHeight: 60,
        mapType: 'Cellular',
      });
    default:
      return displayError('No map with that name.  Make sure switch his using lowercase.', name, 'createMap');
  }
};

module.exports = createMap;
