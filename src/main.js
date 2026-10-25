import { setupCanvas } from './core/canvas.js';
import { createLoop } from './core/loop.js';
import { STATES, getState, onEnter, setState } from './core/state.js';
import { createGame } from './game/game.js';
import { createDebugPanel } from './ui/debug.js';
import { createScreens } from './ui/screens.js';

const rootElement = document.getElementById('game-root');
const canvasElement = document.getElementById('game-canvas');
const { ctx, getInfo } = setupCanvas(canvasElement);

const game = createGame();

// TEMP step 03: keyboard handling lives here until core/input.js arrives in
// step 05. Only Enter, Esc and the G test key are used; letters stay free for
// typing from step 05 on.
function isTypingTarget(target) {
  return (
    target instanceof HTMLElement &&
    (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
  );
}

function startGame() {
  if (getState() === STATES.MENU || getState() === STATES.GAME_OVER) {
    game.startNewGame();
    setState(STATES.PLAYING);
  }
}

function restartGame() {
  if (getState() === STATES.PAUSED) {
    game.startNewGame();
    setState(STATES.PLAYING);
  }
}

function quitToMenu() {
  setState(STATES.MENU);
}

function pauseGame() {
  // Used by Esc and by the auto-pause events; both may fire at any time, so
  // the state itself decides whether there is anything to pause.
  if (getState() === STATES.PLAYING) setState(STATES.PAUSED);
}

function togglePause() {
  if (getState() === STATES.PLAYING) setState(STATES.PAUSED);
  else if (getState() === STATES.PAUSED) setState(STATES.PLAYING);
}

const screens = createScreens({
  root: rootElement,
  onStart: startGame,
  onResume: togglePause,
  onRestart: restartGame,
  onQuitToMenu: quitToMenu,
  onPlayAgain: startGame,
});

const loop = createLoop({
  update: (dt) => game.update(dt),
  render: () => game.render(ctx),
});

const debug = createDebugPanel({ getLoop: () => loop, getCanvasInfo: getInfo });

// One listener per state keeps the overlay in sync without touching the DOM
// from the game loop: HTML is only updated on a state change.
for (const state of Object.values(STATES)) {
  onEnter(state, (nextState) => {
    screens.sync(nextState);
    debug.set('state', nextState);
  });
}

function onKeyDown(event) {
  if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
  if (isTypingTarget(event.target)) return;

  const state = getState();

  if (event.key === 'Enter') {
    // A focused overlay button handles Enter natively. Handling it here too
    // would fire the action twice, so let the button win.
    if (event.target instanceof Element && event.target.closest('button')) return;

    if (state === STATES.MENU || state === STATES.GAME_OVER) {
      event.preventDefault();
      startGame();
    }
    return;
  }

  if (event.key === 'Escape') {
    if (state === STATES.PLAYING || state === STATES.PAUSED) {
      event.preventDefault();
      togglePause();
    }
    return;
  }

  // TEMP step 03 — remove in step 04. Only for testing the game-over screen;
  // lives will trigger game over for real later.
  if ((event.key === 'g' || event.key === 'G') && state === STATES.PLAYING) {
    event.preventDefault();
    setState(STATES.GAME_OVER);
  }
}

document.addEventListener('keydown', onKeyDown);

// Auto-pause: leaving the tab or the window must never let words keep falling
// unnoticed. `blur` covers switching to another application, visibilitychange
// covers switching tabs.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseGame();
});
window.addEventListener('blur', pauseGame);

// Boot: BOOT -> MENU straight away. Real asset loading with the loading screen
// arrives in step 08; for now that overlay only has to exist.
screens.sync(STATES.BOOT);
loop.start();
setState(STATES.MENU);
