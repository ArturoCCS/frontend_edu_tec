<template>
  <div class="sidebar-guide">
    <div class="section">
      <div class="section-title">Acompañamiento</div>
      <div class="tip" v-if="currentWeekData">
        <strong>Semana {{ week }}:</strong>
        <span v-if="currentWeekData.eventos.length > 0">
          {{ currentWeekData.eventos.length }} evaluaciones.
          <span v-if="aprobadasSemana > 0">{{ aprobadasSemana }} aprobadas.</span>
        </span>
        <span v-else>Sin eventos académicos.</span>
      </div>
      <div class="tip muted" v-else>
        Cargando información…
      </div>
    </div>

    <div class="section">
      <div class="section-subtitle">Indicadores Clave</div>
      <div class="metric" v-for="m in metrics" :key="m.key">
        <div class="metric-label">{{ m.label }}</div>
        <div class="metric-bar">
          <div class="fill" :style="{ width: m.pct + '%', background: m.color }"></div>
        </div>
        <div class="metric-value">{{ m.display }}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-subtitle">Resumen Materias</div>
      <ul class="list">
        <li v-for="r in resumen" :key="r.materiaId">
          <span class="code">{{ r.materiaId }}</span>
          <span class="progress">{{ r.aprobadas }}/{{ r.totales }}</span>
          <span class="pct">{{ (r.pct * 100).toFixed(0) }}%</span>
        </li>
      </ul>
    </div>

    <div class="section">
      <div class="section-subtitle">Siguiente Paso</div>
      <div class="tip">
        {{ nextMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  week: Number,
  maxWeek: Number,
  estres: Number,
  history: { type: Array, default: () => [] },
  finalEstado: { type: Object, default: () => null },
  resumen: { type: Array, default: () => [] }
});

const currentWeekData = computed(() => props.history.find(h => h.week === props.week));
const aprobadasSemana = computed(() =>
  currentWeekData.value ? currentWeekData.value.eventos.filter(e => e.paso).length : 0
);

const metrics = computed(() => {
  if (!props.finalEstado) return [];
  const entries = Object.entries(props.finalEstado);
  return entries.slice(0, 6).map(([key, val]) => {
    const pct = Math.min(100, Math.max(0, val * 100));
    return {
      key,
      label: key,
      pct,
      color: pct >= 70 ? '#0D9488' : pct >= 40 ? '#F59E0B' : '#DC2626',
      display: pct.toFixed(1) + '%'
    };
  });
});

const nextMessage = computed(() => {
  if (props.week >= props.maxWeek) return 'Has llegado al final. Revisa los resultados globales.';
  if (!currentWeekData.value) return 'Espera a que carguen los datos.';
  if (currentWeekData.value.eventos.length === 0) return 'Sin eventos: puedes avanzar a la siguiente semana.';
  if (aprobadasSemana.value === 0) return 'Revisa por qué no aprobaste para mejorar en la próxima semana.';
  if (aprobadasSemana.value < currentWeekData.value.eventos.length) return 'Buen avance. Intenta subir las evaluaciones restantes.';
  return 'Excelente. Todas las evaluaciones de esta semana fueron aprobadas.';
});
</script>

<style scoped>
.sidebar-guide {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  font-size: 13px;
}
.section-title { font-size: 14px; font-weight: 700; color: #0F172A; }
.section-subtitle { font-size: 11px; font-weight: 600; text-transform: uppercase; color: #64748B; letter-spacing: .5px; margin-bottom: 6px; }
.tip { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 8px; line-height: 1.3; }
.tip.muted { color: #64748B; font-style: italic; }
.metric { display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }
.metric-label { font-size: 11px; font-weight: 600; color: #475569; }
.metric-bar { background: #F1F5F9; height: 6px; border-radius: 4px; overflow: hidden; }
.metric-bar .fill { height: 100%; transition: width .4s ease; }
.metric-value { font-size: 11px; text-align: right; color: #475569; }
.list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; }
.list li { display: grid; grid-template-columns: 1fr auto auto; gap: 6px; padding: 6px 8px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; }
.code { font-weight: 600; color: #0F172A; }
.progress { font-size: 11px; color: #475569; }
.pct { font-size: 11px; font-weight: 600; }
</style>