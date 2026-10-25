# Step 03 — Game states and screens

**Goal:** Menu → playing → pause → game over, all navigable with keyboard and mouse.
**Depends on:** Step 02 passing its manual test.

**Paste into OpenCode:**
> Read AGENTS.md and specs/03-game-states-and-screens.md. Implement only Step 03. When done, list the files you changed and how to test.

## Concept
A **state machine**: the game is always in exactly one state, and only certain moves between states are allowed. This prevents bugs like "pause while on the menu".

## What to build

Create:
- `src/core/state.js`
  - States: `BOOT`, `MENU`, `PLAYING`, `PAUSED`, `GAME_OVER`.
  - `getState()`, `setState(next)`, `onEnter(state, fn)`, `onExit(state, fn)`.
  - Allowed transitions only: `BOOT→MENU`, `MENU→PLAYING`, `PLAYING→PAUSED`, `PAUSED→PLAYING`, `PAUSED→MENU`, `PLAYING→GAME_OVER`, `GAME_OVER→PLAYING`, `GAME_OVER→MENU`. An illegal transition does nothing and logs `console.warn`.
- `src/ui/strings.js`
  - `UI_LANG` chosen from `config.js` (`UI_LANG: 'tr'` default; add it to config). Exports `t(key)` returning the string for the current language. All UI text must come from here.
  - Keys and texts:

| key | tr | en |
|---|---|---|
| `gameTitle` | KEYBOARD INVADERS | KEYBOARD INVADERS |
| `subtitle` | Kelimeleri yazarak yok et! | Type the words to destroy them! |
| `start` | Başla | Start |
| `resume` | Devam Et | Resume |
| `restart` | Yeniden Başlat | Restart |
| `quitToMenu` | Ana Menü | Main Menu |
| `paused` | Duraklatıldı | Paused |
| `gameOver` | Oyun Bitti | Game Over |
| `playAgain` | Tekrar Oyna | Play Again |
| `loading` | Yükleniyor… | Loading… |
| `howTo1` | Düşen kelimeyi klavyeyle yaz. | Type the falling word on your keyboard. |
| `howTo2` | Kelime tamamlanınca yok olur ve puan kazanırsın. | Finish a word to destroy it and score points. |
| `howTo3` | Kelime yere değerse bir can kaybedersin. | If a word lands you lose a life. |
| `hintKeys` | Enter: başla · Esc: duraklat | Enter: start · Esc: pause |
| `score` | PUAN | SCORE |
| `lives` | CAN | LIVES |
| `level` | SEVİYE | LEVEL |
| `combo` | KOMBO | COMBO |

- `src/ui/screens.js`
  - Builds the overlay HTML **once** inside `#game-root` (loading, menu, pause, game over) and shows exactly one according to state. Style with Tailwind classes and the palette.
  - **Scaling:** design each overlay at a fixed 1280×720 size in a container that is scaled to the canvas with `transform: scale(k)` (`transform-origin: top left`, `k = rootWidth / 1280`, updated on resize). This keeps layout identical at every window size.
  - Menu: title (font-title), subtitle, **Start** button, three how-to lines, hint line.
  - Pause: title, **Resume**, **Restart**, **Main Menu** buttons.
  - Game over: title and **Play Again** / **Main Menu** buttons (stats come in step 06).
  - Overlay panels are semi-transparent (`panel` color at about 85%) so the canvas is visible behind them.
- `src/game/game.js`
  - Owns `startNewGame()` (resets all game data) and per-state `update(dt)` / `render(ctx)`.
  - For now: `PLAYING` draws the text "PLAYING (placeholder)" and a play-time counter in seconds; time only increases in `PLAYING`, freezes in `PAUSED`, resets on a new game.
  - `MENU`, `PAUSED`, `GAME_OVER`: draw a plain background (in `PAUSED` keep drawing the frozen play screen).

Modify:
- `src/main.js` — boot: `BOOT` → immediately `MENU` (real loading arrives in step 08; the loading screen only needs to exist).
- Remove the step 02 test scene and the "Tailwind OK" badge.

### Input rules (temporary keyboard handling in `main.js`; a real `input.js` arrives in step 05)
- `Enter`: on menu → start; on game over → play again.
- `Esc`: toggles pause while playing/paused. Do **not** use `P` or any other letter: from step 05 on, letters are reserved for typing.
- `G` while playing → game over. Mark clearly: `// TEMP step 03 — remove in step 04` (only for testing the screens; game over will come from lives in step 04).
- After clicking any overlay button, call `blur()` on it so that Space/Enter cannot re-trigger it while playing.
- Auto-pause: if state is `PLAYING` and the tab becomes hidden (`visibilitychange`) or the window loses focus (`blur`), go to `PAUSED`.
- Ignore key auto-repeat (`event.repeat`) for these actions.

## Requirements
- Every overlay button also works with keyboard Tab + Enter/Space (real `<button>` elements).
- Overlay text is readable from a 800×450 canvas up to 1920×1080.
- Turkish letters in the menu (Başla, Duraklatıldı, Yükleniyor, Oyun Bitti) render correctly.

## Out of scope
Words, typing, assets, fonts (system fonts are fine now), sounds.

## Manual test
- [ ] Page loads to the Menu (a loading flash is okay).
- [ ] Enter or the Start button starts; the counter counts up.
- [ ] Esc pauses: counter freezes, pause panel appears. Esc resumes from the same number. (P does nothing.)
- [ ] Restart sets the counter back to 0 and keeps playing; Main Menu returns to the menu; Start again begins at 0.
- [ ] While playing, switch to another tab or window and return: the game is paused.
- [ ] Press G: game over screen. Enter plays again (counter starts at 0). Main Menu works.
- [ ] Click Start with the mouse, then press Space and Enter a few times while playing: nothing happens.
- [ ] Resize the window on each screen: panels stay aligned with the canvas and stay readable at small and large sizes.
- [ ] Turkish letters ş ğ ı İ ö ü ç are displayed correctly on every screen.
- [ ] Illegal transitions are impossible: pressing Esc on the menu does nothing.
- [ ] Console has no errors.

## Commit
`step 03: state machine and menu/pause/game-over screens`
