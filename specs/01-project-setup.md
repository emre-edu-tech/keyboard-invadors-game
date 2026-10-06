# Step 01 — Project setup

**Goal:** A project that runs locally, builds Tailwind, and shows an empty canvas.
**Depends on:** nothing.

**Paste into OpenCode:**
> Read AGENTS.md and specs/01-project-setup.md. Implement only Step 01. When done, list the files you created and how to run the project.

## You do first
- The project root is an empty folder that already contains `AGENTS.md`, `README.md`, `ASSET-GUIDE.md` and `specs/` (copied in by you), OpenCode is opened in it, and `git init` is done.
- Node.js and Python are installed (you already use both).

## What to build

Work directly in the current directory (the project root). Do **not** create a project subfolder, and do **not** create or modify `AGENTS.md`, `README.md`, `ASSET-GUIDE.md` or `specs/`; they already exist.

Create:
- `package.json` — name `keyboard-invaders`, `"type": "module"`, private. Only devDependency: `tailwindcss@^3.4`. Scripts:
  - `css:build`: `tailwindcss -i ./css/input.css -o ./css/app.css --minify`
  - `css:watch`: same without `--minify`, with `--watch`
  - `serve`: `python -m http.server 8000` (mention in a comment/README line that on some Windows setups it is `py -m http.server 8000`)
- `tailwind.config.js` — content globs `./index.html` and `./src/**/*.js`. Extend the theme with the palette below and font families (`ui`: Nunito, system-ui, sans-serif; `title`: KenVector Future, Nunito, sans-serif).
- `css/input.css` — the three `@tailwind` directives plus a small base layer: `html, body` full height, dark background, no scrollbars, no text selection on the game area.
- `.gitignore` — `node_modules/`, `_asset-workbench/`. **Do not** ignore `css/app.css` (it is committed so deployment needs no Node).
- `index.html` — `lang="tr"`, viewport meta, title "Keyboard Invaders", links `css/app.css`, body centered with flex. Contains `<div id="game-root">` with `<canvas id="game-canvas" width="1280" height="720">`, a `<noscript>` message, and `<script type="module" src="src/main.js">`.
- `src/config.js` — exports a frozen `CONFIG` with `WIDTH: 1280`, `HEIGHT: 720`, `GAME_VERSION: '0.1.0'` and a `COLORS` object using the palette.
- `src/main.js` — imports config, gets the canvas, fills it with the background color and writes "Keyboard Invaders — setup OK" centered (temporary).

### Palette (use in Tailwind theme and `COLORS`)

| Name | Hex | Use |
|---|---|---|
| `bg` | `#0b0b1f` | page and canvas background |
| `panel` | `#15153a` | overlay panels, word plates |
| `accent` | `#3ee0ff` | highlights, targeted word border |
| `typed` | `#7cffb2` | letters already typed correctly |
| `danger` | `#ff5a6e` | mistakes, lost life |
| `text` | `#f2f4ff` | normal text |
| `muted` | `#8a8fb8` | secondary text |

### Temporary items (removed in step 03)
- A small "Tailwind OK" badge in a page corner, styled only with Tailwind classes (rounded, accent color) — proves the CSS pipeline works.

### File-protocol warning
ES modules do not load from `file://`. Add a tiny **non-module inline script** in `index.html` that, when `location.protocol === 'file:'`, shows a visible message: "Please run the game through a local server (npm run serve)."

## Requirements
- Canvas shows at logical size 1280×720 and shrinks with `max-width: 100%` (real scaling comes in step 02).
- No console errors, no 404s.
- No dependencies beyond `tailwindcss`.

## Out of scope
Scaling logic, game loop, state machine, assets.

## Manual test
- [ ] `npm install` finishes without errors.
- [ ] `npm run css:build` creates a non-empty `css/app.css`.
- [ ] `npm run serve`, open http://localhost:8000: dark page, canvas with the text "Keyboard Invaders — setup OK".
- [ ] The "Tailwind OK" badge is styled (proves Tailwind).
- [ ] DevTools Console has no errors; Network shows all requests 200.
- [ ] Double-click `index.html` (file://): the "please run through a local server" message is visible.
- [ ] Make the browser window narrower: the canvas shrinks and nothing scrolls sideways.
- [ ] `git status` shows only new files (`package.json`, `index.html`, `css/`, `src/` …). There is no extra wrapper folder, and `AGENTS.md`, `README.md`, `ASSET-GUIDE.md` and `specs/` are unchanged.

## Commit
`step 01: project skeleton, tailwind pipeline, empty canvas`
