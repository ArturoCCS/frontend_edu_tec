<template>
  <v-navigation-drawer
    v-model="model"
    location="right"
    temporary
    width="360"
    class="history-drawer"
  >
    <div class="drawer-header">
      <v-icon class="mr-2">mdi-history</v-icon>
      Historia completa
    </div>
    <div class="weeks">
      <div
        v-for="h in history"
        :key="h.week"
        class="week-row"
        @click="$emit('select-week', h.week)"
      >
        <div class="w-label">Semana {{ h.week }}</div>
        <div class="w-events">{{ h.eventos.length }} evt</div>
        <div class="w-stress" :class="stressClass(h.estres)">
          {{ (h.estres*100).toFixed(0) }}%
        </div>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  history: { type: Array, default: () => [] }
});
const emit = defineEmits(['update:modelValue', 'select-week']);

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
});

function stressClass(n) {
  if (n < 0.4) return 'low';
  if (n < 0.7) return 'mid';
  return 'high';
}
</script>

<style scoped>
.history-drawer { display: flex; flex-direction: column; }
.drawer-header { font-weight: 700; font-size: 16px; padding: 16px 14px; display: flex; align-items: center; border-bottom: 1px solid #E2E8F0; }
.weeks { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
.week-row { display: grid; grid-template-columns: 1fr 60px 60px; align-items: center; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 8px 10px; cursor: pointer; transition: background .2s; font-size: 12px; }
.week-row:hover { background: #F1F5F9; }
.w-label { font-weight: 600; color: #0F172A; }
.w-events { text-align: center; color: #475569; }
.w-stress { text-align: center; font-weight: 600; }
.w-stress.low { color: #0D9488; }
.w-stress.mid { color: #F59E0B; }
.w-stress.high { color: #DC2626; }
</style>