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