<template>
  <div class="event-card" :class="variant">
    <div class="top">
      <v-chip size="x-small" color="primary" variant="flat">{{ evento.materiaId }}</v-chip>
      <v-chip size="x-small" color="secondary" variant="flat">U{{ evento.unidadIndex + 1 }}</v-chip>
    </div>
    <div class="middle">
      <div class="status">
        <v-icon :color="evento.paso ? 'success' : 'error'">
          {{ evento.paso ? 'mdi-check-circle' : 'mdi-close-circle' }}
        </v-icon>
        <span class="ml-2">{{ evento.paso ? 'Aprobó' : 'No aprobó' }}</span>
      </div>
      <div class="score">Score: {{ (evento.scoreFinal * 100).toFixed(1) }}%</div>
    </div>
    <div class="detail">{{ evento.detalle }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  evento: { type: Object, required: true },
});

const variant = computed(() => {
  if (props.evento.paso) return 'passed';
  return props.evento.scoreFinal >= 0.5 ? 'risk-moderate' : 'risk-high';
});
</script>

<style scoped>
.event-card { border: 1px solid #E2E8F0; border-radius: 10px; padding: 8px; background: #FFFFFF; }
.event-card.passed { border-color: #10B981; background: linear-gradient(135deg, #ffffff 0%, #ECFDF5 100%); }
.event-card.risk-moderate { border-color: #F59E0B; background: linear-gradient(135deg, #ffffff 0%, #FEF3C7 100%); }
.event-card.risk-high { border-color: #EF4444; background: linear-gradient(135deg, #ffffff 0%, #FEE2E2 100%); }
.top { display: flex; gap: 6px; align-items: center; margin-bottom: 6px; }
.middle { display: flex; justify-content: space-between; font-size: 12px; color: #334155; }
.status { display: flex; align-items: center; }
.detail { font-size: 12px; color: #64748B; margin-top: 6px; }
</style>