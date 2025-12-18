<template>
  <v-navigation-drawer v-model="model" location="right" width="420" temporary class="detail-drawer">
    <div class="drawer-header">
      <v-icon class="mr-2">mdi-book-open-variant</v-icon>
      <span class="title">{{ materiaName || materiaId }}</span>
      <v-spacer />
      <v-btn icon size="small" variant="text" @click="model = false"><v-icon>mdi-close</v-icon></v-btn>
    </div>
    <div class="content">
      <div class="stats">
        <div class="stat">
          <div class="label">Unidades</div>
          <div class="value">{{ unidades.length }}</div>
        </div>
        <div class="stat">
          <div class="label">Aprobadas</div>
          <div class="value">{{ aprobadas }}</div>
        </div>
        <div class="stat">
          <div class="label">Progreso</div>
          <div class="value">{{ progresoPct }}%</div>
        </div>
        <div class="stat">
          <div class="label">Dificultad</div>
          <v-chip size="small" :color="difficultyColor">{{ difficultyLabel }}</v-chip>
        </div>
      </div>

      <v-divider class="my-4"/>

      <div class="units-list">
        <div
          v-for="u in unidades"
          :key="u.unidadIndex"
          class="unit-row"
          :class="u.status"
        >
          <div class="left">
            <v-icon size="20" :color="iconColor(u)">
              {{
                u.status === 'passed'
                  ? 'mdi-check-circle'
                  : u.status === 'risk'
                  ? 'mdi-alert-circle'
                  : u.status === 'failed'
                  ? 'mdi-close-circle'
                  : 'mdi-timer-sand'
              }}
            </v-icon>
            <span class="ml-2">Unidad {{ u.unidadIndex + 1 }}</span>
          </div>
          <div class="middle">
            <strong v-if="u.nombre">{{ u.nombre }}</strong>
            <span v-else>{{ statusText(u) }}</span>
            <span v-if="u.detalle" class="ml-1">• {{ u.detalle }}</span>
          </div>
          <div class="right">
            <v-chip size="x-small" :color="chipColor(u)" variant="flat">
              <span v-if="u.score !== undefined">{{ (u.score*100).toFixed(0) }}%</span>
              <span v-else>—</span>
            </v-chip>
          </div>
        </div>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  materiaId: String,
  materiaName: { type: String, default: '' },
  unidades: { type: Array, default: () => [] },
  difficulty: { type: Number, default: 0.5 }
});
const emit = defineEmits(['update:modelValue']);

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
});

const aprobadas = computed(() => props.unidades.filter(u => u.status === 'passed').length);
const progresoPct = computed(() => props.unidades.length ? (aprobadas.value / props.unidades.length * 100).toFixed(0) : '0');

const difficultyColor = computed(() => props.difficulty >= 0.7 ? 'error' : props.difficulty >= 0.4 ? 'warning' : 'success');
const difficultyLabel = computed(() => props.difficulty >= 0.7 ? 'Alta' : props.difficulty >= 0.4 ? 'Media' : 'Baja');

function chipColor(u) {
  switch (u.status) {
    case 'passed': return 'success';
    case 'risk': return 'warning';
    case 'failed': return 'error';
    case 'pending': return 'grey';
    default: return 'grey';
  }
}
function iconColor(u) { return chipColor(u); }
function statusText(u) {
  if (u.status === 'passed') return 'Aprobada';
  if (u.status === 'risk') return 'Riesgo moderado';
  if (u.status === 'failed') return 'Reprobada';
  if (u.status === 'pending') return 'Pendiente';
  return 'Futuro';
}
</script>

<style scoped>
.detail-drawer { display:flex; flex-direction:column; }
.drawer-header { display:flex; align-items:center; padding:12px 10px; font-weight:700; font-size:15px; border-bottom:1px solid #E2E8F0; }
.content { padding:14px; overflow-y:auto; }
.stats { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
.stat { background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:8px; display:flex; flex-direction:column; gap:2px; }
.label { font-size:10px; font-weight:600; color:#64748B; text-transform:uppercase; }
.value { font-size:14px; font-weight:700; color:#0F172A; }
.units-list { display:flex; flex-direction:column; gap:8px; }
.unit-row { display:grid; grid-template-columns:180px 1fr 60px; align-items:center; background:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px; padding:8px; font-size:12px; }
.unit-row.passed { border-color:#0D9488; background:linear-gradient(135deg,#fff,#ECFDF5); }
.unit-row.risk { border-color:#F59E0B; background:linear-gradient(135deg,#fff,#FEF3C7); }
.unit-row.failed { border-color:#DC2626; background:linear-gradient(135deg,#fff,#FEE2E2); }
.unit-row.pending { border-color:#94A3B8; background:#F8FAFC; }
.unit-row.future { opacity:.6; }
.left { display:flex; align-items:center; font-weight:600; color:#334155; }
.middle { color:#475569; }
.right { text-align:right; }
</style>