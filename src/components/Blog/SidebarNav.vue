<template>
  <ul class="space-y-4">
    <li v-for="capitulo in capitulos" :key="capitulo.ID_Capitulo" :class="[
      'capitulos-item',
      capituloSeleccionado && capituloSeleccionado.ID_Capitulo === capitulo.ID_Capitulo ? 'capitulo-activo' : ''
    ]">
      <button @click="emitirSeleccion(capitulo)" class="capitulo-btn">
        {{ capitulo.Titulo }}
      </button>
    </li>
  </ul>
</template>

<script setup>
const props = defineProps({
  capitulos: { type: Array, required: true },
  capituloSeleccionado: { type: Object, default: null }
})

const emit = defineEmits(['capituloSeleccionado'])

function emitirSeleccion(capitulo) {
  emit('capituloSeleccionado', capitulo)
}
</script>

<style scoped>
.capitulos-item {
  list-style: none;
  margin: 5px;
  color: #818896;
  border-radius: 0.375rem;
  padding: 0;
  transition: background 0.15s;
  font-weight: 600;
  padding-right: 50px;
}

.capitulo-activo {
  background-color: #f0f7ff;
  color: #006be6;

}

.capitulo-btn {
  width: 100%;
  text-align: left;
  padding: 6px 8px;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 0.9em;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.capitulos-item:not(.capitulo-activo):hover,
.capitulos-item:not(.capitulo-activo):focus-within {
  background-color: #eff0f1;
  color: #232629;
}
</style>