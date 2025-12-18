<template>
  <v-dialog v-model="model" max-width="680">
    <v-card>
      <v-card-title class="bg-primary text-white">
        <v-icon class="mr-2">mdi-book-open-variant</v-icon>
        {{ materiaId }}
      </v-card-title>
      <v-card-text class="pt-4">
        <div class="info-grid">
          <div>
            <div class="label">Dificultad</div>
            <v-chip :color="difficultyColor" class="mr-2" size="small">{{ difficultyLabel }}</v-chip>
          </div>
          <div>
            <div class="label">Unidades evaluadas</div>
            <div class="value">{{ unidades.length }}</div>
          </div>
          <div>
            <div class="label">Aprobadas</div>
            <div class="value">{{ aprobadas }}/{{ unidades.length }}</div>
          </div>
        </div>

        <v-divider class="my-4" />

        <div class="units-list">
          <div v-for="u in unidades" :key="u.unidadIndex" class="unit-row" :class="unitClass(u)">
            <div class="left">
              <v-icon :color="u.paso ? 'success' : u.scoreFinal >= 0.5 ? 'warning' : 'error'">
                {{ u.paso ? 'mdi-check-circle' : u.scoreFinal >= 0.5 ? 'mdi-alert-circle' : 'mdi-close-circle' }}
              </v-icon>
              <span class="ml-2">Unidad {{ u.unidadIndex + 1 }}</span>
            </div>
            <div class="middle">{{ u.detalle }}</div>
            <div class="right">{{ (u.scoreFinal*100).toFixed(0) }}%</div>
          </div>
        </div>

        <v-alert type="info" class="mt-4" density="compact">
          Tip: Revisa las unidades con riesgo para mejorar en la siguiente semana.
        </v-alert>
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
  materiaId: String,
  unidades: { type: Array, default: () => [] },
  difficulty: { type: Number, default: 0.5 }
});
const emit = defineEmits(['update:modelValue']);

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
});

const aprobadas = computed(() => props.unidades.filter(u => u.paso).length);

const difficultyColor = computed(() => props.difficulty >= 0.7 ? 'error' : props.difficulty >= 0.4 ? 'warning' : 'success');
const difficultyLabel = computed(() => props.difficulty >= 0.7 ? 'Alta' : props.difficulty >= 0.4 ? 'Media' : 'Baja');

const unitClass = (u) => {
  if (u.paso) return 'passed';
  return u.scoreFinal >= 0.5 ? 'risk' : 'failed';
};
</script>

<style scoped>
.info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.label { font-size: 11px; color: #64748B; text-transform: uppercase; font-weight: 600; }
.value { font-size: 14px; font-weight: 700; color: #0F172A; }
.units-list { display: flex; flex-direction: column; gap: 8px; }
.unit-row { display: grid; grid-template-columns: 180px 1fr 60px; align-items: center; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 8px; font-size: 12px; }
.unit-row.passed { border-color: #0D9488; background: linear-gradient(135deg,#fff 0%,#ECFDF5 100%); }
.unit-row.risk { border-color: #F59E0B; background: linear-gradient(135deg,#fff 0%,#FEF3C7 100%); }
.unit-row.failed { border-color: #DC2626; background: linear-gradient(135deg,#fff 0%,#FEE2E2 100%); }
.left { display: flex; align-items: center; }
.middle { color: #475569; }
.right { text-align: right; font-weight: 700; }
</style>