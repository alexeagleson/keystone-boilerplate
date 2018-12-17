const WorldObject = require('./../constructors/WorldObject');

// Relative coordinates
const NODIR_COORDS = [0, 0];

const UP_COORDS = [0, -1];
const DOWN_COORDS = [0, 1];
const LEFT_COORDS = [-1, 0];
const RIGHT_COORDS = [1, 0];
const UPLEFT_COORDS = [-1, -1];
const UPRIGHT_COORDS = [1, -1];
const DOWNLEFT_COORDS = [-1, 1];
const DOWNRIGHT_COORDS = [1, 1];

const rollDie = dieSize => Math.floor(Math.random() * dieSize) + 1;

const pickRandom = arrayOfThings => {
  const randomPosition = rollDie(arrayOfThings.length) - 1;
  return arrayOfThings[randomPosition];
};

// randBetween is inclusive of max number
const randBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const normalizeToValue = (number, minValue, maxValue) => {
  if (number < minValue) {
    number = minValue;
  } else if (number > maxValue) {
    number = maxValue;
  }
  return number;
};

const displayError = (errorText, argumentName, functionName) => {
  alert(`Error: ${errorText}`);
  console.log(`Error: ${errorText}`);
  console.log(`Argument: ${argumentName}`);
  console.log(`Function: ${functionName}`);
  return null;
};

const runXTimes = (givenFunction, numberOfTimes) => {
  const functionResults = [];
  for (let i = 0; i < numberOfTimes; i += 1) {
    functionResults.push(givenFunction());
  }
  return functionResults;
};

const directionTo = (coordsFrom, coordsTo) => {
  const dx = coordsTo[0] - coordsFrom[0];
  const dy = coordsTo[1] - coordsFrom[1];
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const sixteenthCircle = 45 / 2;
  if (angle <= 0 + sixteenthCircle && angle >= 0 - sixteenthCircle) {
    return 'right';
  } else if (angle <= -180 + sixteenthCircle || angle >= 180 - sixteenthCircle) {
    return 'left';
  } else if (angle <= 90 + sixteenthCircle && angle >= 90 - sixteenthCircle) {
    return 'down';
  } else if (angle <= -90 + sixteenthCircle && angle >= -90 - sixteenthCircle) {
    return 'up';
  } else if (angle <= 45 + sixteenthCircle && angle >= 45 - sixteenthCircle) {
    return 'downright';
  } else if (angle <= 135 + sixteenthCircle && angle >= 135 - sixteenthCircle) {
    return 'downleft';
  } else if (angle <= -45 + sixteenthCircle && angle >= -45 - sixteenthCircle) {
    return 'upright';
  } else if (angle <= -135 + sixteenthCircle && angle >= -135 - sixteenthCircle) {
    return 'upleft';
  } else {
    return 'nodir';
  }
};

const directionTextToCoords = directionText => {
  switch (directionText.toLowerCase()) {
    case 'up':
      return UP_COORDS;
    case 'down':
      return DOWN_COORDS;
    case 'right':
      return RIGHT_COORDS;
    case 'left':
      return LEFT_COORDS;
    case 'upright':
      return UPRIGHT_COORDS;
    case 'upleft':
      return UPLEFT_COORDS;
    case 'downright':
      return DOWNRIGHT_COORDS;
    case 'downleft':
      return DOWNLEFT_COORDS;
    case 'nodir':
      return NODIR_COORDS;
    default:
      displayError('Invalid argument given.', directionText, 'directionTextToCoords');
      return null;
  }
};

const coordsMatch = (first, second) => first[0] === second[0] && first[1] === second[1];

const isWorldObject = (arg) => arg instanceof WorldObject;

module.exports = {
  rollDie,
  pickRandom,
  randBetween,
  normalizeToValue,
  displayError,
  directionTo,
  directionTextToCoords,
  runXTimes,
  coordsMatch,
  isWorldObject,
};
