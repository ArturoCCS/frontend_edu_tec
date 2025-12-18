<template>
  <div class="semester-calendar">
    <div class="cal-header">
      <v-icon class="mr-2">mdi-calendar</v-icon>
      <span class="title">Calendario</span>
      <v-spacer />
      <div class="controls">
        <v-btn icon variant="text" @click="prevMonth" :disabled="!canPrevMonth"><v-icon>mdi-chevron-left</v-icon></v-btn>
        <v-chip size="small" variant="outlined">{{ monthName(currentMonth) }} {{ currentYear }}</v-chip>
        <v-btn icon variant="text" @click="nextMonth" :disabled="!canNextMonth"><v-icon>mdi-chevron-right</v-icon></v-btn>
      </div>
    </div>

    <div class="month-block">
      <div class="days-grid">
        <div class="day-label" v-for="d in dayLabels" :key="d">{{ d }}</div>
        <div
          v-for="d in visibleMonth.days"
          :key="d.date.toISOString()"
          class="day-cell"
          :class="{
            out: !d.inMonth,
            activeWeek: d.weekIndex === activeWeek,
            event: d.events > 0 && d.weekIndex !== null && d.weekIndex <= activeWeek
          }"
          :title="dayTitle(d)"
          @click="onDayClick(d)"
        >
          <span class="date-num">{{ d.date.getDate() }}</span>
          <span v-if="d.events > 0 && d.weekIndex !== null && d.weekIndex <= activeWeek" class="events-dot">{{ d.events }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { buildCalendar } from '@/utils/dateMapping';
import { computed, ref, watch } from 'vue';

const props = defineProps({
  startDate: { type: String, required: true },
  totalWeeks: { type: Number, required: true },
  history: { type: Array, default: () => [] },
  activeWeek: { type: Number, default: 0 },
  singleMonth: { type: Boolean, default: true }
});
const emit = defineEmits(['set-week', 'preview-day']);

const calendar = computed(() => buildCalendar(props.startDate, props.totalWeeks, props.history, props.activeWeek));
const dayLabels = ['L','M','X','J','V','S','D'];

function monthName(m) {
  return ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][m];
}

const currentMonth = ref(0);
const currentYear = ref(0);
const visibleMonth = computed(() => {
  const acDate = new Date(new Date(props.startDate).getTime() + props.activeWeek * 7 * 86400000);
  const target = calendar.value.find(c => c.month === currentMonth.value && c.year === currentYear.value);
  return target || calendar.value.find(c => c.month === acDate.getMonth() && c.year === acDate.getFullYear()) || calendar.value[0];
});

watch(calendar, () => {
  const acDate = new Date(new Date(props.startDate).getTime() + props.activeWeek * 7 * 86400000);
  currentMonth.value = acDate.getMonth();
  currentYear.value = acDate.getFullYear();
}, { immediate: true });

const canPrevMonth = computed(() => {
  const first = calendar.value[0];
  if (!first) return false;
  return currentYear.value > first.year || (currentYear.value === first.year && currentMonth.value > first.month);
});
const canNextMonth = computed(() => {
  const last = calendar.value[calendar.value.length - 1];
  if (!last) return false;
  return currentYear.value < last.year || (currentYear.value === last.year && currentMonth.value < last.month);
});

function prevMonth() {
  if (!canPrevMonth.value) return;
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value -= 1;
  } else {
    currentMonth.value -= 1;
  }
}
function nextMonth() {
  if (!canNextMonth.value) return;
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value += 1;
  } else {
    currentMonth.value += 1;
  }
}

function dayTitle(d) {
  if (d.weekIndex === null) return d.date.toLocaleDateString();
  if (d.weekIndex > props.activeWeek) return `Semana ${d.weekIndex}`;
  return `Semana ${d.weekIndex} • ${d.events} evento(s)`;
}

function onDayClick(d) {
  const payload = { date: d.date, weekIndex: d.weekIndex, events: [] };
  if (d.weekIndex !== null && d.weekIndex <= props.activeWeek) {
    const week = props.history.find(h => h.week === d.weekIndex);
    if (week) {
      const weekStart = new Date(new Date(props.startDate).getTime() + d.weekIndex * 7 * 86400000);
      const offset = Math.floor((d.date - weekStart) / 86400000);
      payload.events = week.eventos.filter((ev, idx) => (idx % 7) === offset);
    }
  }
  emit('preview-day', payload);
}
</script>
<style scoped>
.calendar-wrap { display:flex; flex-direction:column; gap:8px; width:100%; max-width:100%; }
.section-head { display:flex; align-items:center; justify-content:space-between; }
.left { display:flex; align-items:center; gap:8px; }
.title { font-weight: 800; color: #0F172A; }
.right { display:flex; align-items:center; gap:6px; }

.month-block { width:100%; max-width:100%; }
.days-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:5px; width:100%; }
.day-label { text-align:center; font-size:10px; font-weight:600; color:#64748B; }
.day-cell {
  min-height:32px;
  background:#F8FAFC;
  border-radius:10px;
  border:1px solid #E2E8F0;
  padding:5px 6px;
  position:relative;
  display:flex;
  align-items:flex-start;
  font-size:10.5px;
  box-sizing:border-box;
  min-width:0;
}
.day-cell.out { opacity:.35; }
.day-cell.event { background:#EAF2FF; border-color:#93C5FD; }
.day-cell.activeWeek { outline:2px solid #2563EB; background:#EFF6FF; }
.date-num { font-weight:700; color:#334155; }
.events-dot { position:absolute; bottom:3px; right:6px; background:#2563EB; color:#fff; font-size:9.5px; border-radius:8px; padding:2px 6px; line-height:1; }
</style>