import { CONFIG } from '../config.js';
import { t } from './strings.js';

// Which screen belongs to each state. PLAYING has no overlay: the canvas is
// the whole interface, so the overlay layer is hidden to let clicks through.
const SCREEN_BY_STATE = Object.freeze({
  BOOT: 'loading',
  MENU: 'menu',
  PLAYING: null,
  PAUSED: 'pause',
  GAME_OVER: 'gameOver',
});

const PANEL =
  'rounded-2xl border border-accent/30 bg-panel/[0.85] px-14 py-12 text-center shadow-2xl';

const BUTTON_BASE =
  'min-w-[300px] rounded-xl border-2 px-8 py-3 text-2xl font-extrabold ' +
  'transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/60';

const BUTTON_PRIMARY =
  `${BUTTON_BASE} border-accent bg-accent text-bg hover:bg-accent/90 active:bg-accent/80`;

const BUTTON_SECONDARY =
  `${BUTTON_BASE} border-muted/60 bg-panel text-text hover:border-accent hover:bg-accent/10`;

function button(label, action, variant = 'secondary') {
  const classes = variant === 'primary' ? BUTTON_PRIMARY : BUTTON_SECONDARY;
  return `<button type="button" data-action="${action}" class="${classes}">${label}</button>`;
}

function screenElement(name, innerHtml) {
  const element = document.createElement('div');
  element.className = 'absolute inset-0 flex items-center justify-center px-16';
  element.dataset.screen = name;
  element.style.display = 'none';
  element.innerHTML = innerHtml;
  return element;
}

/**
 * Builds the HTML overlays once and shows exactly one per game state.
 *
 * The overlay is authored at the fixed 1280x720 logical size and then scaled
 * with a CSS transform to match the canvas. That keeps every panel in the same
 * place and the same relative size at any window size.
 *
 * @param {object} options
 * @param {HTMLElement} options.root      the #game-root element (canvas parent)
 * @param {Function} options.onStart      menu "Start"
 * @param {Function} options.onResume     pause "Resume"
 * @param {Function} options.onRestart    pause "Restart"
 * @param {Function} options.onQuitToMenu pause / game over "Main Menu"
 * @param {Function} options.onPlayAgain  game over "Play Again"
 */
export function createScreens({
  root,
  onStart,
  onResume,
  onRestart,
  onQuitToMenu,
  onPlayAgain,
}) {
  const layer = document.createElement('div');
  layer.className = 'absolute inset-0 z-10 overflow-hidden';
  layer.style.display = 'none';

  const stage = document.createElement('div');
  stage.className = 'absolute left-0 top-0 origin-top-left';
  stage.style.width = `${CONFIG.WIDTH}px`;
  stage.style.height = `${CONFIG.HEIGHT}px`;
  layer.appendChild(stage);

  const screens = new Map();

  screens.set(
    'loading',
    screenElement(
      'loading',
      `<div class="text-center">
        <p class="animate-pulse text-4xl font-bold text-accent">${t('loading')}</p>
      </div>`,
    ),
  );

  screens.set(
    'menu',
    screenElement(
      'menu',
      `<section class="${PANEL} w-[960px]">
        <h1 class="font-title text-6xl tracking-[0.12em] text-accent">${t('gameTitle')}</h1>
        <p class="mt-4 text-2xl text-muted">${t('subtitle')}</p>
        <div class="mt-10 flex justify-center">
          ${button(t('start'), 'start', 'primary')}
        </div>
        <div class="mt-10 space-y-2 text-xl text-text/90">
          <p>${t('howTo1')}</p>
          <p>${t('howTo2')}</p>
          <p>${t('howTo3')}</p>
        </div>
        <p class="mt-8 text-lg text-muted">${t('hintKeys')}</p>
      </section>`,
    ),
  );

  screens.set(
    'pause',
    screenElement(
      'pause',
      `<section class="${PANEL} w-[720px]">
        <h1 class="font-title text-5xl tracking-[0.08em] text-accent">${t('paused')}</h1>
        <div class="mt-10 flex flex-col items-center gap-4">
          ${button(t('resume'), 'resume', 'primary')}
          ${button(t('restart'), 'restart')}
          ${button(t('quitToMenu'), 'quitToMenu')}
        </div>
      </section>`,
    ),
  );

  screens.set(
    'gameOver',
    screenElement(
      'gameOver',
      `<section class="${PANEL} w-[720px]">
        <h1 class="font-title text-5xl tracking-[0.08em] text-accent">${t('gameOver')}</h1>
        <div class="mt-10 flex flex-col items-center gap-4">
          ${button(t('playAgain'), 'playAgain', 'primary')}
          ${button(t('quitToMenu'), 'quitToMenu')}
        </div>
      </section>`,
    ),
  );

  for (const element of screens.values()) stage.appendChild(element);
  root.appendChild(layer);

  const actions = {
    start: onStart,
    resume: onResume,
    restart: onRestart,
    quitToMenu: onQuitToMenu,
    playAgain: onPlayAgain,
  };

  for (const element of layer.querySelectorAll('button[data-action]')) {
    element.addEventListener('click', () => {
      // Drop focus so Space/Enter cannot re-activate this button after the
      // overlay disappears and the player starts typing.
      element.blur();

      const action = element.dataset.action;
      const handler = actions[action];
      if (handler) handler();
      else console.warn(`[screens] unknown action "${action}"`);
    });
  }

  // Scale the 1280x720 stage to whatever width #game-root currently has.
  // ResizeObserver also covers browser zoom and layout changes without a
  // window resize event.
  function updateScale() {
    const width = root.getBoundingClientRect().width;
    if (!width) return;
    stage.style.transform = `scale(${width / CONFIG.WIDTH})`;
  }

  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(updateScale).observe(root);
  } else {
    window.addEventListener('resize', updateScale);
  }
  updateScale();

  function sync(state) {
    const visible = SCREEN_BY_STATE[state] ?? null;

    for (const [name, element] of screens) {
      element.style.display = name === visible ? 'flex' : 'none';
    }

    layer.style.display = visible ? 'block' : 'none';
  }

  return { sync };
}
