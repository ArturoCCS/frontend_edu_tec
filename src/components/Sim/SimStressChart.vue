<template>
  <div class="chart-bars">
    <div
      v-for="p in series"
      :key="p.x"
      class="bar"
      :style="{ height: `${Math.min(1, Math.max(0, p.y)) * 120}px`, background: color(p.y) }"
      :title="`Semana ${p.x}: ${(p.y * 100).toFixed(0)}%`"
    />
  </div>
</template>

<script setup>
defineProps({
  series: { type: Array, default: () => [] },
});
const color = (n) => (n < 0.4 ? '#10B981' : n < 0.7 ? '#F59E0B' : '#EF4444');
</script>

<style scoped>
.chart-bars { display: flex; gap: 4px; align-items: end; height: 140px; background: #F8FAFC; padding: 8px; border-radius: 8px; border: 1px solid #E2E8F0; }
.bar { width: 12px; border-radius: 6px 6px 0 0; }
</style>