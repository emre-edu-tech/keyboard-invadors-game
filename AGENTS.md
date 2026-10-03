# AGENTS.md — Keyboard Invaders

Read this file fully at the start of every session. Then read the spec file the user names (in `specs/`).

## Project

Browser typing game for school ICT lessons (students are 10–12 years old, Turkish speakers). Words fall from the top of the screen; the player types a word to destroy it; a word reaching the bottom costs a life.

- Static site: plain HTML + ES modules + **Canvas 2D**. No framework, no bundler, no game engine.
- Tailwind CSS **v3** (npm CLI build) is used **only** for HTML overlays (menu, pause, game over, loading). The canvas is drawn in JavaScript.
- No backend in v1. Do not add Flask, databases or network calls other than `fetch` of local static files.
- The developer is an experienced web developer but new to games. Add short comments that explain game concepts (delta time, state machine, hitbox, entity) where they first appear.

## Project root and pre-existing files

- You are already running inside the **project root**. Create files and folders directly in the current directory. **Never create a wrapper or parent folder** (no `keyboard-invaders/` or similar) and never `cd` into a new project directory.
- These already exist in the root. The developer placed them there and they are **read-only for you**: `AGENTS.md`, `README.md`, `ASSET-GUIDE.md`, `specs/`. Do not create, overwrite, regenerate, rename or "improve" them. (`README.md` and `ASSET-GUIDE.md` are for the human; you do not need to read them.) If you think one needs a change, say so in your reply.
- `_asset-workbench/` and the asset files inside `assets/images/`, `assets/audio/`, `assets/fonts/` are placed by the developer. Never delete or overwrite them, never download assets yourself, and never generate placeholder images or sounds. Missing assets are handled by fallbacks in code.

## Target layout (relative to the project root)

Only the files you create are listed. Create each one in the step whose spec asks for it, not earlier.

```
package.json
tailwind.config.js
.gitignore
index.html
css/
├─ input.css
└─ app.css
src/
├─ main.js
├─ config.js
├─ core/              canvas.js  loop.js  state.js  input.js  text.js  storage.js
├─ game/              game.js  word.js  spawner.js  typing.js  scoring.js  difficulty.js  effects.js
├─ data/              wordlists.js  fallbackWords.js
├─ render/            renderer.js  assets.js
├─ audio/             audio.js
└─ ui/                screens.js  strings.js  debug.js  assetTest.js
data/
└─ wordlists/         index.json  *.json
assets/
├─ manifest.json
└─ credits.json
docs/
└─ DEPLOY.md
```

## Working agreement

1. Implement **only** the step you were asked to. Do not start the next step, do not add features "while you are there".
2. Do not refactor or rename things from earlier steps unless the current spec says so.
3. Do not add npm dependencies. The only devDependency is `tailwindcss@^3.4`. No runtime dependencies at all.
4. When finished, reply with: (a) files created/changed, (b) how to run, (c) anything you were unsure about. Do not paste whole files back.
5. If a spec is ambiguous, choose the simplest reading, leave a `// TODO(spec):` comment and mention it in your reply.
6. Keep modules small (roughly under 200 lines) and single-purpose. Use the target layout above.

## Version control

**Never run `git` commands** — no `git init`, `git add`, `git commit`, `git tag`, or anything else that touches version control. The developer runs every git command by hand, only after testing a step. This includes not running them "to help" or "to save progress" even if a step feels finished.

- You may still **create** `.gitignore` when a spec asks for it — that is just a text file, not a git command.
- Each spec ends with a "Commit" line showing a suggested commit message. That message is **for the developer to type themselves** once they've tested the step. It is not an instruction for you to execute.

## Commands

- `npm install` — once
- `npm run css:build` — build `css/app.css` (minified)
- `npm run css:watch` — rebuild on change while developing UI
- `npm run serve` — `python -m http.server 8000` (ES modules and `fetch` do not work from `file://`)

## Coordinates and drawing

- The game world has a **fixed logical size of 1280×720** (`config.js`). All game code uses these units. Only `core/canvas.js` knows about real pixels and devicePixelRatio.
- Draw order: background → words → effects → player → HUD.
- Never touch the DOM inside the game loop. HUD is drawn on the canvas. HTML overlays are updated only on state changes or events.
- Do not call `ctx.measureText` every frame. Measure once when a word is created and cache widths (including per-character offsets).
- Avoid `shadowBlur` and per-frame object allocation in hot paths where a simple alternative exists.

## Time

- Use **delta time** (seconds) for all movement: `position += speed * dt`. Never assume 60 fps.
- `dt` is clamped in the loop. "Play time" only accumulates while state is `PLAYING`.

## State machine

States: `BOOT`, `MENU`, `PLAYING`, `PAUSED`, `GAME_OVER`. Transitions go through `core/state.js` only. Game logic updates only in `PLAYING`.

## Text and Turkish characters (important)

- Students type on Turkish keyboards. Word lists contain `ç ğ ı İ ö ş ü`.
- Read typed characters from `event.key`, never from `keyCode`.
- Compare characters through `core/text.js` (`normalizeChar(ch, lang)`), which uses `toLocaleLowerCase('tr-TR')` for lists with `lang: "tr"` and `toLowerCase()` otherwise. Never call bare `toLowerCase()`/`toUpperCase()` on user or word text elsewhere.
- Any text that can contain Turkish letters must use the **Nunito** font (see `ASSET-GUIDE.md`). The decorative Kenney font is for the title only.
- All UI text lives in `src/ui/strings.js` (Turkish and English). No hard-coded UI strings elsewhere.

## Assets (from step 08 on, and design-for-it from the start)

- Game code refers to assets **only by logical name** (e.g. `player-ship`, `enemy-3`, `sfx-fire`) through `assets.image(name)` / the audio module. Never hard-code file paths outside `assets/manifest.json`.
- Assets may be missing. `assets.image(name)` returns `null` when an asset failed to load and the renderer must draw a simple fallback shape. **A missing asset must never crash the game.**
- Every asset the game uses must be listed in `assets/credits.json`.

## Storage and safety

- All `localStorage` access goes through `core/storage.js` (try/catch, JSON, key prefix `ki.`). The game must work when storage is unavailable.
- Only call `preventDefault()` on keys the game handles, and never when Ctrl/Meta/Alt is held (browser shortcuts like F5, Ctrl+R must keep working).

## Style

- ES modules, `const`/`let`, no `var`. Semicolons. 2-space indent. English comments and identifiers.
- Constants and tuning numbers go in `src/config.js` with a comment saying what they do and their unit.
- `console.warn` for recoverable problems (with the asset/word/list name), `console.error` only for real bugs. No stray `console.log` in finished steps, except in `?debug=1` mode.

## Debug mode

`?debug=1` in the URL shows a small HTML debug panel (FPS, state, counters, difficulty values, asset status). It updates on a timer (about 4 times per second), not every frame. Later steps add lines to it.
