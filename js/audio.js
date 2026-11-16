// audio.js — процедурный эмбиент и маленькие звуки интерфейса.
const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12);

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.started = false;
    try { this.muted = localStorage.getItem('fennek_muted') === '1'; }
    catch { this.muted = false; }
    this.timer = null;
    this.pad = [];
    this.sceneMood = 'calm';
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.7;
    this.master.connect(this.ctx.destination);
    this.startPad();
    this.scheduleChime();
  }

  startPad() {
    const ctx = this.ctx;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 680;
    filter.Q.value = 0.8;
    const padGain = ctx.createGain();
    padGain.gain.value = 0.05;
    filter.connect(padGain);
    padGain.connect(this.master);
    const chord = [50, 57, 64, 66]; // D, A, E, F# — тёплый, чуть тревожный аккорд
    for (const n of chord) {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = NOTE(n);
      o.detune.value = (Math.random() - 0.5) * 8;
      const g = ctx.createGain();
      g.gain.value = 0.24;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.03 + Math.random() * 0.05;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.11;
      lfo.connect(lfoGain);
      lfoGain.connect(g.gain);
      o.connect(g);
      g.connect(filter);
      o.start();
      lfo.start();
      this.pad.push({ o, lfo, g });
    }
    const lfoFilter = ctx.createOscillator();
    lfoFilter.frequency.value = 0.025;
    const lfoFilterGain = ctx.createGain();
    lfoFilterGain.gain.value = 220;
    lfoFilter.connect(lfoFilterGain);
    lfoFilterGain.connect(filter.frequency);
    lfoFilter.start();
    this.filter = filter;
    this.started = true;
  }

  scheduleChime() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (!this.muted) {
        const scale = [62, 64, 66, 69, 71, 74, 76];
        this.tone(scale[Math.floor(Math.random() * scale.length)] + 12, 0.10, {
          type: 'sine', attack: 0.8, release: 2.4, gain: 0.035,
        });
      }
      this.scheduleChime();
    }, 11000 + Math.random() * 14000);
  }

  tone(midi, duration = 0.15, { type = 'sine', attack = 0.005, release = null, gain = 0.08, when = 0 } = {}) {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx;
    const t0 = ctx.currentTime + when;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(NOTE(midi), t0);
    const rel = release ?? Math.min(0.5, duration * 0.8);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
    g.gain.setValueAtTime(gain, t0 + Math.max(attack + 0.01, duration - rel));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    o.connect(g);
    g.connect(this.master);
    o.start(t0);
    o.stop(t0 + duration + 0.05);
  }

  chord(notes, spacing = 0.06, duration = 0.5, gain = 0.05) {
    notes.forEach((n, i) => this.tone(n, duration, { when: i * spacing, gain, type: 'triangle', attack: 0.01 }));
  }

  click() {
    this.tone(74, 0.07, { type: 'triangle', gain: 0.035 });
  }

  select() {
    this.tone(69, 0.12, { type: 'triangle', gain: 0.045 });
    this.tone(76, 0.18, { type: 'sine', gain: 0.04, when: 0.08 });
  }

  advance() {
    this.tone(72, 0.045, { type: 'sine', gain: 0.018 });
  }

  stat() {
    [69, 72, 76, 81].forEach((n, i) => this.tone(n + 12, 0.22, { type: 'sine', gain: 0.03, when: i * 0.055 }));
  }

  chapter() {
    [50, 57, 62, 69].forEach((n, i) => this.tone(n, 1.8, { type: 'sine', gain: 0.045, when: i * 0.12, attack: 0.05, release: 0.9 }));
  }

  memory() {
    this.tone(64, 0.6, { type: 'sine', gain: 0.035, attack: 0.1 });
    this.tone(71, 0.8, { type: 'sine', gain: 0.025, attack: 0.15, when: 0.12 });
  }

  ending(mood = 'warm') {
    const chords = {
      warm: [50, 57, 62, 66, 69],
      amber: [48, 55, 60, 64, 67],
      cool: [45, 52, 57, 60, 64],
      cold: [43, 50, 55, 58, 62],
    };
    const notes = chords[mood] || chords.warm;
    notes.forEach((n, i) => this.tone(n + 12, 2.6, {
      type: 'sine', gain: 0.045, when: i * 0.22, attack: 0.25, release: 1.8,
    }));
  }

  toggleMute() {
    this.muted = !this.muted;
    try { localStorage.setItem('fennek_muted', this.muted ? '1' : '0'); } catch { /* noop */ }
    if (this.master && this.ctx) {
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.setTargetAtTime(this.muted ? 0 : 0.7, this.ctx.currentTime, 0.08);
    }
    return this.muted;
  }

  setMood(mood) {
    if (!this.filter || !this.ctx) return;
    this.sceneMood = mood;
    const freq = { calm: 680, night: 540, bright: 900, tense: 460, warm: 760 }[mood] ?? 680;
    this.filter.frequency.setTargetAtTime(freq, this.ctx.currentTime, 1.5);
  }
}

// Classic-script build.
window.AudioEngine = AudioEngine;
