<template>
  <div class="radar-wrapper">
    <div class="radar-header">
      <v-icon class="mr-2">mdi-radar</v-icon>
      <span class="title">Perfil Final</span>
      <v-spacer />
      <v-chip size="x-small" variant="outlined" color="primary">Solo</v-chip>
    </div>

    <div class="svg-container" v-if="!noData">
      <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="radar-svg">
        <g v-for="i in steps" :key="'grid-'+i">
          <circle :cx="center" :cy="center" :r="(radius/steps)*i" stroke="#CBD5E1" stroke-width="1" fill="none"/>
        </g>
        <g v-for="(axis, idx) in axes" :key="axis.key">
          <line :x1="center" :y1="center" :x2="polarX(idx, 1)" :y2="polarY(idx, 1)" stroke="#E2E8F0" stroke-width="1"/>
          <text :x="polarX(idx, 1.09)" :y="polarY(idx, 1.09)" text-anchor="middle" font-size="10" font-weight="600" fill="#334155">
            {{ axis.label }}
          </text>
        </g>
        <polygon :points="studentPoints" fill="rgba(37,99,235,0.35)" stroke="#2563EB" stroke-width="2"/>
        <g v-for="(axis, idx) in axes" :key="'pts-'+axis.key">
          <circle
            :cx="studentCoords[idx].x" :cy="studentCoords[idx].y" r="4"
            class="point student"
            @mouseenter="showTooltip(studentCoords[idx].x, studentCoords[idx].y, axis.label, safeFinalEstado[axis.key])"
            @mouseleave="hideTooltip"
          />
        </g>
      </svg>
      <div v-if="tooltip.visible" class="tooltip" :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }">
        <div class="tt-label">{{ tooltip.label }}</div>
        <div class="tt-value">{{ (tooltip.value*100).toFixed(1) }}%</div>
      </div>
    </div>

    <div class="no-data" v-else>
      <v-icon class="mr-2" color="grey">mdi-information-outline</v-icon>
      <span>No hay datos para mostrar el perfil final.</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  finalEstado: { type: Object, default: () => null }
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

const size = 300;
const center = size / 2;
const radius = 110;
const steps = 5;
function angleFor(idx) { return (2*Math.PI*idx)/axes.length - Math.PI/2; }
function polarX(idx, norm) { return center + Math.cos(angleFor(idx))*radius*norm; }
function polarY(idx, norm) { return center + Math.sin(angleFor(idx))*radius*norm; }

const safeFinalEstado = computed(() => props.finalEstado || {});
const noData = computed(() => !props.finalEstado || Object.keys(props.finalEstado || {}).length === 0);

const studentCoords = computed(() =>
  axes.map((a, idx) => {
    const val = clamp01(safeFinalEstado.value[a.key] ?? 0);
    return { x: polarX(idx, val), y: polarY(idx, val) };
  })
);
const studentPoints = computed(() => studentCoords.value.map(p => `${p.x},${p.y}`).join(' '));

const tooltip = ref({ visible:false, x:0, y:0, label:'', value:0 });
function showTooltip(x,y,label,value) {
  tooltip.value.visible = true;
  tooltip.value.x = x + 10;
  tooltip.value.y = y + 10;
  tooltip.value.label = label;
  tooltip.value.value = clamp01(value ?? 0);
}
function hideTooltip() { tooltip.value.visible = false; }
function clamp01(v) { const n = Number(v); if (isNaN(n)) return 0; return Math.min(1, Math.max(0, n)); }
</script>

<style scoped>
.radar-wrapper { display:flex; flex-direction:column; gap:8px; }
.radar-header { display:flex; align-items:center; }
.title { font-weight:700; font-size:14px; color:#0F172A; }
.svg-container { position:relative; align-self:center; }
.radar-svg { width:100%; max-width:300px; }
.point.student { fill:#1D4ED8; stroke:#FFFFFF; stroke-width:2; }
.point.student:hover { transform:scale(1.3); }
.tooltip { position:absolute; background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px; padding:6px 10px; font-size:12px; box-shadow:0 4px 12px rgba(0,0,0,0.08); pointer-events:none; }
.tt-label { font-weight:600; color:#334155; }
.tt-value { font-size:11px; color:#475569; }
.no-data { display:flex; align-items:center; gap:6px; color:#64748B; font-size:12px; padding:8px 10px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; }
</style>