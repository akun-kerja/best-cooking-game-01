// Warung Rasa — all sounds are synthesised with WebAudio. No audio files,
// no network, nothing but oscillators and filtered noise.

let ctx = null;
let muted = false;
let sizzleNodes = null;

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  if (muted) stopSizzle();
  return muted;
}

function audio() {
  if (muted) return null;
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch (err) {
    return null;
  }
}

// Call from a user gesture so the browser unlocks sound on first click.
export function primeAudio() {
  audio();
}

function tone(freq, dur, type, vol, when, slideTo) {
  const ac = audio();
  if (!ac) return;
  const t0 = ac.currentTime + (when || 0);
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type || 'sine';
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol || 0.12, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function noiseBurst(dur, vol, filterFreq) {
  const ac = audio();
  if (!ac) return;
  const len = Math.floor(ac.sampleRate * dur);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ac.createBufferSource();
  src.buffer = buf;
  const filt = ac.createBiquadFilter();
  filt.type = 'bandpass';
  filt.frequency.value = filterFreq || 1800;
  filt.Q.value = 0.8;
  const gain = ac.createGain();
  gain.gain.value = vol || 0.2;
  src.connect(filt).connect(gain).connect(ac.destination);
  src.start();
}

export function clickSound() {
  tone(660, 0.06, 'triangle', 0.08);
}

export function popSound() {
  tone(420, 0.09, 'sine', 0.12, 0, 760);
}

export function chopSound() {
  noiseBurst(0.09, 0.28, 2400);
  tone(180, 0.07, 'square', 0.06);
}

export function dingSound() {
  tone(880, 0.16, 'sine', 0.14);
  tone(1318, 0.24, 'sine', 0.12, 0.09);
}

export function buzzSound() {
  tone(140, 0.28, 'sawtooth', 0.12, 0, 90);
}

export function serveSound() {
  tone(523, 0.12, 'triangle', 0.14);
  tone(659, 0.12, 'triangle', 0.14, 0.08);
  tone(784, 0.22, 'triangle', 0.14, 0.16);
}

export function fanfareSound() {
  [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, 'triangle', 0.14, i * 0.12));
}

export function startSizzle() {
  const ac = audio();
  if (!ac || sizzleNodes) return;
  const len = ac.sampleRate;
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const filt = ac.createBiquadFilter();
  filt.type = 'highpass';
  filt.frequency.value = 3200;
  const gain = ac.createGain();
  gain.gain.value = 0.045;
  src.connect(filt).connect(gain).connect(ac.destination);
  src.start();
  sizzleNodes = { src, gain };
}

export function stopSizzle() {
  if (!sizzleNodes) return;
  try {
    sizzleNodes.src.stop();
  } catch (err) {
    /* already stopped */
  }
  sizzleNodes = null;
}
