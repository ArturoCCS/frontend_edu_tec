<template>
  <div class="sim-page">
    <div class="container">
      <SimHeader
        class="sim-header header"
        :week="activeWeek"
        :max-week="maxWeek"
        :estres="currentStress"
        :playing="playing"
        :speed="speed"
        @play="$emit('play')"
        @pause="$emit('pause')"
        @set-week="(w) => setWeek(w)"
        @set-speed="$emit('set-speed', $event)"
        @open-history="showHistoryDrawer = true"
      />

      <div class="outer-grid-3" :style="{ '--viewport-content-height': contentHeight + 'px' }">
        <aside class="col-left">
          <div class="card panel">
            <div class="scroll">
              <SimRadarSidebar
                :final-estado="finalEstado"
                :resumen="sidebarResumen"
                :names-map="namesMap"
              />
            </div>
          </div>
        </aside>

        <section class="col-center">
          <div class="card panel fill">
            <SimSubjectsMatrix
              :materia-unidad-states="materiaUnidadStates"
              :totales-por-materia="totalesPorMateria"
              @open-detail="openMateriaDetail"
            />
          </div>
        </section>

        <section class="col-right">
          <div class="card panel fill">
            <SimSemesterCalendar
              :start-date="semesterStartDate"
              :total-weeks="totalWeeks"
              :history="history"
              :active-week="activeWeek"
              :single-month="true"
              @set-week="setWeek"
              @preview-day="onPreviewDay"
            />
          </div>
        </section>
      </div>
    </div>

    <SimHistoryDrawer
      v-model="showHistoryDrawer"
      :history="history"
      @select-week="(w) => { setWeek(w); showHistoryDrawer = false; }"
    />
    <SimSubjectDetailDrawer
      v-model="materiaDetailOpen"
      :materia-id="materiaDetailId"
      :materia-name="namesMap[materiaDetailId] || materiaDetailId"
      :unidades="materiaDetailUnitsSanitized"
      :difficulty="0.6"
    />
    <SimDayEventsDialog
      v-model="dayDialogOpen"
      :date="dayDialogDate"
      :events="dayDialogEvents"
    />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import SimDayEventsDialog from './SimDayEventsDialog.vue';
import SimHeader from './SimHeader.vue';
import SimHistoryDrawer from './SimHistoryDrawer.vue';
import SimRadarSidebar from './SimRadarSidebar.vue';
import SimSemesterCalendar from './SimSemesterCalendar.vue';
import SimSubjectDetailDrawer from './SimSubjectDetailDrawer.vue';
import SimSubjectsMatrix from './SimSubjectsMatrix.vue';

const props = defineProps({
  history: { type: Array, default: () => [] },
  finalEstado: { type: Object, default: () => ({}) },
  resumen: { type: Array, default: () => [] },
  activeWeek: { type: Number, default: 0 },
  playing: { type: Boolean, default: false },
  speed: { type: Number, default: 1 },
  semesterStartDate: { type: String, default: '2024-01-15' },
  totalWeeks: { type: Number, default: 16 }
});
const emit = defineEmits(['play', 'pause', 'set-week', 'set-speed']);

const totalesPorMateria = ref({});
const namesMap = ref({});
const unitNamesMap = ref({});

onMounted(() => {
  try {
    const raw = localStorage.getItem('simulator_totales_materia');
    totalesPorMateria.value = raw ? JSON.parse(raw) : {};
  } catch { totalesPorMateria.value = {}; }

  try {
    const rn = localStorage.getItem('simulator_names_map');
    if (rn) namesMap.value = JSON.parse(rn);
    else {
      const sel = JSON.parse(localStorage.getItem('simulator_selection') || '[]');
      namesMap.value = sel.reduce((acc, m) => { acc[m.code] = m.nombre; return acc; }, {});
    }
  } catch { namesMap.value = {}; }

  try {
    const ru = localStorage.getItem('simulator_unit_names');
    if (ru) unitNamesMap.value = JSON.parse(ru);
    else {
      const sel = JSON.parse(localStorage.getItem('simulator_selection') || '[]');
      unitNamesMap.value = sel.reduce((acc, m) => {
        acc[m.code] = {};
        (m.unidades || []).forEach(u => { acc[m.code][u.unidad_index] = u.nombre; });
        return acc;
      }, {});
    }
  } catch { unitNamesMap.value = {}; }
});

const materiaUnidadStates = computed(() => {
  const res = {};
  const totals = totalesPorMateria.value || {};
  Object.entries(totals).forEach(([mid, total]) => {
    const m = {};
    for (let i = 0; i < total; i++) m[i] = { status: 'future' };
    res[mid] = m;
  });

  props.history.forEach(week => {
    (week.eventos || []).forEach(ev => {
      const mid = ev.materiaId;
      const idx = ev.unidadIndex;
      if (!res[mid]) res[mid] = {};
      const isFuture = (typeof ev.week === 'number') && ev.week > props.activeWeek;
      let status = 'future';
      if (!isFuture) {
        if (ev.paso) status = 'passed';
        else if (typeof ev.scoreFinal === 'number' && ev.scoreFinal >= 0.5) status = 'risk';
        else status = 'failed';
      }
      res[mid][idx] = {
        status,
        score: typeof ev.scoreFinal === 'number' ? ev.scoreFinal : undefined,
        detalle: ev.detalle,
        week: ev.week,
        nombre: unitNamesMap.value[mid]?.[idx]
      };
    });
  });

  return res;
});

const sidebarResumen = computed(() => {
  if (props.resumen?.length) {
    return props.resumen.map(r => ({
      ...r,
      displayName: namesMap.value[r.materiaId] || r.materiaId
    }));
  }
  return Object.entries(materiaUnidadStates.value).map(([mid, map]) => {
    const total = Object.keys(map).length;
    const aprobadas = Object.values(map).filter(u => u.status === 'passed').length;
    return { materiaId: mid, aprobadas, totales: total, pct: total ? aprobadas / total : 0, displayName: namesMap.value[mid] || mid };
  });
});

function setWeek(w) { emit('set-week', w); }

const maxWeek = computed(() =>
  props.history.length ? Math.max(...props.history.map(h => h.week)) : props.totalWeeks
);
const currentStress = computed(() => {
  const w = props.history.find(h => h.week === props.activeWeek);
  return w ? (w.estres || 0) : 0;
});

const materiaDetailOpen = ref(false);
const materiaDetailId = ref('');
const materiaDetailUnitsRaw = ref([]);
const materiaDetailUnitsSanitized = computed(() =>
  (materiaDetailUnitsRaw.value || []).map(u => {
    if (u.week === undefined || u.week > props.activeWeek) {
      return { ...u, status: (u.status === 'passed' || u.status === 'failed') ? u.status : 'future', score: undefined, detalle: undefined };
    }
    if (u.status === 'pending') return { ...u, score: undefined, detalle: u.detalle || 'Pendiente' };
    return u;
  })
);

function openMateriaDetail(materiaId) {
  materiaDetailId.value = materiaId;
  const map = materiaUnidadStates.value[materiaId] || {};
  const total = (totalesPorMateria.value || {})[materiaId] || Object.keys(map).length || 6;
  const arr = [];
  for (let i = 0; i < total; i++) {
    const data = map[i] || { status: 'future' };
    arr.push({
      unidadIndex: i,
      ...data,
      nombre: unitNamesMap.value[materiaId]?.[i]
    });
  }
  materiaDetailUnitsRaw.value = arr;
  materiaDetailOpen.value = true;
}

const dayDialogOpen = ref(false);
const dayDialogDate = ref(null);
const dayDialogEvents = ref([]);
function onPreviewDay(payload) {
  dayDialogDate.value = payload.date || null;
  dayDialogEvents.value = payload.events || [];
  dayDialogOpen.value = true;
}

const showHistoryDrawer = ref(false);

const contentHeight = ref(560);
function calcContentHeight() {
  const headerEl = document.querySelector('.sim-header');
  const headerH = headerEl ? headerEl.getBoundingClientRect().height : 100;
  const vh = window.innerHeight;
  contentHeight.value = Math.max(440, vh - headerH - 56);
}
onMounted(() => {
  calcContentHeight();
  window.addEventListener('resize', calcContentHeight);
});
onBeforeUnmount(() => window.removeEventListener('resize', calcContentHeight));
</script>

<style scoped>
:host, .sim-page { overflow-x: hidden; }
.sim-page { background: #F1F5F9; min-height: 100vh; }
:root { --sidebar-w: 72px; }
.container { width: calc(100vw - var(--sidebar-w)); margin: 0 0 0 var(--sidebar-w); padding: 12px 16px 24px; }
.header { margin-bottom: 12px; }
.outer-grid-3 {
  display: grid;
  grid-template-columns: minmax(300px, 340px) 1fr minmax(360px, 400px);
  gap: 16px; align-items: start; width: 100%; min-width: 0;
}
.card.panel { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 12px; max-width: 100%; box-sizing: border-box; overflow: hidden; box-shadow: 0 6px 24px rgba(0,0,0,0.04); }
.fill { height: var(--viewport-content-height); display: flex; flex-direction: column; max-width: 100%; overflow: hidden; }
.col-left .scroll { height: var(--viewport-content-height); overflow: auto; padding-right: 4px; }
.col-left, .col-center, .col-right { min-width: 0; }
.col-center .card.panel { display: flex; flex-direction: column; }
.col-center .card.panel > * { flex: 1 1 auto; min-height: 0; }
@media (max-width: 1200px) {
  .outer-grid-3 { grid-template-columns: minmax(280px, 320px) 1fr minmax(340px, 380px); }
}
@media (max-width: 980px) {
  .outer-grid-3 {
    grid-template-columns: minmax(280px, 320px) 1fr;
    grid-template-rows: auto auto;
    grid-template-areas: "left center" "right right";
  }
  .col-left { grid-area: left; }
  .col-center { grid-area: center; }
  .col-right { grid-area: right; }
  .col-left .scroll, .fill { height: auto; }
}
@media (max-width: 720px) {
  .outer-grid-3 { grid-template-columns: 1fr; grid-template-rows: auto auto auto; }
  .card.panel { padding: 10px; border-radius: 14px; }
}
.col-left .scroll::-webkit-scrollbar { width: 8px; }
.col-left .scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 6px; }
</style>