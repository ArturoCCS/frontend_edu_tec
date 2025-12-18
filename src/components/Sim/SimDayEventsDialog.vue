<template>
  <v-dialog v-model="model" max-width="640">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-calendar-clock</v-icon>
        Eventos del {{ formattedDate }}
      </v-card-title>
      <v-card-text>
        <div v-if="!events || !events.length" class="text-caption text-grey">
          No hay eventos para esta fecha.
        </div>
        <v-list v-else density="compact">
          <v-list-item
            v-for="(ev, i) in events"
            :key="i"
          >
            <template #prepend>
              <v-icon :color="ev.paso ? 'success' : ev.scoreFinal >= 0.5 ? 'warning' : 'error'">
                {{ ev.paso ? 'mdi-check-circle' : ev.scoreFinal >= 0.5 ? 'mdi-alert-circle' : 'mdi-close-circle' }}
              </v-icon>
            </template>
            <v-list-item-title>{{ ev.materiaId }} — Unidad {{ ev.unidadIndex + 1 }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ (ev.scoreFinal*100).toFixed(0) }}% · {{ ev.detalle || (ev.paso ? 'Aprobada' : ev.scoreFinal>=0.5 ? 'Riesgo' : 'Reprobada') }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="$emit('update:modelValue', false)">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  date: { type: Date, default: null },
  events: { type: Array, default: () => [] }
});
const emit = defineEmits(['update:modelValue']);

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
});
const formattedDate = computed(() => props.date ? props.date.toLocaleDateString() : '');
</script>