// Lightweight, dependency-free UI sound effects generated with the Web Audio API.
// No external audio files needed — keeps the site fast and lightweight.

let audioCtx: AudioContext | null = null;

const getCtx = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new AC();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
};

const playTone = (freq: number, duration: number, delay = 0, type: OscillatorType = 'sine', volume = 0.08) => {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(ctx.destination);

  const startAt = ctx.currentTime + delay;
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(volume, startAt + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  osc.start(startAt);
  osc.stop(startAt + duration + 0.02);
};

// Soft, pleasant two-note "success" chime (used for deposits, orders, posts)
export const playSuccessSound = () => {
  playTone(660, 0.12, 0, 'sine', 0.07);
  playTone(880, 0.16, 0.08, 'sine', 0.07);
};

// Quick, subtle "message received" blip
export const playMessageSound = () => {
  playTone(520, 0.09, 0, 'triangle', 0.06);
};

// Soft low tone for errors/rejections — not harsh, just a gentle cue
export const playErrorSound = () => {
  playTone(220, 0.18, 0, 'sine', 0.06);
};
