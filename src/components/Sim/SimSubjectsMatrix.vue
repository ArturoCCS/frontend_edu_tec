<template>
  <div class="subjects-matrix">
    <div class="section-head">
      <div class="left">
        <v-icon class="mr-2" color="primary">mdi-bookshelf</v-icon>
        <span class="title">Materias</span>
      </div>
      <div class="right">
        <v-chip size="x-small" variant="outlined">{{ materias.length }} materias</v-chip>
      </div>
    </div>

    <div class="grid">
      <SimSubjectMatrixCard
        v-for="m in materias"
        :key="m.materiaId"
        :materia-id="m.materiaId"
        :unidades="m.unidades"
        @open-detail="$emit('open-detail', m.materiaId)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import SimSubjectMatrixCard from './SimSubjectMatrixCard.vue';

const props = defineProps({
  materiaUnidadStates: { type: Object, required: true },
  totalesPorMateria: { type: Object, default: () => ({}) }
});
defineEmits(['open-detail']);

const materias = computed(() => {
  return Object.entries(props.materiaUnidadStates).map(([materiaId, unidadMap]) => {
    const total = props.totalesPorMateria[materiaId] || Object.keys(unidadMap).length || 6;
    const unidades = [];
    for (let i = 0; i < total; i++) {
      const cell = unidadMap[i] || { status: 'future' };
      unidades.push({ unidadIndex: i, ...cell });
    }
    return { materiaId, unidades };
  }).sort((a,b) => a.materiaId.localeCompare(b.materiaId));
});
</script>

<style scoped>
.subjects-matrix { display:flex; flex-direction:column; gap:10px; min-width:0; }
.section-head { display:flex; align-items:center; justify-content:space-between; }
.left { display:flex; align-items:center; gap:8px; }
.title { font-weight: 800; color: #0F172A; }

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  width: 100%;
  min-width: 0;
}
@media (min-width: 1500px) {
  .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 860px) {
  .grid { grid-template-columns: 1fr; }
}
</style>