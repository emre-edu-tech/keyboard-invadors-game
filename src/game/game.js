import { CONFIG } from '../config.js';
import { STATES, getState } from '../core/state.js';

/**
 * Owns the game data and draws/updates it per state.
 *
 * Step 03 only needs a play-time counter: it proves that updates happen only
 * while PLAYING and that the state machine freezes the world when paused.
 * Words, typing and lives arrive in later steps.
 */
export function createGame() {
  let playTime = 0; // seconds spent in PLAYING since the last startNewGame()

  /** Resets all game data. Called for Start, Restart and Play Again. */
  function startNewGame() {
    playTime = 0;
  }

  function update(dt) {
    // Game logic runs only in PLAYING. PAUSED/MENU/GAME_OVER therefore keep
    // their last values, which is what makes the pause screen a freeze-frame.
    if (getState() === STATES.PLAYING) {
      playTime += dt;
    }
  }

  function renderPlayfield(ctx) {
    ctx.fillStyle = CONFIG.COLORS.bg;
    ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // TEMP step 03 placeholder; real gameplay replaces this in step 04.
    // TODO(spec): spec 03 asks for this exact English literal, so it stays out
    // of ui/strings.js for now.
    ctx.fillStyle = CONFIG.COLORS.text;
    ctx.font = '600 44px system-ui, sans-serif';
    ctx.fillText('PLAYING (placeholder)', CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 - 30);

    ctx.fillStyle = CONFIG.COLORS.accent;
    ctx.font = '700 32px system-ui, sans-serif';
    ctx.fillText(`Play time: ${playTime.toFixed(1)} s`, CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2 + 40);
  }

  function render(ctx) {
    const state = getState();

    if (state === STATES.PLAYING || state === STATES.PAUSED) {
      // PAUSED draws the same playfield underneath its overlay: render() is
      // read-only, so the counter stays frozen.
      renderPlayfield(ctx);
      return;
    }

    // BOOT, MENU and GAME_OVER sit on a plain background; the overlay carries
    // all of their content.
    ctx.fillStyle = CONFIG.COLORS.bg;
    ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
  }

  return { startNewGame, update, render };
}
