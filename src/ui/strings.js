import { CONFIG } from '../config.js';

// Single source of truth for UI text. Screens never hard-code a label.
// Only 'tr' and 'en' exist; any other config value falls back to Turkish.
export const UI_LANG = CONFIG.UI_LANG === 'en' ? 'en' : 'tr';

const STRINGS = {
  tr: {
    gameTitle: 'KEYBOARD INVADERS',
    subtitle: 'Kelimeleri yazarak yok et!',
    start: 'Başla',
    resume: 'Devam Et',
    restart: 'Yeniden Başlat',
    quitToMenu: 'Ana Menü',
    paused: 'Duraklatıldı',
    gameOver: 'Oyun Bitti',
    playAgain: 'Tekrar Oyna',
    loading: 'Yükleniyor…',
    howTo1: 'Düşen kelimeyi klavyeyle yaz.',
    howTo2: 'Kelime tamamlanınca yok olur ve puan kazanırsın.',
    howTo3: 'Kelime yere değerse bir can kaybedersin.',
    hintKeys: 'Enter: başla · Esc: duraklat',
    score: 'PUAN',
    lives: 'CAN',
    level: 'SEVİYE',
    combo: 'KOMBO',
  },
  en: {
    gameTitle: 'KEYBOARD INVADERS',
    subtitle: 'Type the words to destroy them!',
    start: 'Start',
    resume: 'Resume',
    restart: 'Restart',
    quitToMenu: 'Main Menu',
    paused: 'Paused',
    gameOver: 'Game Over',
    playAgain: 'Play Again',
    loading: 'Loading…',
    howTo1: 'Type the falling word on your keyboard.',
    howTo2: 'Finish a word to destroy it and score points.',
    howTo3: 'If a word lands you lose a life.',
    hintKeys: 'Enter: start · Esc: pause',
    score: 'SCORE',
    lives: 'LIVES',
    level: 'LEVEL',
    combo: 'COMBO',
  },
};

/**
 * Returns the UI string for `key` in the configured language.
 * Missing keys fall back to English, then to the key itself.
 */
export function t(key) {
  const value = STRINGS[UI_LANG][key] ?? STRINGS.en[key];
  if (typeof value !== 'string') {
    console.warn(`[strings] missing key "${key}" for language "${UI_LANG}"`);
    return key;
  }
  return value;
}
