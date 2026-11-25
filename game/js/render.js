// Warung Rasa — everything the player sees is drawn here on one canvas.
// No images, no fonts from the network; shapes and text only.

import { INGREDIENTS, INGREDIENT_ORDER } from './orders.js';
import { CHOP_HITS, COOK_SECONDS } from './kitchen.js';

export const W = 1280;
export const H = 720;

export const ZONES = {
  bins: INGREDIENT_ORDER.map((id, i) => ({
    id, x: 40 + i * 206, y: 196, w: 190, h: 120,
  })),
  board: { x: 40, y: 336, w: 320, h: 220 },
  wok: { x: 400, y: 336, w: 320, h: 220 },
  plate: { x: 760, y: 336, w: 240, h: 220 },
  serve: { x: 1040, y: 336, w: 200, h: 220 },
  tickets: [0, 1, 2].map((i) => ({ x: 40 + i * 400, y: 64, w: 360, h: 108 })),
  start: { x: 490, y: 470, w: 300, h: 64 },
  restart: { x: 490, y: 520, w: 300, h: 64 },
  mute: { x: 1212, y: 8, w: 56, h: 40 },
};

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx, str, x, y, size, color, align, weight) {
  ctx.fillStyle = color || '#fff';
  ctx.font = (weight || '700') + ' ' + size + 'px system-ui, sans-serif';
  ctx.textAlign = align || 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

function panel(ctx, x, y, w, h, fill, stroke) {
  rr(ctx, x, y, w, h, 12);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// Small vector icon for each ingredient, drawn at (cx, cy) with radius r.
export function drawIngredientIcon(ctx, id, cx, cy, r) {
  const ing = INGREDIENTS[id];
  ctx.save();
  ctx.translate(cx, cy);
  if (id === 'nasi') {
    ctx.fillStyle = '#b8452e';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.45, r * 0.95, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f5f0dc';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.1, r * 0.8, r * 0.55, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#e8dfc0';
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.arc(i * r * 0.28, -r * 0.25, r * 0.12, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (id === 'telur') {
    ctx.fillStyle = '#fff8e6';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.95, r * 0.75, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd94d';
    ctx.beginPath();
    ctx.arc(r * 0.1, r * 0.05, r * 0.42, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f2b705';
    ctx.beginPath();
    ctx.arc(r * 0.22, -r * 0.08, r * 0.14, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === 'ayam') {
    ctx.fillStyle = '#e8a06a';
    ctx.beginPath();
    ctx.ellipse(-r * 0.15, -r * 0.1, r * 0.7, r * 0.55, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#c47a3e';
    ctx.beginPath();
    ctx.ellipse(-r * 0.15, -r * 0.1, r * 0.45, r * 0.32, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f7ead0';
    ctx.lineWidth = r * 0.18;
    ctx.beginPath();
    ctx.moveTo(r * 0.45, r * 0.35);
    ctx.lineTo(r * 0.85, r * 0.75);
    ctx.stroke();
    ctx.fillStyle = '#f7ead0';
    ctx.beginPath();
    ctx.arc(r * 0.9, r * 0.8, r * 0.16, 0, Math.PI * 2);
    ctx.arc(r * 0.72, r * 0.9, r * 0.14, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === 'mie') {
    ctx.fillStyle = '#b8452e';
    ctx.beginPath();
    ctx.ellipse(0, r * 0.5, r * 0.95, r * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f2c14e';
    ctx.lineWidth = r * 0.16;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const y = -r * 0.35 + i * r * 0.28;
      ctx.moveTo(-r * 0.7, y);
      ctx.bezierCurveTo(-r * 0.3, y - r * 0.25, r * 0.3, y + r * 0.25, r * 0.7, y);
      ctx.stroke();
    }
  } else if (id === 'tahu') {
    ctx.fillStyle = '#e8d5ae';
    rr(ctx, -r * 0.7, -r * 0.55, r * 1.4, r * 1.1, r * 0.15);
    ctx.fill();
    ctx.fillStyle = '#f7ead0';
    rr(ctx, -r * 0.7, -r * 0.55, r * 1.4, r * 0.75, r * 0.15);
    ctx.fill();
    ctx.fillStyle = '#d9c08a';
    ctx.fillRect(-r * 0.7, r * 0.05, r * 1.4, r * 0.08);
  } else if (id === 'cabai') {
    ctx.fillStyle = '#e23b2e';
    ctx.beginPath();
    ctx.moveTo(-r * 0.8, -r * 0.1);
    ctx.quadraticCurveTo(-r * 0.2, -r * 0.9, r * 0.7, -r * 0.5);
    ctx.quadraticCurveTo(r * 0.95, -r * 0.35, r * 0.7, -r * 0.1);
    ctx.quadraticCurveTo(r * 0.1, r * 0.35, -r * 0.8, -r * 0.1);
    ctx.fill();
    ctx.strokeStyle = '#3f7d2c';
    ctx.lineWidth = r * 0.16;
    ctx.beginPath();
    ctx.moveTo(r * 0.7, -r * 0.45);
    ctx.quadraticCurveTo(r * 0.95, -r * 0.8, r * 0.7, -r * 0.95);
    ctx.stroke();
  }
  ctx.restore();
}

// --- Scene pieces ---

function drawBackground(ctx) {
  ctx.fillStyle = '#7a4a28';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#8d5a33';
  for (let y = 0; y < 200; y += 40) {
    for (let x = (y % 80 === 0 ? 0 : -40); x < W; x += 80) {
      ctx.fillRect(x + 1, y + 1, 78, 38);
    }
  }
  ctx.fillStyle = '#5d3a1e';
  ctx.fillRect(0, 560, W, 160);
  ctx.fillStyle = '#6e4525';
  for (let x = 0; x < W; x += 64) ctx.fillRect(x, 560, 2, 160);
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(0, 176, W, 8);
  ctx.fillRect(0, 560, W, 6);
}

function drawHeader(ctx, state, muted) {
  ctx.fillStyle = '#2a1608';
  ctx.fillRect(0, 0, W, 56);
  text(ctx, 'WARUNG RASA', 40, 30, 28, '#ffcf5c', 'left', '800');
  text(ctx, 'masakan warung, dimasak cepat', 300, 32, 13, '#d9b48a', 'left', '400');
  text(ctx, 'Skor ' + state.score, 640, 30, 20, '#fff', 'left');
  text(ctx, 'Koin ' + state.coins, 800, 30, 20, '#ffd94d', 'left');
  text(ctx, 'Combo x' + state.combo, 940, 30, 20, state.combo >= 3 ? '#7dff8a' : '#fff', 'left');
  const t = Math.max(0, Math.ceil(state.timeLeft));
  const mm = Math.floor(t / 60);
  const ss = String(t % 60).padStart(2, '0');
  text(ctx, 'Waktu ' + mm + ':' + ss, 1090, 30, 20, t <= 30 ? '#ff6b5e' : '#fff', 'left');
  text(ctx, muted ? 'Suara: OFF' : 'Suara: ON', 1240, 30, 13, '#fff', 'center', '700');
}

function drawTickets(ctx, state) {
  text(ctx, 'PESANAN', 40, 62, 0, '#fff', 'left');
  for (let i = 0; i < 3; i++) {
    const z = ZONES.tickets[i];
    const order = state.orders[i];
    if (!order) {
      panel(ctx, z.x, z.y, z.w, z.h, 'rgba(42,22,8,0.45)', 'rgba(255,255,255,0.18)');
      text(ctx, '— kosong —', z.x + z.w / 2, z.y + z.h / 2, 16, '#c9a06a');
      continue;
    }
    const urgent = order.patience < 12;
    panel(ctx, z.x, z.y, z.w, z.h, urgent ? '#5e1f16' : '#fff8e6', urgent ? '#ff6b5e' : '#c9a06a');
    text(ctx, order.recipe.name, z.x + 16, z.y + 24, 22, urgent ? '#ffd9d0' : '#3a2410', 'left', '800');
    text(ctx, order.recipe.blurb, z.x + 16, z.y + 48, 13, urgent ? '#ffb3a6' : '#7a5a3a', 'left', '400');
    order.recipe.needs.forEach((id, j) => {
      drawIngredientIcon(ctx, id, z.x + 34 + j * 52, z.y + 84, 16);
    });
    const frac = Math.max(0, order.patience / order.maxPatience);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(z.x + 16, z.y + z.h - 16, z.w - 32, 8);
    ctx.fillStyle = frac > 0.5 ? '#58b368' : frac > 0.25 ? '#f2b705' : '#e23b2e';
    ctx.fillRect(z.x + 16, z.y + z.h - 16, (z.w - 32) * frac, 8);
    text(ctx, Math.ceil(order.patience) + ' dtk', z.x + z.w - 14, z.y + 24, 14, urgent ? '#ffd9d0' : '#7a5a3a', 'right');
  }
}

function drawBins(ctx, state) {
  text(ctx, 'BAHAN — klik atau tekan 1-6', 40, 190, 15, '#ffe9c4', 'left', '700');
  for (const z of ZONES.bins) {
    const ing = INGREDIENTS[z.id];
    const held = state.hand && state.hand.kind.id === z.id;
    panel(ctx, z.x, z.y, z.w, z.h, held ? '#ffe9a8' : '#f3e2c2', held ? '#ff9f1c' : '#b98d5a');
    drawIngredientIcon(ctx, z.id, z.x + z.w / 2, z.y + 46, 30);
    text(ctx, ing.name, z.x + z.w / 2, z.y + 88, 17, '#3a2410', 'center', '800');
    text(ctx, '[' + ing.key + '] ' + ing.desc, z.x + z.w / 2, z.y + 108, 11, '#7a5a3a');
  }
}

function drawBoard(ctx, state) {
  const z = ZONES.board;
  const active = state.flash && state.flash.zone === 'board';
  panel(ctx, z.x, z.y, z.w, z.h, active ? '#ffe9a8' : '#a9804e', '#6e4525');
  text(ctx, 'TALENAN — klik untuk cincang', z.x + z.w / 2, z.y + 24, 15, '#fff3d6', 'center', '700');
  ctx.fillStyle = '#d9b98a';
  rr(ctx, z.x + 40, z.y + 48, z.w - 80, 120, 10);
  ctx.fill();
  ctx.strokeStyle = '#8a6a42';
  ctx.lineWidth = 3;
  ctx.stroke();
  if (state.board) {
    drawIngredientIcon(ctx, state.board.kind.id, z.x + z.w / 2, z.y + 108, 44);
    text(ctx, state.board.kind.name + ' — ' + state.board.hits + '/' + CHOP_HITS + ' cincangan', z.x + z.w / 2, z.y + 190, 15, '#fff3d6');
  } else {
    text(ctx, 'kosong', z.x + z.w / 2, z.y + 108, 16, '#8a6a42');
    text(ctx, 'bawa bahan mentah ke sini', z.x + z.w / 2, z.y + 190, 13, '#fff3d6', 'center', '400');
  }
}

function drawWok(ctx, state) {
  const z = ZONES.wok;
  panel(ctx, z.x, z.y, z.w, z.h, '#3a3f4a', '#20242c');
  text(ctx, 'WAJAN — api besar', z.x + z.w / 2, z.y + 24, 15, '#fff3d6', 'center', '700');
  // Flame.
  const flick = 6 + Math.sin(Date.now() / 90) * 3;
  ctx.fillStyle = '#ff7a1a';
  ctx.beginPath();
  ctx.moveTo(z.x + 70, z.y + 170);
  ctx.quadraticCurveTo(z.x + 110, z.y + 150 - flick, z.x + 160, z.y + 168);
  ctx.quadraticCurveTo(z.x + 210, z.y + 150 - flick, z.x + 250, z.y + 170);
  ctx.quadraticCurveTo(z.x + 160, z.y + 200, z.x + 70, z.y + 170);
  ctx.fill();
  ctx.fillStyle = '#ffd94d';
  ctx.beginPath();
  ctx.ellipse(z.x + 160, z.y + 172, 52, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  // Wok pan.
  ctx.fillStyle = '#22262e';
  ctx.beginPath();
  ctx.ellipse(z.x + 160, z.y + 118, 110, 34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3a3f4a';
  ctx.beginPath();
  ctx.ellipse(z.x + 160, z.y + 112, 110, 30, 0, Math.PI, 0);
  ctx.fill();
  if (state.wok) {
    drawIngredientIcon(ctx, state.wok.kind.id, z.x + 160, z.y + 100, 30);
    const frac = Math.min(1, state.wok.t / COOK_SECONDS);
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(z.x + 40, z.y + 158, z.w - 80, 10);
    ctx.fillStyle = state.wok.done ? '#7dff8a' : '#ff9f1c';
    ctx.fillRect(z.x + 40, z.y + 158, (z.w - 80) * frac, 10);
    text(ctx, state.wok.done ? 'MATANG — klik untuk ambil' : 'Memasak ' + state.wok.kind.name + '...', z.x + z.w / 2, z.y + 196, 14, '#fff');
  } else {
    text(ctx, 'kosong', z.x + z.w / 2, z.y + 100, 16, '#8a93a3');
    text(ctx, 'bawa bahan yang perlu dimasak', z.x + z.w / 2, z.y + 196, 13, '#cfd6e2', 'center', '400');
  }
}

function drawPlate(ctx, state) {
  const z = ZONES.plate;
  panel(ctx, z.x, z.y, z.w, z.h, '#e8e0cc', '#b98d5a');
  text(ctx, 'PIRING — klik untuk isi', z.x + z.w / 2, z.y + 24, 15, '#3a2410', 'center', '700');
  ctx.fillStyle = '#fffdf4';
  ctx.beginPath();
  ctx.ellipse(z.x + z.w / 2, z.y + 118, 92, 58, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#c9b98a';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#f0e8d0';
  ctx.beginPath();
  ctx.ellipse(z.x + z.w / 2, z.y + 118, 66, 40, 0, 0, Math.PI * 2);
  ctx.fill();
  if (state.plate.length === 0) {
    text(ctx, 'kosong', z.x + z.w / 2, z.y + 118, 16, '#a08a62');
  } else {
    state.plate.forEach((id, i) => {
      drawIngredientIcon(ctx, id, z.x + 52 + i * 68, z.y + 118, 24);
    });
  }
  text(ctx, state.plate.length + ' / 3 bahan', z.x + z.w / 2, z.y + 196, 14, '#7a5a3a');
}

function drawServe(ctx, state) {
  const z = ZONES.serve;
  const hot = state.flash && state.flash.zone === 'serve';
  const ready = state.plate.length > 0;
  panel(ctx, z.x, z.y, z.w, z.h, hot ? '#ffe9a8' : ready ? '#2f7d3a' : '#4a7d52', hot ? '#ff9f1c' : '#2c5a33');
  const ink = hot ? '#3a2410' : '#eaffea';
  const inkStrong = hot ? '#3a2410' : '#fff';
  text(ctx, 'JENDELA', z.x + z.w / 2, z.y + 30, 16, ink, 'center', '800');
  text(ctx, 'SAJI', z.x + z.w / 2, z.y + 56, 26, inkStrong, 'center', '800');
  ctx.fillStyle = '#d9c08a';
  rr(ctx, z.x + 30, z.y + 84, z.w - 60, 72, 8);
  ctx.fill();
  ctx.fillStyle = '#fffdf4';
  ctx.beginPath();
  ctx.ellipse(z.x + z.w / 2, z.y + 120, 40, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#c9b98a';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#e23b2e';
  ctx.beginPath();
  ctx.arc(z.x + z.w / 2 - 8, z.y + 118, 7, 0, Math.PI * 2);
  ctx.arc(z.x + z.w / 2 + 10, z.y + 124, 6, 0, Math.PI * 2);
  ctx.fill();
  text(ctx, ready ? 'Klik: sajikan!' : 'Isi piring dulu', z.x + z.w / 2, z.y + 182, 14, ink);
  text(ctx, 'Disajikan: ' + state.served, z.x + z.w / 2, z.y + 204, 13, hot ? '#7a5a3a' : '#cfe8d2', 'center', '400');
}

function drawBottom(ctx, state) {
  ctx.fillStyle = '#2a1608';
  ctx.fillRect(0, 576, W, 144);
  // Hand.
  text(ctx, 'DI TANGAN:', 40, 606, 15, '#ffcf5c', 'left', '800');
  if (state.hand) {
    drawIngredientIcon(ctx, state.hand.kind.id, 120, 650, 30);
    const stage = state.hand.stage === 'raw' ? 'mentah' : state.hand.stage === 'chopped' ? 'dicincang' : 'siap saji';
    text(ctx, state.hand.kind.name + ' (' + stage + ')', 170, 650, 17, '#fff', 'left');
  } else {
    text(ctx, 'kosong', 170, 650, 17, '#8a6a42', 'left');
  }
  // Message.
  if (state.messageT > 0) {
    text(ctx, state.message, 640, 630, 19, '#ffe9c4');
  }
  text(ctx, 'Klik stasiun untuk bekerja  •  1-6 bahan  •  R ulang  •  M suara', 640, 690, 14, '#c9a06a', 'center', '400');
  text(ctx, 'Hari: ' + Math.max(0, Math.ceil(state.timeLeft)) + ' dtk  •  Level ' + state.level + '  •  Combo terbaik x' + state.bestCombo, 1240, 606, 14, '#c9a06a', 'right', '400');
  text(ctx, 'Terbuang: ' + state.wasted + '  •  Pelanggan pergi: ' + state.missed, 1240, 650, 14, '#c9a06a', 'right', '400');
}

function drawTitle(ctx, state) {
  ctx.fillStyle = 'rgba(20,10,4,0.72)';
  ctx.fillRect(0, 0, W, H);
  text(ctx, 'WARUNG RASA', 640, 150, 72, '#ffcf5c', 'center', '800');
  text(ctx, 'Warung kecil, pesanan besar. Masak cepat sebelum pelanggan pergi!', 640, 215, 20, '#ffe9c4', 'center', '400');
  panel(ctx, 340, 260, 600, 150, '#fff8e6', '#c9a06a');
  text(ctx, 'Cara main', 640, 288, 20, '#3a2410', 'center', '800');
  text(ctx, '1. Ambil bahan dari counter (klik / tombol 1-6)', 640, 318, 16, '#3a2410', 'center', '400');
  text(ctx, '2. Cincang di talenan, masak di wajan, susun di piring', 640, 342, 16, '#3a2410', 'center', '400');
  text(ctx, '3. Sajikan lewat jendela saji sebelum waktu habis', 640, 366, 16, '#3a2410', 'center', '400');
  text(ctx, 'Nasi Goreng  •  Mie Ayam  •  Gado-Gado', 640, 394, 16, '#7a3a10', 'center', '700');
  const z = ZONES.start;
  panel(ctx, z.x, z.y, z.w, z.h, '#ff9f1c', '#d97a00');
  text(ctx, 'MULAI MASAK', z.x + z.w / 2, z.y + z.h / 2 + 1, 22, '#2a1608', 'center', '800');
  text(ctx, 'atau tekan Enter', 640, 560, 14, '#c9a06a');
}

function drawGameOver(ctx, state) {
  ctx.fillStyle = 'rgba(20,10,4,0.78)';
  ctx.fillRect(0, 0, W, H);
  text(ctx, 'WARUNG TUTUP', 640, 150, 56, '#ffcf5c', 'center', '800');
  text(ctx, state.overReason, 640, 205, 18, '#ffe9c4');
  panel(ctx, 390, 250, 500, 200, '#fff8e6', '#c9a06a');
  text(ctx, 'Skor akhir: ' + state.score, 640, 290, 26, '#3a2410', 'center', '800');
  text(ctx, 'Koin: ' + state.coins + '   •   Pesanan disajikan: ' + state.served, 640, 330, 18, '#3a2410');
  text(ctx, 'Combo terbaik: x' + state.bestCombo + '   •   Pelanggan pergi: ' + state.missed, 640, 360, 18, '#3a2410');
  text(ctx, 'Terbuang: ' + state.wasted, 640, 390, 18, '#3a2410');
  const z = ZONES.restart;
  panel(ctx, z.x, z.y, z.w, z.h, '#ff9f1c', '#d97a00');
  text(ctx, 'MASAK LAGI', z.x + z.w / 2, z.y + z.h / 2 + 1, 22, '#2a1608', 'center', '800');
  text(ctx, 'atau tekan R', 640, 610, 14, '#c9a06a');
}

export function render(ctx, state, muted) {
  drawBackground(ctx);
  drawHeader(ctx, state, muted);
  drawTickets(ctx, state);
  drawBins(ctx, state);
  drawBoard(ctx, state);
  drawWok(ctx, state);
  drawPlate(ctx, state);
  drawServe(ctx, state);
  drawBottom(ctx, state);
  if (state.screen === 'title') drawTitle(ctx, state);
  if (state.screen === 'over') drawGameOver(ctx, state);
  // Hover highlight.
  if (state.hover && state.screen === 'play') {
    const z = state.hover;
    rr(ctx, z.x, z.y, z.w, z.h, 12);
    ctx.strokeStyle = 'rgba(255,207,92,0.85)';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}
