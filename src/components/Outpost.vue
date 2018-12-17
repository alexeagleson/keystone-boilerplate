<template>
  <div>
    <div class="row animated fadeIn">
      <div class="col-2 col-md-3 col-lg-5"></div>
      <div class="col-8 col-md-6 col-lg-2"></div>
      <div class="col-2 col-md-3 col-lg-5"></div>
    </div>
    <Debug v-bind:debugText="debugText" />
    <div
      class="row"
      id="rot-container"
      oncontextmenu="return false;"
    ></div>
    <button v-on:click="respawn()">RESPAWN</button>
    <ObjectInfo
      v-if="show"
      v-bind:style="{ position: 'absolute', left: xPos, top: yPos }"
      v-bind:name="message"
      v-bind:condition="condition"
    />
  </div>
</template>

<script>
import SocketIo from 'socket.io-client';
import { Display } from 'rot-js';
import { Howl } from 'howler';
import Debug from './subcomponents/Debug';
import ObjectInfo from './subcomponents/ObjectInfo';
import Camera from './display-utility/Camera';
import Font from './display-utility/Font';
import Screen from './display-utility/Screen';

let io = null;

const keydownHandler = keyboardEvent => {
  if (!io) return false;
  if (keyboardEvent.key === 'w') {
    io.emit('move', { dx: 0, dy: -1 });
  } else if (keyboardEvent.key === 's') {
    io.emit('move', { dx: 0, dy: 1 });
  } else if (keyboardEvent.key === 'a') {
    io.emit('move', { dx: -1, dy: 0 });
  } else if (keyboardEvent.key === 'd') {
    io.emit('move', { dx: 1, dy: 0 });
  }
};

export default {
  data() {
    return {
      message: 'butt',
      condition: null,
      rotDisplay: null,
      worldMap: null,
      xPos: '0px',
      yPos: '0px',
      show: false,
      camera: null,
      readyToRender: false,
      debugObject: {},
      debugText: 'none',
      sounds: {
        rifle_sound: new Howl({ src: [require('./../assets/rifle_sound.ogg')], volume: 0.25 }),
        destroy_stone: new Howl({ src: [require('./../assets/destroy_stone.ogg')] }),
        male_death: new Howl({ src: [require('./../assets/male_death.ogg')] }),
      },
    };
  },
  methods: {
    respawn() {
      this.$router.go();
    },
    drawOne(coords) {
      const screenCoords = this.camera.actualToScreen(coords);
      if (!this.camera.withinCameraBounds(screenCoords)) return;
      const key = `${coords[0]},${coords[1]}`;
      this.rotDisplay.draw(
        screenCoords[0],
        screenCoords[1],
        this.worldMap.tileMap[key].char,
        Font[this.worldMap.tileMap[key].fgColour]
      );
    },
    drawAll() {
      for (let i = 0; i < Screen.MAIN_DISPLAY_TILE_WIDTH; i += 1) {
        for (let j = 0; j < Screen.MAIN_DISPLAY_TILE_HEIGHT; j += 1) {
          const actualCoords = this.camera.screenToActual([i, j]);
          const key = `${actualCoords[0]},${actualCoords[1]}`;
          const char = this.worldMap.tileMap[key] ? this.worldMap.tileMap[key].char : ' ';
          const fgColour = this.worldMap.tileMap[key] ? this.worldMap.tileMap[key].fgColour : Font.WHITE;
          this.rotDisplay.draw(i, j, char, Font[fgColour]);
        }
      }
    },
  },
  mounted() {
    io = SocketIo({ query: `user=${localStorage.getItem('user')}` });

    window.addEventListener('keydown', keydownHandler);

    this.camera = new Camera(Screen.MAIN_DISPLAY_TILE_WIDTH, Screen.MAIN_DISPLAY_TILE_HEIGHT, Font.FONT_SIZE);

    io.emit('sendMap', {});

    io.on('debug', debugObject => {
      Object.assign(this.debugObject, debugObject);
      this.debugText = JSON.stringify(this.debugObject);
    });

    io.on('gameOver', gameOverMessage => {
      this.debugText = gameOverMessage;
    });

    io.on('playSound', soundName => {
      this.sounds[soundName].play();
    });

    io.on('tileInfo', tileInfo => {
      this.message = tileInfo.name;
      this.condition = tileInfo.condition;
      this.show = true;
    });

    io.on('sendMap', worldMap => {
      if (!this.rotDisplay) {
        this.worldMap = worldMap;
        const rotContainer = document.getElementById('rot-container');
        this.rotDisplay = new Display({
          width: Screen.MAIN_DISPLAY_TILE_WIDTH,
          height: Screen.MAIN_DISPLAY_TILE_HEIGHT,
          fg: Font.WHITE,
          bg: Font.BLACK,
          fontSize: Font.FONT_SIZE,
          forceSquareRatio: true,
          fontFamily: Font.FONT_FAMILY,
        });
        rotContainer.appendChild(this.rotDisplay.getContainer());

        this.rotDisplay.getContainer().addEventListener('mousedown', e => {
          this.xPos = e.x + 'px';
          this.yPos = e.y + 'px';
          this.show = false;
          const clickCoords = this.camera.screenToActual(this.camera.pixelToTile([e.offsetX, e.offsetY]));
          if (e.button === 0) {
            io.emit('tileInfo', clickCoords);
          } else if (e.button === 2) {
            io.emit('rightClickTile', clickCoords);
          }          
        });

        rotContainer.className = 'animated fadeIn';
        this.readyToRender = true;
        this.drawAll();
      }
    });

    io.on('updateTile', tileRender => {
      if (!this.readyToRender) return;
      this.worldMap.tileMap[`${tileRender.x},${tileRender.y}`] = tileRender;
      this.drawOne([tileRender.x, tileRender.y]);
    });

    io.on('updateCamera', newCameraPosition => {
      if (!this.readyToRender) return;
      this.camera.updatePosition(newCameraPosition, this.worldMap);
      this.drawAll();
    });

    io.on('message', messageObject => {
      alert(messageObject.message);
    });
  },
  destroyed() {
    if (io) io.close();
    window.removeEventListener('keydown', keydownHandler);
  },
  components: {
    Debug,
    ObjectInfo,
  },
};

</script>

<style scoped>
#rot-container {
  display: flex;
  justify-content: center;
}
</style>




 