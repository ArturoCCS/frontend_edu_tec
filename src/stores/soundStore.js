import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';

let audioCtx = null;
let masterGain = null;

function createContextIfNeeded() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)({
        latencyHint: 'interactive'
      });
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.5;
      masterGain.connect(audioCtx.destination);
    } catch (e) {
      console.error('Web Audio API no es soportada en este navegador.', e);
    }
  }
}

export const useSoundStore = defineStore('sound', () => {

  const soundOn = ref(true);
  const buffers = reactive({});
  const isLoading = ref(true);

  const isRunning = computed(() => !!audioCtx && audioCtx.state === 'running');

  const pendingWaves = reactive([]);
  const soundFiles = {
    focus: 'nav.mp3',
    nav: 'nav.mp3',
    confirm: 'nav.mp3',
    back: 'nav.mp3',
    appear: 'nav.mp3',
    tick: 'tick.mp3',
    chord: 'nav.mp3'
  };

  async function loadSounds() {
    createContextIfNeeded();
    if (!audioCtx) {
      isLoading.value = false;
      return;
    }
    await Promise.all(
      Object.entries(soundFiles).map(async ([name, fileName]) => {
        try {
          const response = await fetch(`/sounds/${fileName}`);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
          buffers[name] = audioBuffer;
        } catch (error) {
          console.error(`Error al cargar el sonido ${fileName}:`, error);
        }
      })
    );
    isLoading.value = false;
  }

  function resumeOnFirstInteraction() {
    const resume = async () => {
      try {
        createContextIfNeeded();
        await audioCtx?.resume?.();
      } catch {}
      ['pointerdown', 'wheel', 'keydown', 'touchstart', 'click'].forEach(ev =>
        window.removeEventListener(ev, resume, { capture: true })
      );

      if (isRunning.value && pendingWaves.length) {
        const batch = pendingWaves.splice(0, pendingWaves.length);
        batch.forEach((w, i) => setTimeout(() => playPlacementWave(w.options), i * 70));
      }
    };
    ['pointerdown', 'wheel', 'keydown', 'touchstart', 'click'].forEach(ev =>
      window.addEventListener(ev, resume, { once: true, passive: true, capture: true })
    );
  }

  async function tryResume() {
    createContextIfNeeded();
    try { await audioCtx?.resume?.(); } catch {}
  }

  function playSound(name, { volume = 1, playbackRate = 1 } = {}) {
    if (!soundOn.value || !buffers[name] || !audioCtx || !masterGain) return;
    if (audioCtx.state !== 'running') return;

    const source = audioCtx.createBufferSource();
    source.buffer = buffers[name];
    source.playbackRate.value = playbackRate;

    const localGain = audioCtx.createGain();
    localGain.gain.value = volume;

    source.connect(localGain);
    localGain.connect(masterGain);

    source.start(0);
  }

  function playNavTick({ speed = 1 } = {}) {
    const s = Math.max(0.2, Math.min(2.0, speed));
    const rate = 0.97 + (s - 0.2) / (2.0 - 0.2) * 0.14;
    const vol = 0.55 + (s - 0.2) / (2.0 - 0.2) * 0.35;
    playSound('tick', { volume: vol, playbackRate: rate });
  }

  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
  function buildAcceleratedTimes(ticks, totalMs, accelK = 1.35) {
    if (ticks <= 0) return [];
    const weights = Array.from({ length: ticks }, (_, i) => Math.pow(ticks - i, accelK));
    const sumW = weights.reduce((a, b) => a + b, 0);
    const times = [];
    let acc = 0;
    for (let i = 0; i < ticks; i++) {
      acc += weights[i];
      times.push((acc / sumW) * totalMs);
    }
    return times;
  }

  function playPlacementWave({
    sound = 'appear',
    items = 12,
    groups,
    groupMin = 1,
    groupMax = 3,
    totalMs = 360,
    startDelayMs = 70,
    jitterMs = 24,
    rateFrom = 1.00,
    rateTo = 1.14,
    volumeFrom = 0.62,
    volumeTo = 0.88
  } = {}) {
    createContextIfNeeded();
    if (!soundOn.value) return;

    if (!isRunning.value) {
      pendingWaves.push({
        options: { sound, items, groups, groupMin, groupMax, totalMs, startDelayMs, jitterMs, rateFrom, rateTo, volumeFrom, volumeTo },
        ts: Date.now()
      });
      return;
    }

    const estimated = clamp(Math.ceil(items / 4), 4, 7);
    const ticks = clamp(groups ?? estimated, 3, 8);
    const baseTimes = buildAcceleratedTimes(ticks, totalMs, 1.35);
    const scheduleMs = baseTimes.map(t => startDelayMs + t + (Math.random() * 2 - 1) * jitterMs);

    scheduleMs.forEach((delay, i) => {
      const p = ticks > 1 ? i / (ticks - 1) : 1;
      const rate = rateFrom + (rateTo - rateFrom) * p + (Math.random() * 0.02 - 0.01);
      const vol = volumeFrom + (volumeTo - volumeFrom) * p;
      setTimeout(() => {
        if (!isRunning.value) return;
        playSound(sound, { playbackRate: rate, volume: vol });
      }, Math.max(0, Math.round(delay)));
    });
  }

  const SFX = {
    focus: () => playSound('focus'),
    nav: () => playSound('nav'),
    confirm: () => playSound('confirm'),
    back: () => playSound('back'),
    appear: () => playSound('appear'),
    tick: () => playSound('tick')
  };

  function chord() { playSound('chord'); }
  function toggleSound() {
    soundOn.value = !soundOn.value;
    if (soundOn.value && isRunning.value) playSound('nav');
  }

  return {
    soundOn, isLoading,
    ensureAudio: createContextIfNeeded,
    loadSounds,
    resumeOnFirstInteraction,
    tryResume,
    playSound, playNavTick, playPlacementWave, SFX, chord, toggleSound,
    isRunning
  };
});