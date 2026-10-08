// The panel is refreshed on its own timer, never inside the render loop:
// rewriting DOM 60 times per second is both wasteful and misleading to read.
const REFRESH_MS = 250;

/**
 * Small debug panel, only created when the URL contains `?debug=1`.
 *
 * `sources` are read lazily from the timer so the panel can show live values
 * without the game loop having to push them every frame:
 *   getLoop()      -> the loop object (fps, dt)
 *   getCanvasInfo()-> { cssWidth, cssHeight, dpr, ... } from core/canvas.js
 *
 * Later steps add their own lines with debug.set('key', value).
 */
export function createDebugPanel({ getLoop, getCanvasInfo }) {
  const enabled = new URLSearchParams(window.location.search).get('debug') === '1';
  const extra = new Map();

  if (!enabled) {
    return { enabled: false, set() {} };
  }

  const panel = document.createElement('pre');
  panel.id = 'debug-panel';
  panel.className =
    'fixed left-2 top-2 z-50 m-0 rounded border border-accent/40 bg-panel/80 px-2 py-1 ' +
    'font-mono text-xs leading-snug text-text';
  panel.setAttribute('aria-hidden', 'true');
  document.body.appendChild(panel);

  function draw() {
    const loop = getLoop();
    const canvas = getCanvasInfo();
    const lines = [
      `fps: ${loop.fps.toFixed(1)}`,
      `dt: ${(loop.dt * 1000).toFixed(1)} ms`,
      `css: ${canvas.cssWidth}x${canvas.cssHeight}`,
      `dpr: ${canvas.dpr}`,
      `logical: ${canvas.logicalWidth}x${canvas.logicalHeight}`,
    ];
    for (const [key, value] of extra) {
      lines.push(`${key}: ${value}`);
    }
    panel.textContent = lines.join('\n');
  }

  const timer = window.setInterval(draw, REFRESH_MS);
  window.addEventListener('pagehide', () => window.clearInterval(timer));

  return {
    enabled: true,
    set(key, value) {
      extra.set(key, value);
    },
  };
}