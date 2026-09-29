# Keyboard Invaders — Build Specs (v1)

A falling-words typing game for ICT lessons. Words fall from the top of the screen, the student types them to destroy them, and a word that reaches the bottom costs a life.

**This file is for you (the developer).** The agent-facing rules are in `AGENTS.md`.

## v1 scope (approved)

- Words/terms fall from the top at increasing speed
- Matching letters highlight as the student types
- Full match = word destroyed + score up; word reaching the bottom = a life lost
- One difficulty curve (speed ramps over time)
- One word list per game, swappable per lesson (typing practice / ICT vocabulary)

**Not in v1** (planned for v2 with Flask + SQLite): class leaderboard, saved scores, admin panel for editing word lists. The code is prepared for them (see "v2 hooks" below) but nothing is built.

## Ground rules

- Everything is free/open source. Assets come from CC0 or CC-BY sources (see `ASSET-GUIDE.md`).
- Static site: plain HTML + ES modules + Canvas 2D. No framework, no bundler. Tailwind v3 (npm) is used only for the menu/pause/game-over screens.
- Desktop keyboard play only in v1 (no touch/mobile).

## Setting up the project folder

1. Create an empty project folder (any name you like) and open OpenCode inside it. That folder is the **project root**.
2. Copy `AGENTS.md`, `README.md`, `ASSET-GUIDE.md` and the `specs/` folder into the root **yourself**. The agent never creates or edits them (see "Project structure" below).
3. Run `git init` and make a first commit.
4. Do the asset shopping in `ASSET-GUIDE.md` **while the agent builds steps 01–07**. You do not need assets before step 08.

## The loop for every step

1. Open a **new OpenCode session** in the project folder. OpenCode reads `AGENTS.md` from the project root automatically; if your version does not, attach it in your first message.
2. Paste the prompt at the top of the step's spec file.
3. Run the game (`npm run serve`, then open http://localhost:8000; use `?debug=1` for the debug panel).
4. Go through the **Manual test** checklist at the bottom of the spec. Every box must pass.
5. All passed → commit with the message suggested in the spec. Something failed → paste the failing checklist item and the browser console error into the same session. Do not start the next step until the current one passes.
6. If the free-tier session limit hits mid-step: commit work-in-progress (`wip: step 0X`), start a new session and say *"Continue step 0X. Check `git diff` and the spec for what is left."*

## Steps

| # | Spec | After this step you can see / test |
|---|------|------------------------------------|
| 01 | `01-project-setup.md` | Project runs locally, Tailwind works, empty canvas on screen |
| 02 | `02-canvas-and-game-loop.md` | Crisp scalable canvas, stable game speed on any computer |
| 03 | `03-game-states-and-screens.md` | Menu → play → pause → game over screens all working |
| 04 | `04-falling-words.md` | Words fall, lives drop when they land, game over at 0 lives |
| 05 | `05-typing-and-scoring.md` | **The game is playable**: type, highlight, destroy, score, combo |
| 06 | `06-difficulty-and-results.md` | Difficulty ramps up; results screen with WPM and accuracy |
| 07 | `07-word-lists.md` | Choose a word list (Turkish/English) from the menu; edit lists in JSON |
| 08 | `08-asset-pipeline.md` | Your downloaded assets load; asset test grid shows what is missing |
| 09 | `09-sprites-backgrounds-effects.md` | Ship, enemies, laser, explosions, background — the game looks like a game |
| 10 | `10-audio.md` | Sound effects, mute, volume, optional music |
| 11 | `11-polish-and-release.md` | Best scores, credits, large-text mode, deploy to your server |

Steps 01–07 need **no assets at all**: the game uses simple drawn shapes until step 09.

## Project structure (target)

Everything below is relative to the **project root**, the folder OpenCode is already working in. The agent must not create an extra project folder inside it.

**Reference files — you copy these in. The agent must not create, rewrite, rename or move them:**

```
AGENTS.md
README.md
ASSET-GUIDE.md
specs/
```

**Built by the agent, step by step:**

```
package.json
tailwind.config.js
.gitignore
index.html
css/
├─ input.css          (Tailwind source)
└─ app.css            (generated, committed)
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
├─ manifest.json      (agent, step 08)
├─ credits.json       (agent, step 08)
└─ images/  audio/  fonts/    (empty folders are fine; you fill them, see ASSET-GUIDE.md)
docs/
└─ DEPLOY.md          (agent, step 11)
```

**Placed by you only (the agent must never create, delete or overwrite these):**

```
_asset-workbench/     your unzipped downloads, git-ignored
assets/images/*  assets/audio/*  assets/fonts/*    the asset files themselves
```

## Tuning the difficulty for a class

All numbers live in `src/config.js` with comments. Step 06 has the table. If 5th graders are overwhelmed, lower `startFallSpeed` and raise `startSpawnInterval`; if 6th graders are bored, do the opposite.

## v2 hooks (already designed in, not built)

- `src/data/wordlists.js` is the only file that knows where word lists come from. In v2 it will call a Flask endpoint instead of reading JSON files; the JSON shape stays the same.
- Step 06 defines a `result` object at game over (score, WPM, accuracy, list id, duration…). In v2 that object is POSTed to Flask as-is.

## Troubleshooting

- **Blank page / module errors:** you opened `index.html` by double-click. Use `npm run serve`.
- **Old word list still showing:** hard refresh (Ctrl+F5). Step 07 makes the game re-fetch lists, but a stale tab may need it once.
- **Text shows squares or wrong letters for ş ğ ı İ:** the font lacks Turkish glyphs. Use Nunito for anything a student might read (see `ASSET-GUIDE.md`).
- **No sound:** browsers block audio until the first click/keypress. Start the game with the button and it should unlock.
