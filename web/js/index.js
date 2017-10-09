import Cell from './cell';
import ColorRunner from './color';
import { randomExponential, distance } from './util';

// Set up canvas.
const renderer = PIXI.autoDetectRenderer(screen.width, screen.height,
  { backgroundColor: 0x0A0F28 });
const canvas = document.body.appendChild(renderer.view);
const stage = new PIXI.Container();
const colorRunner = new ColorRunner();
let cells = [];
let mouseX = 0;
let mouseY = 0;

// Full screen button.
document.getElementById('fullscreen-btn').addEventListener('click', () => {
    ;const rfs = canvas.requestFullscreen
      || canvas.webkitRequestFullScreen
      || canvas.mozRequestFullScreen
      || canvas.msRequestFullscreen;
    rfs.call(canvas);
  });

// Reset command.
document.addEventListener('keydown', e => {
    if (e.keyCode === 82 && e.altKey) {
      cells.forEach(c => {
        stage.removeChild(c.sprite);
      });
      cells = [];
    }
  });

// Create bacterium on click.
renderer.view.addEventListener('mousedown', e => {
    const c = new Cell(e.x, e.y, stage);
    c.sprite.tint = colorRunner.requestColorHex();
    cells.push(c);

    generateCreatePing();
  });

// Track mouse movements for scaling effect.
renderer.view.addEventListener('mousemove', e => {
    mouseX = e.pageX;
    mouseY = e.pageY;
  });

var meter = new FPSMeter();

function animate() {
  requestAnimationFrame(animate);

  cells.forEach((c, i) => {
      if (Math.random() < 0.004) {
        if (Math.random() < 0.0004) {
          generateSplitPing();
        }

        const newCell = c.split();
        cells.push(newCell);
      }

      // check mouse location
      const d = distance(mouseX, mouseY, c.getX(), c.getY());
      if (d < 50) {
        c.sprite.scale.set(Math.min(50 / d, 2));
      } else {
        c.sprite.scale.set(1);
      }

      c.step();

      if (c.lifespan-- <= 0) {
        // kill if end of life
        cells.splice(i, 1);
        stage.removeChild(c.sprite);
      }
    });

  // render the container
  meter.tick();
  renderer.render(stage);
}

animate();

function generateCreatePing() {
  if (Math.random() < 0.25) {
    socketPort.send({
        address: '/create',
        args: 1,
      });
  }
}

function generateSplitPing() {
  socketPort.send({
      address: '/split',
      args: 1,
    });
}

// Set up WebSocket.
let socketPort = new osc.WebSocketPort({
    url: 'ws://localhost:8000', // URL to your Web Socket server.
  });
socketPort.open();

socketPort.on('ready', () => {
    console.log('Browser port ready!');

    generateCreatePing();
  });

socketPort.on('message', (oscMsg) => {
    console.log('Browser received OSC from Max: ', oscMsg);

    const cell = new Cell(oscMsg.args[0], oscMsg.args[1], stage);
    cell.sprite.tint = colorRunner.requestColorHex();
    cells.push(cell);

    generateCreatePing();
  });
