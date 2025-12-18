<template>
  <v-card elevation="3">
    <v-card-title class="bg-secondary text-white d-flex align-center">
      <v-icon class="mr-2">mdi-timeline</v-icon>
      Simulación del Semestre
      <v-spacer></v-spacer>
      <v-chip v-if="loading" color="info" size="small">Cargando…</v-chip>
      <v-chip v-else-if="!history?.length" color="grey" size="small">Sin datos</v-chip>
    </v-card-title>

    <v-card-text class="pa-4">
      <SimControls
        :playing="playing"
        :speed="speed"
        :week="activeWeek"
        :max-week="maxWeek"
        @play="$emit('play')"
        @pause="$emit('pause')"
        @set-speed="(v) => $emit('set-speed', v)"
        @prev="$emit('prev')"
        @next="$emit('next')"
        @reset="$emit('reset')"
        @set-week="(w) => $emit('set-week', w)"
      />

      <v-divider class="my-4" />

      <SimTimeline
        :history="history"
        :active-week="activeWeek"
        @select-week="(w) => $emit('set-week', w)"
      />

      <v-divider class="my-4" />

      <div class="d-flex flex-column flex-md-row ga-4">
        <div class="flex-1 mr-md-4" style="min-width: 280px;">
          <div class="text-subtitle-2 mb-2">
            <v-icon class="mr-2">mdi-chart-bell-curve</v-icon>
            Estrés por semana
          </div>
          <SimStressChart :series="estresSeries" />
        </div>

        <div class="flex-1 ml-md-4" style="min-width: 280px;">
          <SimFinalState :final-estado="finalEstado" />
        </div>
      </div>

      <v-divider class="my-4" />

      <SimSummary :resumen="resumen" />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import SimControls from './SimControls.vue';
import SimFinalState from './SimFinalState.vue';
import SimStressChart from './SimStressChart.vue';
import SimSummary from './SimSummary.vue';
import SimTimeline from './SimTimeline.vue';

const props = defineProps({
  loading: { type: Boolean, default: false },
  history: { type: Array, default: () => [] },
  finalEstado: { type: Object, default: () => null },
  resumen: { type: Array, default: () => [] },
  activeWeek: { type: Number, default: 0 },
  playing: { type: Boolean, default: false },
  speed: { type: Number, default: 1 },
});
defineEmits(['play', 'pause', 'set-speed', 'prev', 'next', 'reset', 'set-week']);

const maxWeek = computed(() => (props.history.length ? Math.max(...props.history.map(h => h.week)) : 0));
const estresSeries = computed(() => props.history.map(h => ({ x: h.week, y: h.estres })));
</script>