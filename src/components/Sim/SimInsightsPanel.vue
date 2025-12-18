<template>
  <div class="insights-panel">
    <div class="panel-block">
      <div class="block-title">
        <v-icon class="mr-2">mdi-gauge</v-icon> Estado final
      </div>
      <div v-if="!finalEstado" class="empty">Sin datos</div>
      <div v-else class="final-grid">
        <div v-for="(val,key) in finalEstado" :key="key" class="final-item">
          <div class="label">{{ key }}</div>
          <div class="bar">
            <div class="fill" :style="{ width: (val*100).toFixed(1)+'%', background: barColor(key, val) }"></div>
          </div>
          <div class="val">{{ (val*100).toFixed(1) }}%</div>
        </div>
      </div>
    </div>

    <div class="panel-block">
      <div class="block-title">
        <v-icon class="mr-2">mdi-table</v-icon> Resumen Materias
      </div>
      <div v-if="!resumen.length" class="empty">Sin datos</div>
      <div v-else class="resumen-list">
        <div v-for="r in resumen" :key="r.materiaId" class="row">
          <div class="code">{{ r.materiaId }}</div>
          <div class="progress">{{ r.aprobadas }}/{{ r.totales }}</div>
          <div class="pct">
            <span :class="pctClass(r.pct)">{{ (r.pct*100).toFixed(0) }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  finalEstado: { type: Object, default: () => null },
  resumen: { type: Array, default: () => [] }
});

const barColor = (key, val) => {
  if (String(key).toLowerCase().includes('estres') || key === 'estres') {
    return val < 0.4 ? '#0D9488' : val < 0.7 ? '#F59E0B' : '#DC2626';
  }
  return val >= 0.7 ? '#2563EB' : val >= 0.4 ? '#F59E0B' : '#DC2626';
};
const pctClass = (pct) => {
  if (pct >= 0.7) return 'good';
  if (pct >= 0.4) return 'mid';
  return 'low';
};
</script>

<style scoped>
.insights-panel { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 24px; font-size: 12px; }
.panel-block { display: flex; flex-direction: column; gap: 12px; }
.block-title { font-size: 14px; font-weight: 700; display: flex; align-items: center; color: #0F172A; }
.empty { font-size: 12px; color: #64748B; font-style: italic; }
.final-grid { display: flex; flex-direction: column; gap: 8px; max-height: 220px; overflow-y: auto; }
.final-item { display: grid; grid-template-columns: 70px 1fr 50px; align-items: center; gap: 8px; }
.label { font-weight: 600; color: #475569; font-size: 11px; }
.bar { background: #F1F5F9; height: 6px; border-radius: 4px; overflow: hidden; }
.fill { height: 100%; transition: width .4s ease; }
.val { text-align: right; font-size: 11px; color: #334155; }
.resumen-list { display: flex; flex-direction: column; gap: 6px; max-height: 240px; overflow-y: auto; }
.row { display: grid; grid-template-columns: 1fr 60px 50px; align-items: center; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 6px 8px; }
.code { font-weight: 600; color: #0F172A; font-size: 12px; }
.progress { font-size: 11px; color: #475569; text-align: center; }
.pct span { font-size: 11px; font-weight: 600; }
.pct span.good { color: #0D9488; }
.pct span.mid { color: #F59E0B; }
.pct span.low { color: #DC2626; }
</style>