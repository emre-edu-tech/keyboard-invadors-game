# Step 02 — Canvas scaling and game loop

**Goal:** A crisp 16:9 canvas that fits any window, and a game loop whose speed does not depend on the computer's frame rate.
**Depends on:** Step 01 passing its manual test.

**Paste into OpenCode:**
> Read AGENTS.md and specs/02-canvas-and-game-loop.md. Implement only Step 02. When done, list the files you changed and how to test.

## Concepts (comment these briefly in the code)
- **Logical resolution:** the game always thinks in 1280×720 units. The real canvas may be any size; we scale the drawing.
- **Delta time (`dt`):** seconds since the previous frame. Movement is `speed * dt`, so a 30 fps computer and a 144 fps computer move things at the same real speed.

## What to build

### Page layout (this step may modify `index.html` and `css/input.css` from step 01)
The 100vw / 100vh fit below only works if nothing adds space around `#game-root`. Step 01 only needed a visible canvas, so apply these rules now and rebuild with `npm run css:build`:
- `html, body`: `margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden;`. With `overflow: hidden` a scrollbar can never appear (a scrollbar would make `100vw` wider than the visible area).
- `body`: centers `#game-root` (flex, `align-items: center; justify-content: center`) with **no padding and no gap**.
- `#game-root` (and `body`): no padding, margin or border. Remove any Tailwind spacing utilities (`p-*`, `m-*`, `gap-*`) that step 01 put on them.
- The temporary "Tailwind OK" badge must be `position: fixed` so it takes no layout space.
- Touch nothing else in `index.html`. If you must make another layout change for the fit to work, keep it minimal and name it in your reply.

Create:
- `src/core/canvas.js`
  - `setupCanvas(canvas)` returns `{ ctx, resize, getInfo }` and wires resize handling.
  - `getInfo()` returns `{ cssWidth, cssHeight, dpr, backingWidth, backingHeight, logicalWidth, logicalHeight }` (the last two are 1280 and 720). The debug panel reads its canvas numbers from here instead of querying the DOM itself.
  - The element `#game-root` keeps a 16:9 shape: CSS `aspect-ratio: 16 / 9; width: min(100vw, calc(100vh * 16 / 9));`, centered. The canvas fills it (`width: 100%; height: 100%`). Letterbox bars use the page background.
  - Backing store size = CSS size × `devicePixelRatio` (rounded). After each resize set the context transform so that drawing in 1280×720 logical units fills the canvas exactly.
  - `ctx.imageSmoothingEnabled = true`, quality `high`.
  - Resize is handled on `window` `resize`, debounced (~100 ms). Browser zoom triggers `resize`, so zoom must also stay sharp.
- `src/core/loop.js`
  - `createLoop({ update, render })` with `start()`, `stop()`, `resetClock()`.
  - Uses `requestAnimationFrame`. `dt = (now - last) / 1000`, **clamped to 0…0.05**. First frame `dt = 0`.
  - Per frame: `update(dt)` then `render()`.
  - Tracks a smoothed FPS value (average over about 0.5 s), exposed as `loop.fps`.
- `src/ui/debug.js`
  - Only active when the URL has `?debug=1`.
  - Small fixed HTML panel (top-left, monospace, semi-transparent) showing FPS, dt in ms, canvas CSS size, devicePixelRatio and logical size (CSS size, dpr and logical size come from `getInfo()`).
  - Updates on a `setInterval` of 250 ms — **not** inside the render loop.
  - Exposes `debug.set(key, value)` so later steps can add lines.

Modify:
- `src/main.js` — use `setupCanvas`, `createLoop`, debug panel. Remove the static "setup OK" drawing.
- Remove the "Tailwind OK" badge only in step 03 (leave it for now).

### Temporary test scene (removed in step 03)
Draw in logical coordinates:
- A grid line every 160 units (helps you see scaling).
- A square (80×80) moving back and forth horizontally at **320 units/second** between x = 0 and x = 1280 − 80.
- Text "Delta-time test 1280×720" in a system font, size 32, centered.

## Requirements
- All drawing uses logical coordinates only.
- Canvas text and lines stay sharp at window sizes from about 640×360 to fullscreen 4K and at browser zoom 50%–200%.
- No DOM reads/writes inside `update`/`render`.

## Out of scope
State machine, screens, game objects.

## Manual test
- [ ] Open with `?debug=1`: panel shows FPS about equal to your monitor refresh rate (60 typical).
- [ ] Resize the window wide, narrow, tall: canvas stays 16:9 with dark bars; grid squares stay square.
- [ ] No scrollbar (horizontal or vertical) appears at any window size or at browser zoom 50%–200%.
- [ ] Make the window exactly 16:9 (for example 1280×720 using DevTools device size): the canvas fills the whole window with no margin around it.
- [ ] Browser zoom (Ctrl + / Ctrl −) to 50%, 100%, 200%: text stays sharp after the zoom settles.
- [ ] Stopwatch: the square needs about **4 seconds** to cross from left to right (1280 ÷ 320), at any window size (±0.3 s).
- [ ] DevTools → Performance → CPU 4× slowdown: crossing time is still about 4 seconds (it may look choppy — that is fine).
- [ ] Switch to another tab for 10 seconds and come back: the square does not teleport or jump strangely.
- [ ] Without `?debug=1` the panel does not appear.
- [ ] Console is clean.

## Commit
`step 02: scalable canvas, delta-time loop, debug panel`
