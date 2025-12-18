<template>
  <div class="week-stage">
    <div class="stage-header">
      <div class="title">
        <v-icon class="mr-2">mdi-calendar-range</v-icon>
        Semana {{ activeWeek }}
      </div>
      <div class="sub" v-if="weekData">
        {{ microResumen }}
      </div>
    </div>

    <div v-if="!weekData" class="empty">No hay datos para esta semana.</div>

    <div v-else>
      <transition-group name="list-fade" tag="div" class="events">
        <div
          v-for="ev in weekData.eventos"
          :key="ev.materiaId + '-' + ev.unidadIndex"
          class="event-card"
          :class="variant(ev)"
        >
          <div class="top-row">
            <span class="code">{{ displayName(ev.materiaId) }}</span>
            <span class="unidad">
              Unidad {{ ev.unidadIndex + 1 }}
              <template v-if="unitName(ev.materiaId, ev.unidadIndex)">— {{ unitName(ev.materiaId, ev.unidadIndex) }}</template>
            </span>
          </div>
            <div class="status">
              <v-icon :color="ev.paso ? 'success' : 'error'">
                {{ ev.paso ? 'mdi-check-circle' : 'mdi-close-circle' }}
              </v-icon>
              <span class="ml-2">
                {{ ev.paso ? 'Aprobada' : 'No aprobada' }}
              </span>
            </div>
            <div class="score" v-if="typeof ev.scoreFinal === 'number'">Score: {{ (ev.scoreFinal * 100).toFixed(1) }}%</div>
            <div class="detalle" v-if="ev.detalle">{{ ev.detalle }}</div>
        </div>
      </transition-group>

      <div v-if="weekData.eventos.length === 0" class="no-events-large">
        Sin evaluaciones esta semana. Puedes avanzar.
      </div>
    </div>

    <div class="navigation mt-6">
      <v-btn
        variant="outlined"
        size="small"
        :disabled="activeWeek <= 0"
        @click="$emit('jump-week', activeWeek - 1)"
      >
        <v-icon class="mr-1">mdi-arrow-left</v-icon> Anterior
      </v-btn>
      <v-spacer />
      <v-btn
        variant="outlined"
        size="small"
        :disabled="activeWeek >= maxWeek"
        @click="$emit('jump-week', activeWeek + 1)"
      >
        Siguiente <v-icon class="ml-1">mdi-arrow-right</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  activeWeek: Number,
  history: { type: Array, default: () => [] },
  namesMap: { type: Object, default: () => ({}) },
  unitNamesMap: { type: Object, default: () => ({}) }
});
defineEmits(['jump-week']);

const weekData = computed(() => props.history.find(h => h.week === props.activeWeek));
const maxWeek = computed(() => (props.history.length ? Math.max(...props.history.map(h => h.week)) : 0));

const aprobadas = computed(() => weekData.value ? weekData.value.eventos.filter(e => e.paso).length : 0);
const microResumen = computed(() => {
  if (!weekData.value) return '';
  if (weekData.value.eventos.length === 0) return 'Semana sin actividades evaluadas.';
  const e = weekData.value;
  const est = typeof e.estres === 'number' ? (e.estres * 100).toFixed(0) + '%' : '—';
  return `${weekData.value.eventos.length} evaluaciones, ${aprobadas.value} aprobadas. Estrés ${est}.`;
});

const variant = (ev) => {
  if (ev.paso) return 'passed';
  return ev.scoreFinal >= 0.5 ? 'risk-mid' : 'risk-high';
};
function displayName(id) { return props.namesMap[id] || String(id).replace(/_/g, ' '); }
function unitName(mid, idx) { return props.unitNamesMap?.[mid]?.[idx] || ''; }
</script>

<style scoped>
.week-stage { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; padding: 20px; min-height: 520px; display: flex; flex-direction: column; }
.stage-header .title { font-weight: 700; font-size: 18px; display: flex; align-items: center; color: #0F172A; }
.stage-header .sub { font-size: 13px; color: #475569; margin-top: 4px; }
.events { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; margin-top: 20px; }
.event-card { border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px; background: #FFFFFF; display: flex; flex-direction: column; gap: 6px; position: relative; }
.event-card.passed { border-color: #0D9488; background: linear-gradient(135deg, #ffffff 0%, #ECFDF5 100%); }
.event-card.risk-mid { border-color: #F59E0B; background: linear-gradient(135deg, #ffffff 0%, #FEF3C7 100%); }
.event-card.risk-high { border-color: #DC2626; background: linear-gradient(135deg, #ffffff 0%, #FEE2E2 100%); }
.top-row { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; color: #0F172A; }
.status { display: flex; align-items: center; font-size: 12px; font-weight: 500; color: #334155; }
.score { font-size: 11px; color: #475569; }
.detalle { font-size: 11px; color: #64748B; line-height: 1.3; }
.no-events-large { margin-top: 40px; text-align: center; font-size: 14px; color: #64748B; }
.navigation { margin-top: auto; display: flex; align-items: center; }
.list-fade-enter-active, .list-fade-leave-active { transition: all .35s ease; }
.list-fade-enter-from { opacity: 0; transform: translateY(6px); }
.list-fade-leave-to { opacity: 0; transform: translateY(-6px); }
</style>