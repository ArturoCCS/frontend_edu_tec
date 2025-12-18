<template>
  <div class="subject-card" role="button" @click="$emit('open-detail', materiaId)">
    <div class="subject-head">
      <div class="title">
        <v-icon size="18" color="primary">mdi-book-education-outline</v-icon>
        <span class="name" :title="materiaId">{{ materiaId }}</span>
      </div>
      <div class="meta">
        <v-chip size="x-small" variant="outlined" color="primary">{{ aprobadas }}/{{ unidades.length }} aprobadas</v-chip>
        <v-chip size="x-small" variant="flat" :color="pctColor">{{ pctLabel }}</v-chip>
      </div>
    </div>

    <div class="units">
      <div
        v-for="u in unidades"
        :key="u.unidadIndex"
        class="unit"
        :class="u.status"
        :title="unitTitle(u)"
      >
        <span class="unit-label">U{{ u.unidadIndex + 1 }}</span>
        <v-icon size="16" v-if="u.status === 'passed'" color="success">mdi-check</v-icon>
        <v-icon size="16" v-else-if="u.status === 'risk'" color="warning">mdi-alert</v-icon>
        <v-icon size="16" v-else-if="u.status === 'failed'" color="error">mdi-close</v-icon>
        <v-icon size="16" v-else color="grey">mdi-dots-horizontal</v-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  materiaId: { type: String, required: true },
  unidades: { type: Array, default: () => [] }
});
defineEmits(['open-detail']);

const aprobadas = computed(() => props.unidades.filter(u => u.status === 'passed').length);
const pctLabel = computed(() => `${Math.round((aprobadas.value / (props.unidades.length || 1)) * 100)}%`);
const pctColor = computed(() => {
  const p = aprobadas.value / (props.unidades.length || 1);
  if (p >= 0.7) return 'success';
  if (p >= 0.4) return 'warning';
  return 'error';
});
function unitTitle(u) {
  switch (u.status) {
    case 'passed': return `Unidad ${u.unidadIndex+1}: Aprobada`;
    case 'failed': return `Unidad ${u.unidadIndex+1}: Reprobada`;
    case 'risk': return `Unidad ${u.unidadIndex+1}: Riesgo`;
    case 'pending': return `Unidad ${u.unidadIndex+1}: Pendiente`;
    default: return `Unidad ${u.unidadIndex+1}: Futuro`;
  }
}
</script>

<style scoped>
.subject-card {
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 14px;
  padding: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.05);
  transition: transform .2s ease, box-shadow .2s ease;
  cursor: pointer;
  max-width: 100%;
  box-sizing: border-box;
}
.subject-card:hover { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(0,0,0,0.06); }

/* Header en grid: título a la izquierda (truncable), meta a la derecha */
.subject-head {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  min-width: 0; /* clave: permite truncar sin empujar */
}
.title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.name {
  font-weight: 700;
  color: #0F172A;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-word; /* evita empalmes raros */
}
.meta {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  min-width: 0;
  flex-wrap: nowrap;
}

/* Units grid estable y compacto */
.units {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)); /* 3 columnas estables */
  gap: 8px;
  width: 100%;
}
@media (max-width: 520px) {
  .units { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
.unit {
  height: 34px;
  line-height: 1;           /* evita alturas inconsistentes */
  border: 1px dashed #CBD5E1;
  border-radius: 10px;
  display: grid;
  grid-template-columns: 1fr 16px;
  align-items: center;
  padding: 0 6px;
  font-size: 11px;
  font-weight: 700;
  color: #334155;
  min-width: 0;             /* clave: no empujar columna */
}
.unit-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* Estados */
.unit.passed { background: #ECFDF5; border-color: #0D9488; }
.unit.risk   { background: #FEF3C7; border-color: #F59E0B; }
.unit.failed { background: #FEE2E2; border-color: #DC2626; }
.unit.pending{ background: #F8FAFC; border-color: #94A3B8; }
.unit.future { background: #F8FAFC; border-color: #CBD5E1; }
</style>