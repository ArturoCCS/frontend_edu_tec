<template>
  <div class="radar-wrapper">
    <div class="header">
      <v-icon class="mr-2">mdi-radar</v-icon>
      <span class="title">Perfil Final del Estudiante</span>
      <v-spacer />
      <v-btn size="x-small" variant="outlined" color="primary" @click="toggleMode">
        {{ compareMode ? 'Solo Estudiante' : 'Comparar Grupo' }}
      </v-btn>
    </div>

    <div class="svg-container">
      <svg :width="size" :height="size" class="radar-svg" :viewBox="`0 0 ${size} ${size}`">
        <g v-for="i in steps" :key="'grid-'+i">
          <circle :cx="center" :cy="center" :r="(radius/steps)*i" stroke="#CBD5E1" stroke-width="1" fill="none" />
        </g>

        <g v-for="(axis, idx) in axes" :key="'axis-'+axis.key">
          <line :x1="center" :y1="center" :x2="polarX(idx, 1)" :y2="polarY(idx, 1)" stroke="#E2E8F0" stroke-width="1" />
          <text :x="polarX(idx, 1.08)" :y="polarY(idx, 1.08)" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">
            {{ axis.label }}
          </text>
        </g>

        <polygon v-if="compareMode" :points="medianPoints" fill="rgba(245, 158, 11, 0.30)" stroke="#F59E0B" stroke-width="2" />
        <polygon :points="studentPoints" fill="rgba(37, 99, 235, 0.35)" stroke="#2563EB" stroke-width="2" />

        <g v-for="(axis, idx) in axes" :key="'pts-'+axis.key">
          <circle
            :cx="studentCoords[idx].x" :cy="studentCoords[idx].y" r="5"
            class="point student-point" role="button" tabindex="0"
            :aria-label="`Eje ${axis.label}, Estudiante ${(finalEstado[axis.key]||0)*100}%`"
            @mouseenter="showTooltip(studentCoords[idx].x, studentCoords[idx].y, axis.label, (finalEstado[axis.key]||0))"
            @focus="showTooltip(studentCoords[idx].x, studentCoords[idx].y, axis.label, (finalEstado[axis.key]||0))"
            @mouseleave="hideTooltip" @blur="hideTooltip"
          />
          <circle
            v-if="compareMode"
            :cx="medianCoords[idx].x" :cy="medianCoords[idx].y" r="5"
            class="point median-point" role="button" tabindex="0"
            :aria-label="`Eje ${axis.label}, Mediana ${(medianValues[axis.key]||0)*100}%`"
            @mouseenter="showTooltip(medianCoords[idx].x, medianCoords[idx].y, axis.label + ' (Mediana)', (medianValues[axis.key]||0))"
            @focus="showTooltip(medianCoords[idx].x, medianCoords[idx].y, axis.label + ' (Mediana)', (medianValues[axis.key]||0))"
            @mouseleave="hideTooltip" @blur="hideTooltip"
          />
        </g>
      </svg>

      <div v-if="tooltip.visible" class="tooltip" :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }">
        <div class="tt-label">{{ tooltip.label }}</div>
        <div class="tt-value">{{ (tooltip.value * 100).toFixed(1) }}%</div>
      </div>
    </div>

    <div class="legend mt-2 d-flex align-center ga-4">
      <div class="legend-item"><span class="color-box student"></span> Estudiante</div>
      <div class="legend-item" v-if="compareMode"><span class="color-box median"></span> Mediana Grupo</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  finalEstado: { type: Object, required: true },
  classMedian: { type: Object, default: () => null }
});

const axes = [
  { key: 'AFE', label: 'Afectivo' },
  { key: 'CON', label: 'Concentración' },
  { key: 'AC', label: 'Activación' },
  { key: 'EX', label: 'Exposición' },
  { key: 'SS', label: 'Soporte' },
  { key: 'AX', label: 'Ansiedad' },
  { key: 'AM', label: 'Auto Manejo' }
];

const compareMode = ref(true);
const toggleMode = () => (compareMode.value = !compareMode.value);

const size = 440;
const center = size / 2;
const radius = 160;
const steps = 5;

const angleFor = idx => (2 * Math.PI * idx) / axes.length - Math.PI / 2;
const polarX = (idx, norm) => center + Math.cos(angleFor(idx)) * radius * norm;
const polarY = (idx, norm) => center + Math.sin(angleFor(idx)) * radius * norm;

const medianValues = computed(() => {
  if (props.classMedian) return props.classMedian;
  const out = {};
  axes.forEach(a => {
    const v = props.finalEstado[a.key] ?? 0.5;
    out[a.key] = Math.min(0.8, Math.max(0.35, v * 0.85 + 0.15));
  });
  return out;
});

const studentCoords = computed(() =>
  axes.map((a, idx) => {
    const val = props.finalEstado[a.key] ?? 0;
    return { x: polarX(idx, val), y: polarY(idx, val), raw: val };
  })
);
const medianCoords = computed(() =>
  axes.map((a, idx) => {
    const val = medianValues.value[a.key] ?? 0;
    return { x: polarX(idx, val), y: polarY(idx, val), raw: val };
  })
);

const studentPoints = computed(() => studentCoords.value.map(c => `${c.x},${c.y}`).join(' '));
const medianPoints = computed(() => medianCoords.value.map(c => `${c.x},${c.y}`).join(' '));

const tooltip = ref({ visible: false, x: 0, y: 0, label: '', value: 0 });
const showTooltip = (x, y, label, value) => {
  tooltip.value.visible = true;
  tooltip.value.x = x + 8;
  tooltip.value.y = y + 8;
  tooltip.value.label = label;
  tooltip.value.value = value;
};
const hideTooltip = () => { tooltip.value.visible = false; };
</script>

<style scoped>
.radar-wrapper { position: relative; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; }
.header { display: flex; align-items: center; margin-bottom: 8px; }
.title { font-weight: 700; font-size: 16px; color: #0F172A; }
.svg-container { position: relative; flex: 1; min-height: 340px; display: flex; justify-content: center; align-items: center; }
.radar-svg { width: 100%; height: 100%; max-width: 440px; max-height: 440px; }
.point { cursor: pointer; transition: transform .25s ease; }
.point.student-point { fill: #1D4ED8; stroke: #FFFFFF; stroke-width: 2; }
.point.median-point { fill: #D97706; stroke: #FFFFFF; stroke-width: 2; }
.point:hover { transform: scale(1.25); }
.tooltip { position: absolute; background: #FFFFFF; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(0,0,0,0.08); padding: 6px 10px; border-radius: 8px; font-size: 12px; min-width: 110px; z-index: 10; pointer-events: none; animation: fadeIn .25s ease; }
.tt-label { font-weight: 600; color: #334155; }
.tt-value { font-size: 11px; color: #475569; margin-top: 2px; }
.legend { font-size: 12px; color: #475569; display: flex; gap: 16px; flex-wrap: wrap; margin-top: 12px; }
.legend-item { display: flex; align-items: center; gap: 6px; }
.color-box { width: 14px; height: 14px; border-radius: 3px; display: inline-block; }
.color-box.student { background: #2563EB; }
.color-box.median { background: #F59E0B; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
</style>