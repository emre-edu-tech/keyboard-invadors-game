import { CONFIG } from './config.js';
import { setupCanvas } from './core/canvas.js';
import { createLoop } from './core/loop.js';
import { createDebugPanel } from './ui/debug.js';

// TODO(spec): the whole test scene below is removed in step 03.

const canvasElement = document.getElementById('game-canvas');
const { ctx, getInfo } = setupCanvas(canvasElement);

// The test square: a minimal "entity", i.e. an object with a position that is
// updated and drawn every frame.
const square = {
  size: 80, // logical px
  speed: 320, // logical px per second
  x: 0, // left edge, logical px
  y: 500, // top edge, logical px
  dir: 1, // 1 = right, -1 = left
};
const MAX_X = CONFIG.WIDTH - square.size;

function update(dt) {
  // Delta time in action: multiply the speed by the elapsed seconds. The
  // square crosses the full width in 1200 / 320 = 3.75 s on any machine.
  square.x += square.dir * square.speed * dt;
  if (square.x <= 0) {
    square.x = 0;
    square.dir = 1;
  } else if (square.x >= MAX_X) {
    square.x = MAX_X;
    square.dir = -1;
  }
}

function render() {
  // Logical coordinates only: 0..1280 x 0..720, never pixels or CSS values.
  ctx.fillStyle = CONFIG.COLORS.bg;
  ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

  // Grid every 160 logical units, batched into one stroke so the browser
  // builds a single path instead of one per line.
  ctx.strokeStyle = 'rgba(138, 143, 184, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= CONFIG.WIDTH; x += 160) {
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, CONFIG.HEIGHT);
  }
  for (let y = 0; y <= CONFIG.HEIGHT; y += 160) {
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(CONFIG.WIDTH, y + 0.5);
  }
  ctx.stroke();

  ctx.fillStyle = CONFIG.COLORS.accent;
  ctx.fillRect(square.x, square.y, square.size, square.size);

  ctx.fillStyle = CONFIG.COLORS.text;
  ctx.font = '32px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Delta-time test 1280\u00d7720', CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2);
}

const loop = createLoop({ update, render });
const debug = createDebugPanel({ getLoop: () => loop, getCanvasInfo: getInfo });
debug.set('state', 'test-scene');

loop.start();