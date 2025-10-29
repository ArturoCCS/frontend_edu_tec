import { useSoundStore } from '@/stores/soundStore';

function findScrollable(el) {
  const nodes = el.querySelectorAll('*');
  for (const n of nodes) {
    const style = window.getComputedStyle(n);
    const overX = style.overflowX;
    const scrollable = (overX === 'auto' || overX === 'scroll' || overX === 'overlay');
    if (scrollable && n.scrollWidth > n.clientWidth + 2) return n;
  }
  if (el.scrollWidth > el.clientWidth + 2) return el;
  return null;
}

export const sfx = {
  mounted(el, binding) {
    const arg = binding.arg || 'tick';
    const mods = binding.modifiers || {};
    const store = useSoundStore();
    store.ensureAudio?.();

    if (mods.sequence || mods.burst) {
      const cfg = binding.value || {};
      const options = {
        sound: cfg.sound || arg,
        items: cfg.items ?? 10,
        groups: cfg.groups,
        groupMin: cfg.groupMin ?? 1,
        groupMax: cfg.groupMax ?? 3,
        totalMs: cfg.totalMs ?? 360,
        startDelayMs: cfg.startDelayMs ?? 70,
        jitterMs: cfg.jitterMs ?? 24,
        rateFrom: cfg.rateFrom ?? 1.00,
        rateTo: cfg.rateTo ?? 1.14,
        volumeFrom: cfg.volumeFrom ?? 0.62,
        volumeTo: cfg.volumeTo ?? 0.88
      };

      let triggered = false;
      const onIntersect = async (entries, obs) => {
        if (triggered) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            await store.tryResume?.();
            store.playPlacementWave(options);
            triggered = true;
            obs.disconnect();
            break;
          }
        }
      };

      const observer = new IntersectionObserver(onIntersect, {
        root: null,
        threshold: 0.12,
        rootMargin: '120px'
      });
      el._sfxObserver = observer;
      observer.observe(el);
      return;
    }

    if (mods.scroll) {
      const cfg = binding.value || {};
      const target =
        (cfg.target && el.querySelector?.(cfg.target)) ||
        findScrollable(el) ||
        el;

      const unlock = async () => { await store.tryResume?.(); };
      target.addEventListener('pointerdown', unlock, { once: true, passive: true, capture: true });
      target.addEventListener('wheel', unlock, { once: true, passive: true, capture: true });
      target.addEventListener('touchstart', unlock, { once: true, passive: true, capture: true });

      const stepPx = Number(cfg.stepPx ?? 160);
      const minGapMs = Number(cfg.minGapMs ?? 70);
      const speedWindowFactor = Number(cfg.speedWindowFactor ?? 1.8);
      const maxTicksPerEvent = Number(cfg.maxTicksPerEvent ?? 2);

      let lastX = target.scrollLeft ?? 0;
      let acc = 0;
      let lastPlay = 0;
      let lastTime = performance.now();

      const onScroll = () => {
        const now = performance.now();
        const x = target.scrollLeft ?? 0;
        const dx = x - lastX;
        lastX = x;

        const adx = Math.abs(dx);
        if (adx < 0.5) return;

        acc += adx;

        const dt = Math.max(1, now - lastTime);
        const instSpeed = adx / dt;
        lastTime = now;

        let ticks = Math.floor(acc / stepPx);
        if (ticks <= 0) return;
        ticks = Math.min(ticks, maxTicksPerEvent);

        if (now - lastPlay < minGapMs) return;

        for (let i = 0; i < ticks; i++) {
          const delay = i * 24;
          setTimeout(() => {
            const mappedSpeed = Math.max(0.3, Math.min(1.8, instSpeed * (100 * speedWindowFactor)));
            if (typeof store.playNavTick === 'function') {
              store.playNavTick({ speed: mappedSpeed });
            } else if (store.SFX?.[arg]) {
              store.SFX[arg]();
            }
          }, delay);
        }

        acc -= ticks * stepPx;
        lastPlay = now;
      };

      el._sfxScrollTarget = target;
      el._sfxScrollHandler = onScroll;
      target.addEventListener('scroll', onScroll, { passive: true });

      return;
    }

    const type = mods.hover ? 'mouseenter' : 'click';
    const handler = async () => {
      await store.tryResume?.();
      if (store?.SFX && typeof store.SFX[arg] === 'function') {
        store.SFX[arg]();
      }
    };
    el._sfxHandler = handler;
    el.addEventListener(type, handler);
  },

  unmounted(el, binding) {
    const mods = binding.modifiers || {};
    if (mods.sequence || mods.burst) {
      if (el._sfxObserver) {
        el._sfxObserver.disconnect();
        delete el._sfxObserver;
      }
      return;
    }
    if (mods.scroll) {
      const target = el._sfxScrollTarget || el;
      if (el._sfxScrollHandler) {
        target.removeEventListener('scroll', el._sfxScrollHandler);
        delete el._sfxScrollHandler;
      }
      delete el._sfxScrollTarget;
      return;
    }

    const type = mods.hover ? 'mouseenter' : 'click';
    if (el._sfxHandler) {
      el.removeEventListener(type, el._sfxHandler);
      delete el._sfxHandler;
    }
  }
};