<template>
  <div class="calendar-wrapper">
    <div class="cal-header">
      <v-icon class="mr-2">mdi-calendar-month-outline</v-icon>
      <span class="title">Calendario del semestre</span>
      <v-spacer />
      <v-chip size="small" class="mr-2">Semana {{ activeWeek }} / {{ maxWeek }}</v-chip>
      <v-btn size="small" variant="text" @click="$emit('prev-week')" :disabled="activeWeek <= 0">
        <v-icon class="mr-1">mdi-chevron-left</v-icon> Semana anterior
      </v-btn>
      <v-btn size="small" variant="text" @click="$emit('next-week')" :disabled="activeWeek >= maxWeek">
        Siguiente semana <v-icon class="ml-1">mdi-chevron-right</v-icon>
      </v-btn>
    </div>

    <div class="weeks-line">
      <div
        v-for="w in weeks"
        :key="w.week"
        class="week-block"
        :class="{ active: w.week === activeWeek }"
        @click="$emit('set-week', w.week)"
      >
        <div class="week-label">W{{ w.week }}</div>
        <div class="days">
          <div
            v-for="d in 7"
            :key="d"
            class="day-dot"
            :class="dayClass(w.week, d)"
            :title="dayTitle(w.week, d)"
            @click.stop="$emit('select-day', { week: w.week, day: d })"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  history: { type: Array, default: () => [] },
  activeWeek: { type: Number, default: 0 }
});
defineEmits(['set-week', 'prev-week', 'next-week', 'select-day']);

const weeks = computed(() => props.history.map(h => ({ week: h.week, eventos: h.eventos })));
const maxWeek = computed(() => (weeks.value.length ? Math.max(...weeks.value.map(w => w.week)) : 0));

const dayClass = (week, day) => {
  const w = props.history.find(h => h.week === week);
  if (!w || w.eventos.length === 0) return '';
  const has = w.eventos.some((ev, idx) => (idx % 7) + 1 === day);
  return has ? 'has-event' : '';
};

const dayTitle = (week, day) => {
  const w = props.history.find(h => h.week === week);
  if (!w || w.eventos.length === 0) return `Semana ${week} - sin eventos`;
  const list = w.eventos.filter((ev, idx) => (idx % 7) + 1 === day);
  if (list.length === 0) return `Semana ${week} - sin eventos`;
  return `Semana ${week} - ${list.length} evento(s)`;
};
</script>

<style scoped>
.calendar-wrapper { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px; }
.cal-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.title { font-weight: 700; font-size: 14px; color: #0F172A; }
.weeks-line { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 6px; }
.week-block { min-width: 140px; border: 1px solid #E2E8F0; border-radius: 10px; padding: 8px; background: #F8FAFC; cursor: pointer; transition: box-shadow .2s, transform .2s; }
.week-block.active { border-color: #94A3B8; box-shadow: 0 6px 14px rgba(0,0,0,0.06); transform: translateY(-2px); background: #FFFFFF; }
.week-label { font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 6px; }
.days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
.day-dot { width: 10px; height: 10px; border-radius: 50%; background: #CBD5E1; }
.day-dot.has-event { background: #2563EB; }
</style>