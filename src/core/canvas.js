import { CONFIG } from '../config.js';

// Resize events arrive in bursts while a window is dragged, so the real
// re-layout is delayed a little. Browser zoom also fires `resize`, which is
// what keeps the canvas sharp after Ctrl + / Ctrl -.
const RESIZE_DEBOUNCE_MS = 100;

/**
 * Connects a <canvas> element to the fixed logical game world (1280x720).
 *
 * Logical resolution: the game always thinks in 1280x720 units. The real
 * canvas may be any size, so we scale the drawing: the backing store gets the
 * real device pixels and the context transform maps logical units onto them.
 * Because of that, all game code draws 0..1280 x 0..720 and nothing else needs
 * to know about pixels, CSS or devicePixelRatio.
 */
export function setupCanvas(canvas) {
  const ctx = canvas.getContext('2d');

  // Cached so the debug panel can read them without measuring again.
  const info = {
    cssWidth: 0, // CSS size the element actually occupies, in px
    cssHeight: 0,
    backingWidth: 0, // backing store size (CSS size x devicePixelRatio), in px
    backingHeight: 0,
    dpr: 1, // window.devicePixelRatio at the last resize
    logicalWidth: CONFIG.WIDTH, // the fixed logical size the game draws in
    logicalHeight: CONFIG.HEIGHT,
  };

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    // The element's CSS box decides how large the canvas looks on screen.
    const rect = canvas.getBoundingClientRect();
    const cssWidth = Math.max(1, Math.round(rect.width));
    const cssHeight = Math.max(1, Math.round(rect.height));

    // Backing store = CSS size x devicePixelRatio (rounded). Assigning
    // width/height resets the whole context, so this must happen before
    // setTransform(), and only when the size really changed.
    const bufferWidth = Math.max(1, Math.round(cssWidth * dpr));
    const bufferHeight = Math.max(1, Math.round(cssHeight * dpr));
    if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
      canvas.width = bufferWidth;
      canvas.height = bufferHeight;
    }

    // One logical unit becomes cssWidth / 1280 real pixels on x and
    // cssHeight / 720 on y, so drawing the logical rect fills the canvas.
    ctx.setTransform(cssWidth / CONFIG.WIDTH, 0, 0, cssHeight / CONFIG.HEIGHT, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    info.cssWidth = cssWidth;
    info.cssHeight = cssHeight;
    info.backingWidth = bufferWidth;
    info.backingHeight = bufferHeight;
    info.dpr = dpr;
  }

  let debounceTimer = 0;
  function onWindowResize() {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(resize, RESIZE_DEBOUNCE_MS);
  }

  // Size once up front so the very first frame is already crisp.
  resize();
  window.addEventListener('resize', onWindowResize);

  return {
    ctx,
    resize,
    getInfo: () => ({ ...info }),
  };
}