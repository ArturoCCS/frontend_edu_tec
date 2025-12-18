<template>
  <v-card class="subject-card" variant="outlined">
    <div class="header">
      <div class="name">{{ materiaId }}</div>
      <v-chip size="x-small" :color="progressColor">{{ aprobadas }}/{{ total }} aprobadas</v-chip>
    </div>

    <div class="progress-bar">
      <div class="fill" :style="{ width: aprobadasPct + '%', background: progressColorHex }"></div>
    </div>

    <div class="units-grid">
      <div
        v-for="u in unidades"
        :key="u.unidadIndex"
        class="unit-pill"
        :class="unitClass(u)"
        :title="unitTitle(u)"
      >
        <span class="label">U{{ u.unidadIndex + 1 }}</span>
        <span class="score">{{ (u.scoreFinal * 100).toFixed(0) }}%</span>
      </div>
    </div>

    <div class="footer">
      <v-btn size="x-small" variant="text" color="primary" @click="$emit('open-detail', materiaId)">
        Ver detalles
      </v-btn>
      <v-spacer />
      <div class="hint">{{ footerText }}</div>
    </div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  materiaId: { type: String, required: true },
  unidades: { type: Array, default: () => [] },
});
defineEmits(['open-detail']);

const aprobadas = computed(() => props.unidades.filter(u => u.paso).length);
const total = computed(() => props.unidades.length);
const aprobadasPct = computed(() => (total.value ? (aprobadas.value / total.value) * 100 : 0));

const progressColor = computed(() => aprobadasPct.value >= 70 ? 'success' : aprobadasPct.value >= 40 ? 'warning' : 'error');
const progressColorHex = computed(() => aprobadasPct.value >= 70 ? '#0D9488' : aprobadasPct.value >= 40 ? '#F59E0B' : '#DC2626');

const unitClass = (u) => {
  if (u.paso) return 'passed';
  return u.scoreFinal >= 0.5 ? 'risk' : 'failed';
};
const unitTitle = (u) => `${props.materiaId} U${u.unidadIndex + 1} • ${u.paso ? 'Aprobada' : u.scoreFinal >= 0.5 ? 'Riesgo' : 'Reprobada'} • ${(u.scoreFinal*100).toFixed(0)}%`;

const footerText = computed(() => {
  if (!total.value) return 'Sin unidades.';
  if (aprobadas.value === 0) return 'Sin aprobaciones.';
  if (aprobadas.value === total.value) return 'Todas aprobadas.';
  return 'En progreso.';
});
</script>

<style scoped>
.subject-card { padding: 12px; border-radius: 12px; }
.header { display: flex; align-items: center; gap: 10px; }
.name { font-weight: 700; font-size: 15px; color: #1E293B; flex: 1; }
.progress-bar { background: #F1F5F9; height: 8px; border-radius: 6px; overflow: hidden; margin-top: 8px; }
.progress-bar .fill { height: 100%; transition: width .5s ease; border-radius: 6px; }
.units-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(56px, 1fr)); gap: 8px; margin-top: 10px; }
.unit-pill { height: 56px; border-radius: 12px; border: 2px solid #E2E8F0; background: #F8FAFC; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 11px; color: #334155; }
.unit-pill.passed { border-color: #0D9488; background: linear-gradient(135deg,#fff 0%,#ECFDF5 100%); }
.unit-pill.risk { border-color: #F59E0B; background: linear-gradient(135deg,#fff 0%,#FEF3C7 100%); }
.unit-pill.failed { border-color: #DC2626; background: linear-gradient(135deg,#fff 0%,#FEE2E2 100%); }
.label { font-weight: 700; }
.score { font-size: 10px; color: #64748B; }
.footer { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
.hint { font-size: 11px; color: #64748B; }
</style>