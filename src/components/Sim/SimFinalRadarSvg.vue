<template>
  <div class="radar-wrapper">
    <div class="header">
      <v-icon class="mr-2">mdi-radar</v-icon>
      <span class="title">Perfil Final del Estudiante (SVG)</span>
      <v-spacer />
      <v-btn size="x-small" variant="outlined" color="primary" @click="compareMode = !compareMode">
        {{ compareMode ? 'Solo Estudiante' : 'Comparar Grupo' }}
      </v-btn>
    </div>

    <svg :width="size" :height="size" class="radar">
      <g v-for="i in steps" :key="'grid-'+i">
        <circle
          :cx="center"
          :cy="center"
          :r="(radius/steps)*i"
          stroke="#CBD5E1"
          stroke-width="1"
          fill="none"
        />
      </g>

      <g v-for="(axis, idx) in axes" :key="axis.key">
        <line
          :x1="center" :y1="center"
          :x2="polarX(idx, 1)" :y2="polarY(idx, 1)"
          stroke="#E2E8F0"
          stroke-width="1"
        />
        <text
          :x="polarX(idx, 1.07)"
          :y="polarY(idx, 1.07)"
          text-anchor="middle"
          font-size="11"
          font-weight="600"
          fill="#334155"
        >
          {{ axis.label }}
        </text>
      </g>

      <polygon
        v-if="compareMode"
        :points="medianPoints"
        fill="rgba(245, 158, 11, 0.30)"
        stroke="#F59E0B"
        stroke-width="2"
      />

      <polygon
        :points="studentPoints"
        fill="rgba(37, 99, 235, 0.35)"
        stroke="#2563EB"
        stroke-width="2"
      />

      <g v-for="(axis, idx) in axes" :key="'pt-'+axis.key">
        <circle
          :cx="studentCoords[idx].x"
          :cy="studentCoords[idx].y"
          r="4"
          fill="#1D4ED8"
          stroke="#FFFFFF"
          stroke-width="2"
        />
        <circle
          v-if="compareMode"
          :cx="medianCoords[idx].x"
          :cy="medianCoords[idx].y"
          r="4"
          fill="#D97706"
          stroke="#FFFFFF"
          stroke-width="2"
        />
      </g>
    </svg>

    <div class="legend mt-2 d-flex align-center ga-4">
      <div class="legend-item">
        <span class="color-box student"></span> Estudiante
      </div>
      <div class="legend-item" v-if="compareMode">
        <span class="color-box median"></span> Mediana Grupo
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  finalEstado: { type: Object, required: true },
  classMedian: { type: Object, default: () => null }
});

const compareMode = ref(true);

const axes = [
  { key: 'AFE', label: 'Afectivo' },
  { key: 'CON', label: 'Concentración' },
  { key: 'AC', label: 'Activación' },
  { key: 'EX', label: 'Exposición' },
  { key: 'SS', label: 'Soporte Social' },
  { key: 'AX', label: 'Ansiedad' },
  { key: 'AM', label: 'Auto Manejo' },
  { key: 'estres', label: 'Estrés' }
];

const size = 480;
const center = size / 2;
const radius = 170;
const steps = 5;

const angleFor = idx => (2 * Math.PI * idx) / axes.length - Math.PI / 2;
const polarX = (idx, norm) => center + Math.cos(angleFor(idx)) * radius * norm;
const polarY = (idx, norm) => center + Math.sin(angleFor(idx)) * radius * norm;

const studentCoords = computed(() =>
  axes.map((a, idx) => {
    const val = props.finalEstado[a.key] ?? 0;
    return { x: polarX(idx, val), y: polarY(idx, val) };
  })
);
const studentPoints = computed(() =>
  studentCoords.value.map(c => `${c.x},${c.y}`).join(' ')
);

const generateMedian = () => {
  if (props.classMedian) return props.classMedian;
  const obj = {};
  axes.forEach(a => {
    const v = props.finalEstado[a.key] ?? 0.5;
    obj[a.key] = Math.min(0.8, Math.max(0.35, v * 0.9 + 0.1));
  });
  return obj;
};

const medianCoords = computed(() => {
  const med = generateMedian();
  return axes.map((a, idx) => {
    const val = med[a.key] ?? 0;
    return { x: polarX(idx, val), y: polarY(idx, val) };
  });
});
const medianPoints = computed(() =>
  medianCoords.value.map(c => `${c.x},${c.y}`).join(' ')
);
</script>

<style scoped>
.radar-wrapper {
  position: relative;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}
.header { display: flex; align-items: center; margin-bottom: 8px; }
.title { font-weight: 700; font-size: 16px; color: #0F172A; }
.radar { width: 100%; height: auto; }
.legend { font-size: 12px; color: #475569; }
.legend-item { display: flex; align-items: center; gap: 6px; }
.color-box { width: 14px; height: 14px; border-radius: 3px; display: inline-block; }
.color-box.student { background: #2563EB; }
.color-box.median { background: #F59E0B; }
</style>