# Asset Guide — Keyboard Invaders

For you (the developer). The agent only needs the rule in `AGENTS.md`: *code uses logical names, files are wired up in `assets/manifest.json`, missing assets fall back to drawn shapes.*

## The short version

To finish v1 you need exactly **two downloads**:

1. **Kenney "Space Shooter Redux"** — one zip (about 1 MB, license **CC0**). It contains 295+ sprites, four backgrounds, two fonts and seven sound effects. Its own description lists the fonts and sound effects as bonus content, so one download covers images, fonts and basic sounds.
2. **Nunito** font from Google Fonts (license **SIL Open Font License**). Needed because decorative fonts usually lack Turkish letters.

Everything else in this guide (extra sounds, music, other sources) is optional.

You do **not** need assets until step 08. Until then the game draws simple shapes, and it keeps doing that for any asset you never provide.

## Where to find free assets (in the order I would use them)

| Source | Good for | License to expect | Notes |
|---|---|---|---|
| **kenney.nl/assets** | sprites, tiles, UI, sounds, fonts | CC0 for everything | Best first stop. Consistent style within a pack. Search "Space Shooter Redux". |
| **opengameart.org** | sprites, music, sound effects | mixed (CC0, CC-BY, others) | The Redux pack is also mirrored here. **Filter by license** and read it on every asset page. |
| **itch.io** → Game Assets → "Free" | packs, tilesets, music | varies per author | Read the license text on the page. Prefer packs that say CC0 or CC-BY. |
| **freesound.org** | sound effects | mixed | Use the license filter and choose CC0. Needs a free account to download. |
| **fonts.google.com** | fonts | SIL OFL (free to use) | Use the "Language: Turkish" filter. |

Do **not** take images or sounds from Google Images, YouTube, or other games. Free means the author says it is free.

## Licenses in 60 seconds

- **CC0**: no conditions at all. Best choice.
- **CC-BY**: free, but you **must credit** the author. Fine — just fill in `assets/credits.json`.
- **SIL OFL** (fonts): free to use and embed. Keep the license text file next to the font.
- **NC / ND / GPL / "unknown"**: skip them. Not worth the doubt.

If a license is unclear, skip that asset. There is always another one.

## Step-by-step: Space Shooter Redux

1. Download **Space Shooter Redux** (kenney.nl/assets, or the OpenGameArt page). Save the zip.
2. Unzip it into `_asset-workbench/space-shooter-redux/` **inside your project folder** (the folder is git-ignored). Never edit the originals; always **copy** what you need.
3. Open the preview/sample image in the zip to see what is in the pack. Browse the `PNG` folder in your file explorer with thumbnails on.
4. Copy the files from the picklist below into `assets/images/`, `assets/audio/` and `assets/fonts/`, and **rename them to the logical name**.
5. Open the game with `?debug=assets` (step 08). Every image you placed should appear in a grid; red boxes are missing ones.

> **File names:** the source names below are the ones I know from this pack, but I could not open the zip while writing this. If a name does not exist, pick a similar-looking sprite visually and give it the logical name. The game only cares about the logical name, never the original.

### Images → `assets/images/`

| Logical name (save as) | What it is | Source in the pack |
|---|---|---|
| `player-ship.png` | your ship at the bottom | `playerShip1_blue.png` |
| `life-icon.png` | small icon for lives in the HUD | `playerLife1_blue.png` (UI folder) |
| `enemy-1.png` … `enemy-5.png` | five enemy ships; each falling word gets one at random | any five of `enemyBlack1`, `enemyBlue2`, `enemyGreen3`, `enemyRed4`, `enemyBlack5` … (pick ones that look different from each other) |
| `laser.png` | beam/bolt fired at a word | `laserBlue01.png` (Lasers folder) |
| `fx-star.png` | particle for explosions | `star1.png` (Effects folder) |
| `bg-tile.png` | seamless background tile | `darkPurple.png` (Backgrounds folder; `black.png`, `blue.png`, `purple.png` also work) |

Optional later: meteor sprites for decoration, `ufo*.png` enemies, power-up icons.

### Sounds → `assets/audio/`

The pack includes seven `.ogg` sound effects (in its bonus folder). Suggested mapping:

| Logical name (save as) | Use | Source in the pack |
|---|---|---|
| `sfx-fire.ogg` | word destroyed | `sfx_laser1.ogg` |
| `sfx-fire-alt.ogg` | word destroyed (variety) | `sfx_laser2.ogg` |
| `sfx-life-lost.ogg` | a word landed | `sfx_shieldDown.ogg` |
| `sfx-combo.ogg` | combo multiplier went up | `sfx_shieldUp.ogg` |
| `sfx-level-up.ogg` | new level | `sfx_twoTone.ogg` |
| `sfx-game-over.ogg` | game over | `sfx_lose.ogg` |

Optional extras (the game runs fine without them, it just stays silent for these events):

| Logical name | Use | Where to look |
|---|---|---|
| `sfx-key.ogg` | correct keystroke tick | Kenney's *Interface Sounds* pack (search kenney.nl/assets for "interface sounds"; pick a very short click) |
| `sfx-wrong.ogg` | wrong key | same pack, pick an "error" style sound |
| `sfx-click.ogg` | menu button | same pack |
| `music-loop.ogg` | background music | OpenGameArt: search "space ambient loop", license **CC0**, listen for a loop that is calm (students need to concentrate) |

Tips for sounds: keep effects under about 1.5 seconds; if one is too loud, do not edit it — the manifest has a per-sound `volume` value (step 08). Audacity (free) can trim silence if you want.

### Fonts → `assets/fonts/`

1. **Nunito** (words, HUD, menus — everything students read): on fonts.google.com open *Nunito* → *Download family*. From the zip's `static` folder copy `Nunito-Regular.ttf`, `Nunito-Bold.ttf`, `Nunito-ExtraBold.ttf` into `assets/fonts/`. Also copy the zip's `OFL.txt` to `assets/fonts/Nunito-OFL.txt`.
2. **Kenney Future** (game title only): from the Redux pack's bonus folder copy `kenvector_future.ttf` to `assets/fonts/`.

Why two fonts: sci-fi display fonts usually have no `ş ğ ı İ`. If a Turkish word were drawn in the Kenney font, those letters would silently switch to another font and look broken. Rule: **anything a student might read that contains Turkish letters uses Nunito.** The Kenney font is only for the English title "KEYBOARD INVADERS" and big numbers.

## Credits — do this the moment you add an asset

Two places, kept in sync:

- `assets/credits.json` — read by the in-game credits screen (step 11)
- the manifest entries in `assets/manifest.json` reference the same pack names

Fill one entry per pack or font, for example:

```json
{
  "entries": [
    {
      "name": "Space Shooter Redux",
      "author": "Kenney",
      "url": "https://kenney.nl/assets/space-shooter-redux",
      "license": "CC0 1.0",
      "usedFor": "ships, lasers, effects, background, sound effects, title font",
      "downloadedOn": "2026-09-28"
    },
    {
      "name": "Nunito",
      "author": "Vernon Adams et al. (Google Fonts)",
      "url": "https://fonts.google.com/specimen/Nunito",
      "license": "SIL OFL 1.1",
      "usedFor": "all text",
      "downloadedOn": "2026-09-28"
    }
  ]
}
```

CC0 does not require credit, but crediting is good practice and takes one minute. For CC-BY assets it is **mandatory**.

## Checking that it worked

1. `npm run serve`, open `http://localhost:8000/?debug=assets`.
2. You should see a grid with every logical name. Loaded = the picture; missing = a red box with the name. Fonts are shown with a test line `ÇĞİÖŞÜ çğıöşü` — every letter must look right.
3. Missing files are fine at any time; the game uses fallback shapes for them.

## Swapping or re-skinning later

- To change how the game looks, **replace files but keep the logical names** (and update `credits.json`). No code changes needed.
- To add a new asset: put the file in `assets/`, add one line to `manifest.json`, add credits, then ask the agent to use the new logical name.
- Want a different theme (e.g. meteors instead of ships)? Same pack, different picks: rename other sprites to `enemy-1` … `enemy-5`.

## Choosing assets well

- **Stick to one pack for visuals.** Mixed styles look messy; one pack looks professional even when simple.
- Prefer sprites that are readable when small (enemies are drawn about 64 px wide).
- Word plates (dark rounded rectangles behind text) are always drawn by code so text stays readable on any background.
- Keep the whole `assets/` folder under about 3 MB; school networks can be slow.
- Sprites: PNG. Sounds: OGG (works in Chrome, Edge and Firefox).

## Later, outside v1

- AI-generated art or music is possible with free tools, but it is slower and less consistent than a single Kenney pack. Revisit it after the first game is finished; the same manifest and logical names will work for it.
- For the MonoGame and Diablo-like projects: Kenney has dungeon and top-down packs, and OpenGameArt has a large CC0/CC-BY horror and dark-fantasy section. The same license rules apply.
