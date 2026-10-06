// Central tuning constants. All game code uses these logical units.
// WIDTH/HEIGHT are in logical pixels of the fixed game world (1280x720).

export const CONFIG = Object.freeze({
  WIDTH: 1280, // logical game width in px
  HEIGHT: 720, // logical game height in px
  GAME_VERSION: '0.1.0', // current build version string
  COLORS: Object.freeze({
    bg: '#0b0b1f', // page and canvas background
    panel: '#15153a', // overlay panels, word plates
    accent: '#3ee0ff', // highlights, targeted word border
    typed: '#7cffb2', // letters already typed correctly
    danger: '#ff5a6e', // mistakes, lost life
    text: '#f2f4ff', // normal text
    muted: '#8a8fb8', // secondary text
  }),
});
