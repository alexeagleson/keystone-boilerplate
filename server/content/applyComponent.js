const Moving = require('./../constructors/object-components/Moving');
const Destructible = require('./../constructors/object-components/Destructible');
const { displayError } = require('./../utility/utility');

const applyComponent = (worldObject, componentName, config) => {
  switch (componentName.toLowerCase()) {
    case 'moving':
      worldObject.Moving = new Moving(worldObject, config);
      return true;
    case 'destructible':
      worldObject.Destructible = new Destructible(worldObject, config);
      return true;
    default:
      return displayError(
        'No component with that name.  Make sure switch his using lowercase.',
        componentName,
        'applyComponent'
      );
  }
};

module.exports = applyComponent;
