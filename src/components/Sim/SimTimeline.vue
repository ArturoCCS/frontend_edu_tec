<template>
  <div>
    <div class="timeline-grid">
      <div
        v-for="s in history"
        :key="s.week"
        class="week-card"
        :class="{ active: s.week === activeWeek }"
        @click="$emit('select-week', s.week)"
      >
        <div class="week-header">
          <div class="title">Semana {{ s.week }}</div>
          <v-chip size="x-small" :color="estresColor(s.estres)">
            Estrés {{ (s.estres * 100).toFixed(0) }}%
          </v-chip>
        </div>

        <div v-if="!s.eventos?.length" class="no-events">Sin eventos</div>
        <div v-else class="event-list">
          <SimEventCard
            v-for="ev in s.eventos"
            :key="ev.materiaId + '-' + ev.unidadIndex"
            :evento="ev"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SimEventCard from './SimEventCard.vue';

defineProps({
  history: { type: Array, default: () => [] },
  activeWeek: { type: Number, default: 0 },
});
defineEmits(['select-week']);

const estresColor = (n) => (n < 0.4 ? '#10B981' : n < 0.7 ? '#F59E0B' : '#EF4444');
</script>

<style scoped>
.timeline-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
.week-card { border: 1px solid #E2E8F0; border-radius: 12px; background: white; padding: 12px; cursor: pointer; transition: box-shadow .2s, transform .2s; }
.week-card.active { box-shadow: 0 8px 18px rgba(0,0,0,0.08); transform: translateY(-2px); border-color: #94A3B8; }
.week-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.title { font-weight: 600; color: #0F172A; }
.no-events { color: #64748B; font-size: 13px; padding: 8px; background: #F8FAFC; border-radius: 8px; }
.event-list { display: grid; grid-template-columns: 1fr; gap: 8px; }
</style>