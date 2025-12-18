<template>
  <div class="eval-stage">
    <div class="stage-header">
      <div class="title">
        <v-icon class="mr-2">mdi-calendar-range</v-icon>
        Semana {{ activeWeek }}
      </div>
      <div class="sub" v-if="weekData">
        {{ resumenSemana }}
      </div>
    </div>

    <div v-if="!weekData" class="empty">No hay datos para esta semana.</div>

    <div v-else>
      <div v-if="weekData.eventos.length === 0" class="no-events-large">
        Sin evaluaciones esta semana. Avanza para continuar.
      </div>

      <transition-group name="lane-fade" tag="div" class="lanes">
        <div v-for="lane in lanes" :key="lane.materiaId" class="lane-card">
          <div class="lane-header">
            <div class="materia">{{ lane.materiaId }}</div>
            <div class="summary">
              <v-icon size="18" :color="lane.aprobadasPct >= 70 ? 'success' : lane.aprobadasPct >= 40 ? 'warning' : 'error'">mdi-progress-check</v-icon>
              <span class="ml-1">{{ lane.aprobadas }}/{{ lane.total }} aprobadas</span>
            </div>
          </div>

          <div class="compact-bar">
            <div class="fill" :style="{ width: lane.aprobadasPct + '%', background: lane.aprobadasPct >= 70 ? '#0D9488' : lane.aprobadasPct >= 40 ? '#F59E0B' : '#DC2626' }"></div>
          </div>

          <div class="unit-line">
            <div v-for="u in lane.unidades" :key="u.unidadIndex" class="unit-chip" :class="unitClass(u)" :title="unitTitle(u)">
              <div class="chip-label">U{{ u.unidadIndex + 1 }}</div>
              <div class="chip-score">{{ (u.scoreFinal * 100).toFixed(0) }}%</div>
            </div>
          </div>

          <div class="lane-footer">
            <v-icon size="18" color="primary">mdi-information-outline</v-icon>
            <span class="ml-1">{{ laneFooterText(lane) }}</span>
          </div>
        </div>
      </transition-group>
    </div>

    <div class="navigation mt-6">
      <v-btn variant="outlined" size="small" :disabled="activeWeek <= 0" @click="$emit('jump-week', activeWeek - 1)">
        <v-icon class="mr-1">mdi-arrow-left</v-icon> Anterior
      </v-btn>
      <v-spacer />
      <v-btn variant="outlined" size="small" :disabled="activeWeek >= maxWeek" @click="$emit('jump-week', activeWeek + 1)">
        Siguiente <v-icon class="ml-1">mdi-arrow-right</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  activeWeek: Number,
  history: { type: Array, default: () => [] }
});
defineEmits(['jump-week']);

const weekData = computed(() => props.history.find(h => h.week === props.activeWeek));
const maxWeek = computed(() => (props.history.length ? Math.max(...props.history.map(h => h.week)) : 0));

const lanes = computed(() => {
  if (!weekData.value) return [];
  const map = new Map();
  weekData.value.eventos.forEach(ev => {
    if (!map.has(ev.materiaId)) map.set(ev.materiaId, []);
    map.get(ev.materiaId).push(ev);
  });
  return Array.from(map.entries()).map(([materiaId, arr]) => {
    const aprobadas = arr.filter(e => e.paso).length;
    const total = arr.length;
    return {
      materiaId,
      unidades: arr.sort((a,b) => a.unidadIndex - b.unidadIndex),
      aprobadas,
      total,
      aprobadasPct: total === 0 ? 0 : (aprobadas / total) * 100
    };
  }).sort((a,b) => a.materiaId.localeCompare(b.materiaId));
});

const resumenSemana = computed(() => {
  if (!weekData.value) return '';
  const total = weekData.value.eventos.length;
  if (total === 0) return 'Semana sin evaluaciones.';
  const aprob = weekData.value.eventos.filter(e => e.paso).length;
  return `${total} evaluaciones en ${lanes.value.length} materias | ${aprob} aprobadas`;
});

const unitClass = (u) => {
  if (u.paso) return 'passed';
  return u.scoreFinal >= 0.5 ? 'risk-mid' : 'risk-high';
};

const unitTitle = (u) => {
  return `${u.materiaId} U${u.unidadIndex + 1} • ${u.paso ? 'Aprobada' : u.scoreFinal >= 0.5 ? 'Riesgo moderado' : 'No aprobada'} • ${(u.scoreFinal*100).toFixed(0)}%`;
};

const laneFooterText = (lane) => {
  if (lane.total === 0) return 'Sin unidades evaluadas';
  if (lane.aprobadas === lane.total) return 'Todas las unidades aprobadas';
  if (lane.aprobadas === 0) return 'Sin aprobaciones esta semana';
  return 'Hay avance, quedan unidades por mejorar';
};
</script>

<style scoped>
.eval-stage { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 20px; min-height: 520px; display: flex; flex-direction: column; }
.stage-header .title { font-weight: 700; font-size: 18px; display: flex; align-items: center; color: #0F172A; }
.stage-header .sub { font-size: 13px; color: #475569; margin-top: 4px; }
.empty, .no-events-large { text-align: center; font-size: 14px; color: #64748B; margin-top: 40px; }
.lanes { display: grid; grid-template-columns: 1fr; gap: 14px; margin-top: 16px; }
.lane-card { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 10px; }
.lane-header { display: flex; justify-content: space-between; align-items: center; }
.materia { font-weight: 700; font-size: 15px; color: #1E293B; }
.summary { font-size: 12px; color: #475569; display: flex; align-items: center; }
.compact-bar { position: relative; background: #F1F5F9; height: 8px; border-radius: 6px; overflow: hidden; }
.compact-bar .fill { height: 100%; transition: width .6s ease; border-radius: 6px; }
.unit-line { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.unit-chip { width: 56px; height: 56px; border-radius: 50%; display: flex; flex-direction: column; justify-content: center; align-items: center; border: 2px solid #E2E8F0; background: #F8FAFC; font-size: 11px; color: #334155; transition: transform .2s ease, box-shadow .2s; }
.unit-chip .chip-label { font-weight: 700; }
.unit-chip .chip-score { font-size: 10px; color: #64748B; }
.unit-chip.passed { border-color: #0D9488; background: linear-gradient(135deg,#fff 0%,#ECFDF5 100%); box-shadow: 0 4px 10px rgba(13,148,136,0.15); }
.unit-chip.risk-mid { border-color: #F59E0B; background: linear-gradient(135deg,#fff 0%,#FEF3C7 100%); box-shadow: 0 4px 10px rgba(245,158,11,0.15); }
.unit-chip.risk-high { border-color: #DC2626; background: linear-gradient(135deg,#fff 0%,#FEE2E2 100%); box-shadow: 0 4px 10px rgba(220,38,38,0.15); }
.unit-chip:hover { transform: translateY(-2px); }
.lane-footer { display: flex; align-items: center; font-size: 12px; color: #475569; }
.navigation { margin-top: auto; display: flex; align-items: center; }
.lane-fade-enter-active, .lane-fade-leave-active { transition: all .35s ease; }
.lane-fade-enter-from { opacity: 0; transform: translateY(12px); }
.lane-fade-leave-to { opacity: 0; transform: translateY(-12px); }
@media (min-width: 1200px) {
  .lanes { grid-template-columns: repeat(2, 1fr); }
}
</style>