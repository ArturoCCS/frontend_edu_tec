<template>
  <SimLayout
    :history="history"
    :final-estado="finalEstado"
    :resumen="resumen"
    :active-week="activeWeek"
    :playing="playing"
    :speed="speed"
    @play="start()"
    @pause="pause()"
    @set-week="setWeek"
    @set-speed="setSpeed"
    @open-history="showHistoryDrawer = true"
  />
</template>

<script setup>
import SimLayout from '@/components/Sim/SimLayout.vue';
import { PsychAPI, UserAPI } from '@/services/api';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const history = ref([]);
const finalEstado = ref(null);
const resumen = ref([]);
const activeWeek = ref(0);
const playing = ref(false);
const speed = ref(1);
let timer = null;

const maxWeek = computed(() => (history.value.length ? Math.max(...history.value.map(h => h.week)) : 0));

const tick = () => {
  if (!playing.value) return;
  if (activeWeek.value >= maxWeek.value) {
    playing.value = false;
    return;
  }
  activeWeek.value += 1;
};

const start = () => {
  if (!history.value.length) return;
  playing.value = true;
  clearInterval(timer);
  timer = setInterval(tick, Math.max(300, 1200 / speed.value));
};
const pause = () => {
  playing.value = false;
  clearInterval(timer);
};
const setSpeed = (v) => {
  speed.value = v;
  if (playing.value) start();
};
const setWeek = (w) => activeWeek.value = w;

onMounted(async () => {
  try {
    const rawHistory = localStorage.getItem('simulator_history');
    const rawResumen = localStorage.getItem('simulator_resumen');
    const rawFinal = localStorage.getItem('simulator_final_estado');

    history.value = rawHistory ? JSON.parse(rawHistory) : [];
    resumen.value = rawResumen ? JSON.parse(rawResumen) : [];

    if (rawFinal) {
      finalEstado.value = JSON.parse(rawFinal);
    } else {
      let me = null;
      try { me = await UserAPI.me(); } catch {}
      const id_usuario = me?.id_usuario || me?.id || null;

      try {
        const latest = await PsychAPI.latest(id_usuario);
        finalEstado.value = latest?.final_estado || null;
      } catch {
        finalEstado.value = null;
      }
    }

    activeWeek.value = 0;
  } catch (e) {
    history.value = [];
    resumen.value = [];
    finalEstado.value = null;
    activeWeek.value = 0;
  }
});
onBeforeUnmount(() => clearInterval(timer));
</script>