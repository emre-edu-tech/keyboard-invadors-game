import { CONFIG } from './config.js';

// Step 01 placeholder: paint the canvas once so the setup can be verified.
// (The real game loop arrives in a later step.)

// Entity note for newcomers: an "entity" is just a game object with
// position/state that gets updated and drawn each frame. Here we draw
// static text only, so there are no entities yet.
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = CONFIG.COLORS.bg;
ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

ctx.fillStyle = CONFIG.COLORS.text;
ctx.font = '32px Nunito, system-ui, sans-serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('Keyboard Invaders — setup OK', CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2);
