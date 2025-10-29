export function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
export function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

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

export function makePlacementPlan({
  itemsCount,
  groups,
  groupMin = 1,
  groupMax = 3,
  totalMs = 360,
  startDelayMs = 70,
  jitterMs = 24,
  accelK = 1.35
} = {}) {
  const estimated = clamp(Math.ceil((itemsCount || 10) / 4), 4, 7);
  const ticks = clamp(groups ?? estimated, 3, 8);

  const baseTimes = buildAcceleratedTimes(ticks, totalMs, accelK);
  const scheduleMs = baseTimes.map(t => startDelayMs + t + (Math.random() * 2 - 1) * jitterMs);

  const groupSizes = Array.from({ length: ticks }, () => randInt(groupMin, groupMax));

  return { scheduleMs, groupSizes, ticks };
}