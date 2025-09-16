<template>
  <nav class="chapter-pagination" v-if="capitulos.length > 1">
    <button v-if="prevCapitulo" class="chapter-link prev" @click="$emit('navigate', prevCapitulo.ID_Capitulo)">
      <span class="arrow">&#x2039;</span>
      <span class="chapter-title">{{ prevCapitulo.Titulo }}</span>
    </button>
    <div class="chapter-gap"></div>
    <button v-if="nextCapitulo" class="chapter-link next" @click="$emit('navigate', nextCapitulo.ID_Capitulo)">
      <span class="chapter-title">{{ nextCapitulo.Titulo }}</span>
      <span class="arrow">&#x203A;</span>
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  capitulos: { type: Array, required: true },
  capituloActualId: { type: [String, Number], required: true }
})

const currentIdx = computed(() =>
  props.capitulos.findIndex(c => c.ID_Capitulo == props.capituloActualId)
)

const prevCapitulo = computed(() =>
  currentIdx.value > 0 ? props.capitulos[currentIdx.value - 1] : null
)
const nextCapitulo = computed(() =>
  currentIdx.value < props.capitulos.length - 1 ? props.capitulos[currentIdx.value + 1] : null
)
</script>
