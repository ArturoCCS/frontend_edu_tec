<template>
  <div class="subjects-panel">
    <div class="panel-header">
      <v-icon class="mr-2">mdi-bookshelf</v-icon>
      <span class="title">Materias del semestre</span>
      <v-spacer />
      <v-switch
        v-model="soloConEventos"
        inset
        color="primary"
        :label="`Mostrar sólo con eventos en semana ${activeWeek}`"
        class="mr-2"
      />
    </div>

    <div class="grid">
      <SubjectCard
        v-for="card in cards"
        :key="card.materiaId"
        :materia-id="card.materiaId"
        :unidades="card.unidades"
        @open-detail="$emit('open-detail', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import SubjectCard from './SubjectCard.vue';

const props = defineProps({
  history: { type: Array, default: () => [] },
  activeWeek: { type: Number, default: 0 }
});
defineEmits(['open-detail']);

const soloConEventos = ref(true);

const cards = computed(() => {
  const current = props.history.find(h => h.week === props.activeWeek);
  const eventos = current ? current.eventos : [];

  const map = new Map();
  eventos.forEach(ev => {
    if (!map.has(ev.materiaId)) map.set(ev.materiaId, []);
    map.get(ev.materiaId).push(ev);
  });

  if (!soloConEventos.value && props.history.length) {
    const allMaterias = new Set();
    props.history.forEach(h => h.eventos.forEach(ev => allMaterias.add(ev.materiaId)));
    allMaterias.forEach(mid => {
      if (!map.has(mid)) map.set(mid, []);
    });
  }

  return Array.from(map.entries()).map(([materiaId, unidades]) => ({
    materiaId,
    unidades: unidades.sort((a,b) => a.unidadIndex - b.unidadIndex)
  })).sort((a,b) => a.materiaId.localeCompare(b.materiaId));
});
</script>

<style scoped>
.subjects-panel { background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 12px; }
.panel-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.title { font-weight: 700; font-size: 14px; color: #0F172A; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
</style>