// Warung Rasa — kitchen state and rules. Owns the timer, the orders,
// the hand, the chopping board, the wok and the plate. Rendering and
// input live in their own files; this file only knows the rules.

import { INGREDIENTS, RECIPES, plateMatches, randomRecipe } from './orders.js';
import {
  chopSound, popSound, dingSound, buzzSound, serveSound,
  startSizzle, stopSizzle,
} from './audio.js';

export const DAY_SECONDS = 150;
export const CHOP_HITS = 3;
export const COOK_SECONDS = 3.5;
export const BURN_SECONDS = 8;

export function newGame() {
  return {
    screen: 'title',
    timeLeft: DAY_SECONDS,
    level: 1,
    score: 0,
    coins: 0,
    combo: 0,
    bestCombo: 0,
    served: 0,
    missed: 0,
    wasted: 0,
    hand: null,
    board: null,
    wok: null,
    plate: [],
    orders: [],
    spawnIn: 1.2,
    message: 'Selamat datang di Warung Rasa!',
    messageT: 0,
    flash: null,
    shotMode: false,
    overReason: '',
    hover: null,
  };
}

export function startDay(state) {
  state.screen = 'play';
  state.timeLeft = DAY_SECONDS;
  state.level = 1;
  state.score = 0;
  state.coins = 0;
  state.combo = 0;
  state.bestCombo = 0;
  state.served = 0;
  state.missed = 0;
  state.wasted = 0;
  state.hand = null;
  state.board = null;
  state.wok = null;
  state.plate = [];
  state.orders = [];
  state.spawnIn = 0.8;
  state.message = 'Pesanan pertama masuk!';
  state.messageT = 3;
}

function say(state, text, seconds) {
  state.message = text;
  state.messageT = seconds || 2.5;
}

function spawnOrder(state) {
  if (state.orders.length >= 3) return;
  const patience = Math.max(32, 52 - state.level * 3);
  state.orders.push({
    id: state.served + state.missed + state.orders.length + 1,
    recipe: randomRecipe(Math.random),
    patience,
    maxPatience: patience,
  });
}

export function update(state, dt) {
  if (state.screen !== 'play' || state.shotMode) return;
  state.timeLeft -= dt;
  if (state.messageT > 0) state.messageT -= dt;
  if (state.flash) {
    state.flash.t -= dt;
    if (state.flash.t <= 0) state.flash = null;
  }
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    state.screen = 'over';
    state.overReason = 'Hari selesai! Warung tutup.';
    stopSizzle();
    return;
  }
  state.spawnIn -= dt;
  if (state.spawnIn <= 0) {
    spawnOrder(state);
    state.spawnIn = Math.max(8, 14 - state.level);
  }
  for (let i = state.orders.length - 1; i >= 0; i--) {
    const order = state.orders[i];
    order.patience -= dt;
    if (order.patience <= 0) {
      state.orders.splice(i, 1);
      state.missed += 1;
      state.combo = 0;
      say(state, 'Pelanggan ' + order.recipe.name + ' pergi kecewa!', 3);
      buzzSound();
    }
  }
  if (state.wok) {
    state.wok.t += dt;
    if (state.wok.t >= COOK_SECONDS && !state.wok.done) {
      state.wok.done = true;
      dingSound();
      say(state, state.wok.kind.name + ' matang! Ambil dari wajan.', 2);
    }
    if (state.wok.t >= COOK_SECONDS + BURN_SECONDS) {
      say(state, state.wok.kind.name + ' gosong! Buang ke tempat sampah.', 3);
      state.wok = null;
      state.wasted += 1;
      stopSizzle();
      buzzSound();
    }
  }
}

// --- Player actions. Each one is one click or one key. ---

export function takeIngredient(state, id) {
  if (state.screen !== 'play') return;
  if (state.hand) {
    say(state, 'Tanganmu penuh! Selesaikan dulu.', 2);
    return;
  }
  const ing = INGREDIENTS[id];
  if (!ing) return;
  state.hand = { kind: ing, stage: 'raw' };
  popSound();
}

export function useBoard(state) {
  if (state.screen !== 'play') return;
  if (state.board) {
    state.board.hits += 1;
    chopSound();
    state.flash = { zone: 'board', t: 0.18 };
    if (state.board.hits >= CHOP_HITS) {
      const ing = state.board.kind;
      state.board = null;
      state.hand = { kind: ing, stage: ing.prep === 'chop' ? 'ready' : 'chopped' };
      say(state, ing.name + ' selesai dicincang.', 2);
      popSound();
    }
    return;
  }
  if (!state.hand || state.hand.stage !== 'raw') {
    say(state, 'Taruh bahan mentah di talenan dulu.', 2);
    return;
  }
  const ing = state.hand.kind;
  if (ing.prep === 'cook') {
    say(state, ing.name + ' tidak perlu dicincang, langsung ke wajan.', 2.5);
    return;
  }
  state.board = { kind: ing, hits: 0 };
  state.hand = null;
  chopSound();
}

export function useWok(state) {
  if (state.screen !== 'play') return;
  if (state.wok && state.wok.done) {
    state.hand = { kind: state.wok.kind, stage: 'ready' };
    state.wok = null;
    stopSizzle();
    popSound();
    return;
  }
  if (state.wok) {
    say(state, 'Masih dimasak, sabar...', 1.5);
    return;
  }
  if (!state.hand) {
    say(state, 'Wajan kosong. Bawa bahan ke sini.', 2);
    return;
  }
  const ing = state.hand.kind;
  const ok = (state.hand.stage === 'raw' && ing.prep === 'cook')
    || (state.hand.stage === 'chopped' && ing.prep === 'chopcook');
  if (!ok) {
    say(state, ing.name + ' belum siap dimasak.', 2.5);
    return;
  }
  state.wok = { kind: ing, t: 0, done: false };
  state.hand = null;
  startSizzle();
}

export function usePlate(state) {
  if (state.screen !== 'play') return;
  if (!state.hand) {
    say(state, 'Piring kosong. Bawa bahan matang ke sini.', 2);
    return;
  }
  if (state.hand.stage !== 'ready') {
    say(state, 'Bahan ini belum siap disajikan.', 2.5);
    return;
  }
  if (state.plate.length >= 3) {
    say(state, 'Piring sudah penuh!', 2);
    return;
  }
  if (state.plate.includes(state.hand.kind.id)) {
    say(state, 'Sudah ada ' + state.hand.kind.name + ' di piring.', 2);
    return;
  }
  state.plate.push(state.hand.kind.id);
  state.hand = null;
  popSound();
}

export function clearPlate(state) {
  if (state.screen !== 'play' || state.plate.length === 0) return;
  state.plate = [];
  state.wasted += 1;
  say(state, 'Piring dibuang. Sayang sekali!', 2);
  buzzSound();
}

export function serve(state) {
  if (state.screen !== 'play') return;
  if (state.plate.length === 0) {
    say(state, 'Piring masih kosong, tidak ada yang disajikan.', 2);
    return;
  }
  const idx = state.orders.findIndex((o) => plateMatches(state.plate, o.recipe));
  if (idx < 0) {
    state.combo = 0;
    state.plate = [];
    state.wasted += 1;
    say(state, 'Salah pesanan! Pelanggan menolak.', 3);
    buzzSound();
    return;
  }
  const order = state.orders[idx];
  state.orders.splice(idx, 1);
  const patienceBonus = Math.round((order.patience / order.maxPatience) * 60);
  const comboBonus = state.combo * 10;
  const earned = order.recipe.price + patienceBonus + comboBonus;
  state.score += earned;
  state.coins += Math.round(earned / 10);
  state.combo += 1;
  state.bestCombo = Math.max(state.bestCombo, state.combo);
  state.served += 1;
  state.plate = [];
  state.flash = { zone: 'serve', t: 0.5 };
  say(state, order.recipe.name + ' disajikan! +' + earned + ' poin.', 3);
  serveSound();
  if (state.served > 0 && state.served % 5 === 0) {
    state.level += 1;
    say(state, 'Level naik! Pesanan makin cepat.', 3);
  }
}

// --- Staged states for screenshots (?shot=...). Timers frozen. ---

export function stageShot(state, shot) {
  state.screen = 'play';
  state.shotMode = true;
  state.timeLeft = 96;
  state.score = 1240;
  state.coins = 132;
  state.combo = 2;
  state.bestCombo = 3;
  state.served = 6;
  state.level = 2;
  state.message = 'Pesanan masuk! Cepat, pelanggan lapar.';
  state.messageT = 99;
  const goreng = RECIPES[0];
  const mieAyam = RECIPES[1];
  const gado = RECIPES[2];
  if (shot === 'serve') {
    state.orders = [
      { id: 1, recipe: goreng, patience: 38, maxPatience: 46 },
      { id: 2, recipe: mieAyam, patience: 22, maxPatience: 40 },
    ];
    state.plate = ['nasi', 'telur', 'cabai'];
    state.hand = null;
    state.wok = null;
    state.board = null;
    state.flash = { zone: 'serve', t: 99 };
  } else if (shot === 'rush') {
    state.timeLeft = 24;
    state.orders = [
      { id: 1, recipe: goreng, patience: 7, maxPatience: 46 },
      { id: 2, recipe: mieAyam, patience: 12, maxPatience: 40 },
      { id: 3, recipe: gado, patience: 18, maxPatience: 44 },
    ];
    state.plate = ['mie'];
    state.hand = { kind: INGREDIENTS.ayam, stage: 'chopped' };
    state.wok = { kind: INGREDIENTS.nasi, t: 2.6, done: false };
    state.board = null;
    state.combo = 4;
  } else {
    // cover: one dish mid-assembly, wok busy, hand full.
    state.orders = [
      { id: 1, recipe: goreng, patience: 34, maxPatience: 46 },
      { id: 2, recipe: gado, patience: 26, maxPatience: 44 },
    ];
    state.plate = ['nasi', 'telur'];
    state.hand = { kind: INGREDIENTS.cabai, stage: 'ready' };
    state.wok = { kind: INGREDIENTS.mie, t: 1.4, done: false };
    state.board = { kind: INGREDIENTS.ayam, hits: 2 };
  }
}
