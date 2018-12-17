import Font from './Font';

const canvasSize = 0.75;
const screenWidth = Math.floor((window.innerWidth * canvasSize) / Font.FONT_SIZE) * Font.FONT_SIZE;
const screenHeight = Math.floor((window.innerHeight * canvasSize) / Font.FONT_SIZE) * Font.FONT_SIZE;

const Screen = {
    CANVAS_SIZE: canvasSize,
    SCREEN_WIDTH: screenWidth,
    SCREEN_HEIGHT: screenHeight,
    MAIN_DISPLAY_TILE_WIDTH: Math.floor(screenWidth / Font.FONT_SIZE),
    MAIN_DISPLAY_TILE_HEIGHT: Math.floor(screenHeight / Font.FONT_SIZE),
};

export default Screen;
