<template>
  <div class="sim-header">
    <div class="left-group">
      <div class="week-info">
        <span class="label">Semana</span>
        <span class="value">{{ week }} / {{ maxWeek }}</span>
      </div>
      <div class="estres-info" :class="stressClass">
        <v-icon size="18" class="mr-1">mdi-pulse</v-icon>
        Estrés {{ (estres * 100).toFixed(0) }}%
      </div>
    </div>

    <div class="center-group">
      <div class="mini-timeline">
        <div
          v-for="wNum in maxWeek + 1"
          :key="wNum"
          class="dot"
          :class="dotClass(wNum)"
          @click="$emit('set-week', wNum)"
          :title="`Semana ${wNum}`"
        ></div>
      </div>
    </div>

    <div class="right-group">
      <v-btn
        size="small"
        color="primary"
        @click="playing ? $emit('pause') : $emit('play')"
      >
        <v-icon class="mr-1">{{ playing ? 'mdi-pause' : 'mdi-play' }}</v-icon>
        {{ playing ? 'Pausa' : 'Reproducir' }}
      </v-btn>

      <v-select
        :model-value="speed"
        :items="velItems"
        density="compact"
        style="max-width: 110px"
        @update:model-value="$emit('set-speed', $event)"
      />

      <v-btn icon variant="text" @click="$emit('open-history')" :title="'Ver historia'">
        <v-icon>mdi-history</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  week: Number,
  maxWeek: Number,
  estres: Number,
  playing: Boolean,
  speed: { type: Number, default: 1 }
});
defineEmits(['play', 'pause', 'set-week', 'set-speed', 'open-history']);

const velItems = [
  { title: '0.5x', value: 0.5 },
  { title: '1x', value: 1 },
  { title: '1.5x', value: 1.5 },
  { title: '2x', value: 2 }
];

const stressClass = computed(() => {
  if (props.estres < 0.4) return 'stress-low';
  if (props.estres < 0.7) return 'stress-mid';
  return 'stress-high';
});

function dotClass(w) {
  if (w === props.week) return 'active';
  return w < props.week ? 'past' : 'future';
}
</script>

<style scoped>
.sim-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 10px 16px;
  gap: 12px;
}
.left-group { display: flex; gap: 16px; align-items: center; }
.week-info .label { font-size: 10px; text-transform: uppercase; color: #64748B; letter-spacing: .5px; }
.week-info .value { font-size: 16px; font-weight: 600; color: #0F172A; }
.estres-info { font-size: 13px; font-weight: 500; padding: 4px 10px; border-radius: 6px; display: flex; align-items: center; }
.estres-info.stress-low { background: #ECFDF5; color: #047857; }
.estres-info.stress-mid { background: #FEF3C7; color: #B45309; }
.estres-info.stress-high { background: #FEE2E2; color: #B91C1C; }
.center-group { display: flex; justify-content: center; }
.mini-timeline { display: flex; gap: 4px; }
.dot { width: 10px; height: 10px; border-radius: 50%; background: #CBD5E1; cursor: pointer; transition: transform .2s; }
.dot.active { background: #2563EB; transform: scale(1.4); }
.dot.past { background: #60A5FA; }
.dot.future { opacity: .5; }
.dot:hover { transform: scale(1.25); }
.right-group { display: flex; gap: 8px; align-items: center; }
@media (max-width: 960px) {
  .mini-timeline { display: none; }
  .sim-header { grid-template-columns: 1fr auto; }
}
</style>