<template>
  <div class="sidebar">
    <SimRadar :final-estado="finalEstado" />
    <div class="divider"></div>
    <div class="progress-section">
      <div class="section-title">
        <v-icon size="18" color="primary" class="mr-2">mdi-progress-check</v-icon>
        Avance por Materia
      </div>
      <div v-for="m in materiasOrdenadas" :key="m.materiaId" class="materia-progress">
        <div class="top-row">
          <span class="name">{{ displayName(m.materiaId) }}</span>
          <v-chip size="x-small" variant="flat" :color="colorChip(m.pct)">{{ (m.pct*100).toFixed(0) }}%</v-chip>
        </div>
        <div class="bar">
          <div class="fill" :style="{ width: (m.pct*100)+'%', background: colorBar(m.pct) }"></div>
        </div>
        <div class="units-info">{{ m.aprobadas }}/{{ m.totales }} unidades aprobadas</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import SimRadar from './SimRadar.vue';

const props = defineProps({
  finalEstado: { type: Object, required: true },
  resumen: { type: Array, default: () => [] },
  namesMap: { type: Object, default: () => ({}) }
});

const materiasOrdenadas = computed(() =>
  props.resumen
    .map(r => ({
      materiaId: r.materiaId,
      aprobadas: r.aprobadas,
      totales: r.totales,
      pct: r.totales === 0 ? 0 : r.aprobadas / r.totales
    }))
    .sort((a,b) => displayName(a.materiaId).localeCompare(displayName(b.materiaId)))
);

function displayName(id) { return props.namesMap[id] || String(id).replace(/_/g, ' '); }
function colorBar(p) { if (p >= 0.7) return '#0D9488'; if (p >= 0.4) return '#F59E0B'; return '#DC2626'; }
function colorChip(p) { if (p >= 0.7) return 'success'; if (p >= 0.4) return 'warning'; return 'error'; }
</script>

<style scoped>
.sidebar { display:flex; flex-direction:column; gap:12px; }
.divider { height: 1px; background: #E2E8F0; margin: 4px 0 8px; }
.progress-section { display:flex; flex-direction:column; gap:10px; }
.section-title { display:flex; align-items:center; font-weight:800; color:#0F172A; }
.materia-progress { display:flex; flex-direction:column; gap:6px; }
.top-row { display:flex; align-items:center; justify-content:space-between; }
.name { font-weight:700; color:#334155; }
.bar { height:8px; background:#F1F5F9; border-radius:8px; overflow:hidden; }
.fill { height:100%; border-radius:8px; transition: width .5s ease; }
.units-info { font-size:11px; color:#64748B; }
</style>