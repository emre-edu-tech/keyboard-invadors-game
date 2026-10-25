// State machine: the game is in exactly one state at a time, and only the
// moves listed below are legal. Anything else is ignored (with a warning), so
// bugs like "pause while on the menu" cannot happen.

export const STATES = Object.freeze({
  BOOT: 'BOOT',
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER',
});

const ALLOWED_TRANSITIONS = Object.freeze({
  BOOT: ['MENU'],
  MENU: ['PLAYING'],
  PLAYING: ['PAUSED', 'GAME_OVER'],
  PAUSED: ['PLAYING', 'MENU'],
  GAME_OVER: ['PLAYING', 'MENU'],
});

let currentState = STATES.BOOT;

// state -> array of callbacks; one list per state keeps order predictable.
const enterHandlers = new Map();
const exitHandlers = new Map();

function listFor(map, state) {
  let list = map.get(state);
  if (!list) {
    list = [];
    map.set(state, list);
  }
  return list;
}

function register(map, state, fn) {
  const list = listFor(map, state);
  list.push(fn);
  // Returning an unsubscribe function keeps listeners from piling up if a
  // caller ever needs to remove one (e.g. a later step reloading the game).
  return () => {
    const index = list.indexOf(fn);
    if (index !== -1) list.splice(index, 1);
  };
}

function isAllowed(next) {
  const allowed = ALLOWED_TRANSITIONS[currentState];
  return Boolean(allowed && allowed.includes(next));
}

export function getState() {
  return currentState;
}

/**
 * Moves to `next` when the transition is legal.
 * @returns {boolean} true when the state changed.
 */
export function setState(next) {
  if (!isAllowed(next)) {
    console.warn(`[state] illegal transition ${currentState} -> ${next}`);
    return false;
  }

  const previous = currentState;

  for (const fn of exitHandlers.get(previous) || []) fn(previous, next);

  currentState = next;

  for (const fn of enterHandlers.get(next) || []) fn(next, previous);

  return true;
}

/** Registers a callback that runs after the game has entered `state`. */
export function onEnter(state, fn) {
  return register(enterHandlers, state, fn);
}

/** Registers a callback that runs before the game leaves `state`. */
export function onExit(state, fn) {
  return register(exitHandlers, state, fn);
}
