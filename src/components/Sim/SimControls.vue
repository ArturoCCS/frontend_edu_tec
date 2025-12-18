<template>
  <div class="d-flex flex-wrap align-center ga-2">
    <v-btn color="primary" @click="playing ? $emit('pause') : $emit('play')">
      <v-icon class="mr-2">{{ playing ? 'mdi-pause' : 'mdi-play' }}</v-icon>
      {{ playing ? 'Pausar' : 'Reproducir' }}
    </v-btn>

    <v-btn icon variant="outlined" @click="$emit('prev')" :disabled="week <= 0">
      <v-icon>mdi-skip-previous</v-icon>
    </v-btn>

    <v-btn icon variant="outlined" @click="$emit('next')" :disabled="week >= maxWeek">
      <v-icon>mdi-skip-next</v-icon>
    </v-btn>

    <v-btn variant="text" @click="$emit('reset')">
      <v-icon class="mr-1">mdi-restart</v-icon> Reiniciar
    </v-btn>

    <div class="ml-4 d-flex align-center" style="min-width: 260px;">
      <span class="mr-2 text-caption">Semana</span>
      <v-slider
        :model-value="week"
        :min="0"
        :max="maxWeek"
        step="1"
        class="flex-1"
        thumb-label
        @update:model-value="$emit('set-week', $event)"
      />
      <v-chip size="small" class="ml-2"> {{ week }} / {{ maxWeek }} </v-chip>
    </div>

    <div class="ml-4 d-flex align-center" style="min-width: 220px;">
      <span class="mr-2 text-caption">Velocidad</span>
      <v-select
        :model-value="speed"
        :items="velItems"
        density="compact"
        style="max-width: 140px"
        @update:model-value="$emit('set-speed', $event)"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  playing: Boolean,
  speed: { type: Number, default: 1 },
  week: { type: Number, default: 0 },
  maxWeek: { type: Number, default: 16 },
});
defineEmits(['play', 'pause', 'set-speed', 'prev', 'next', 'reset', 'set-week']);

const velItems = [
  { title: '0.5x', value: 0.5 },
  { title: '1x', value: 1 },
  { title: '1.5x', value: 1.5 },
  { title: '2x', value: 2 },
];
</script>