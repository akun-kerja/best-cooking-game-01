// Warung Rasa — mouse and keyboard. Translates screen positions into
// kitchen actions; the rules themselves live in kitchen.js.

import { ZONES } from './render.js';
import {
  takeIngredient, useBoard, useWok, usePlate, clearPlate, serve, startDay,
} from './kitchen.js';
import { clickSound, toggleMute, primeAudio } from './audio.js';

function pointIn(x, y, z) {
  return x >= z.x && x <= z.x + z.w && y >= z.y && y <= z.y + z.h;
}

function toGame(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left) * (1280 / rect.width),
    y: (clientY - rect.top) * (720 / rect.height),
  };
}

export function installInput(canvas, state, onStateChange) {
  function zoneAt(x, y) {
    for (const z of ZONES.bins) if (pointIn(x, y, z)) return { type: 'bin', id: z.id, zone: z };
    if (pointIn(x, y, ZONES.board)) return { type: 'board', zone: ZONES.board };
    if (pointIn(x, y, ZONES.wok)) return { type: 'wok', zone: ZONES.wok };
    if (pointIn(x, y, ZONES.plate)) return { type: 'plate', zone: ZONES.plate };
    if (pointIn(x, y, ZONES.serve)) return { type: 'serve', zone: ZONES.serve };
    if (pointIn(x, y, ZONES.start)) return { type: 'start', zone: ZONES.start };
    if (pointIn(x, y, ZONES.restart)) return { type: 'restart', zone: ZONES.restart };
    if (pointIn(x, y, ZONES.mute)) return { type: 'mute', zone: ZONES.mute };
    return null;
  }

  function act(hit) {
    if (!hit) return;
    if (hit.type === 'mute') {
      toggleMute();
      return;
    }
    if (state.screen === 'title') {
      if (hit.type === 'start') {
        clickSound();
        startDay(state);
      }
      return;
    }
    if (state.screen === 'over') {
      if (hit.type === 'restart') {
        clickSound();
        startDay(state);
      }
      return;
    }
    if (hit.type === 'bin') takeIngredient(state, hit.id);
    else if (hit.type === 'board') useBoard(state);
    else if (hit.type === 'wok') useWok(state);
    else if (hit.type === 'plate') usePlate(state);
    else if (hit.type === 'serve') serve(state);
    if (onStateChange) onStateChange();
  }

  canvas.addEventListener('pointerdown', (ev) => {
    primeAudio();
    const p = toGame(canvas, ev.clientX, ev.clientY);
    act(zoneAt(p.x, p.y));
  });

  canvas.addEventListener('pointermove', (ev) => {
    const p = toGame(canvas, ev.clientX, ev.clientY);
    const hit = zoneAt(p.x, p.y);
    state.hover = hit ? hit.zone : null;
  });

  canvas.addEventListener('pointerleave', () => {
    state.hover = null;
  });

  canvas.addEventListener('contextmenu', (ev) => {
    ev.preventDefault();
    if (state.screen === 'play') clearPlate(state);
  });

  window.addEventListener('keydown', (ev) => {
    if (ev.repeat) return;
    const key = ev.key.toLowerCase();
    if (key === 'm') {
      toggleMute();
      return;
    }
    if (state.screen === 'title' && (key === 'enter' || key === ' ')) {
      clickSound();
      startDay(state);
      return;
    }
    if (state.screen === 'over' && (key === 'r' || key === 'enter')) {
      clickSound();
      startDay(state);
      return;
    }
    if (state.screen !== 'play') return;
    const binKeys = { 1: 'nasi', 2: 'telur', 3: 'ayam', 4: 'mie', 5: 'tahu', 6: 'cabai' };
    if (binKeys[key]) {
      takeIngredient(state, binKeys[key]);
      return;
    }
    if (key === 'c' || key === 'b') useBoard(state);
    else if (key === 'w') useWok(state);
    else if (key === 'p') usePlate(state);
    else if (key === 's') serve(state);
    else if (key === 'x') clearPlate(state);
    else if (key === 'r') startDay(state);
    if (onStateChange) onStateChange();
  });
}
