// Warung Rasa — boot and main loop. Wires state, input and rendering
// together and stages screenshot states from the ?shot= URL parameter.

import { newGame, update, stageShot } from './kitchen.js';
import { render, W, H } from './render.js';
import { installInput } from './input.js';
import { isMuted } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');

const state = newGame();

function announce() {
  const parts = [];
  if (state.screen === 'title') parts.push('Warung Rasa. Tekan Enter untuk mulai.');
  else if (state.screen === 'over') parts.push('Hari selesai. Skor ' + state.score + '.');
  else {
    parts.push('Skor ' + state.score + ', koin ' + state.coins + '.');
    parts.push(state.orders.length + ' pesanan menunggu.');
    if (state.hand) parts.push('Di tangan: ' + state.hand.kind.name + '.');
    if (state.message) parts.push(state.message);
  }
  statusEl.textContent = parts.join(' ');
  document.title = state.screen === 'play'
    ? 'Warung Rasa — Skor ' + state.score
    : 'Warung Rasa — Indonesian Cooking Game';
}

installInput(canvas, state, announce);

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot === 'title') {
  state.screen = 'title';
  state.shotMode = true;
} else if (shot === 'cover' || shot === 'serve' || shot === 'rush') {
  stageShot(state, shot);
} else if (shot === 'over') {
  state.screen = 'over';
  state.shotMode = true;
  state.score = 2480;
  state.coins = 265;
  state.served = 14;
  state.bestCombo = 5;
  state.missed = 2;
  state.wasted = 1;
  state.overReason = 'Hari selesai! Warung tutup.';
}

let last = performance.now();

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  update(state, dt);
  render(ctx, state, isMuted());
  requestAnimationFrame(frame);
}

announce();
requestAnimationFrame(frame);
