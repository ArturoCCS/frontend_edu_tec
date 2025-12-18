<template>
  <div>
    <div class="d-flex align-center mb-2">
      <v-icon class="mr-2">mdi-gauge</v-icon>
      <span class="text-subtitle-2">Estado final</span>
    </div>
    <div v-if="!finalEstado" class="text-caption text-grey">Sin datos</div>
    <div v-else class="final-grid">
      <div v-for="(val, key) in finalEstado" :key="key" class="final-item">
        <div class="final-label">{{ key }}</div>
        <v-progress-linear :model-value="val * 100" height="12" rounded :color="barColor(key, val)" />
        <div class="final-value">{{ (val * 100).toFixed(1) }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  finalEstado: { type: Object, default: () => null },
});
const barColor = (key, val) => {
  if (String(key).toLowerCase().includes('estres') || key === 'estres') {
    return val < 0.4 ? 'success' : val < 0.7 ? 'warning' : 'error';
  }
  return val >= 0.7 ? 'success' : val >= 0.4 ? 'warning' : 'error';
};
</script>

<style scoped>
.final-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
.final-item { border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px; background: #FFFFFF; }
.final-label { font-size: 12px; color: #475569; margin-bottom: 6px; font-weight: 600; }
.final-value { font-size: 12px; color: #334155; margin-top: 6px; text-align: right; }
</style>