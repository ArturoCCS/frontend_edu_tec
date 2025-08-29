<template>
  <div>
    <div v-if="blog.Tipo === 'simple'">

      <div v-if="capitulo">
        <MarkdownViewer :markdown="capitulo.Descripcion" />
      </div>
    </div>
    <div v-else-if="blog.Tipo === 'documentacion'">
      <div v-if="capitulo">
        <MarkdownViewer :markdown="capitulo.Descripcion" />
        <div v-for="seccion in capitulo.secciones" :key="seccion.ID_Seccion" :id="`seccion-${seccion.ID_Seccion}`">
          <MarkdownViewer :markdown="seccion.Contenido" />
        </div>
        <ChapterPagination :capitulos="capitulos" :capituloActualId="capitulo.ID_Capitulo" @navigate="onNavigate" />
      </div>
      <div v-else>
        <p class="text-gray-500">Selecciona un capítulo para ver su contenido.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import ChapterPagination from './ChapterPagination.vue'
import MarkdownViewer from './MarkdownViewer.vue'

const props = defineProps({
  blog: { type: Object, required: true },
  capitulo: { type: Object, default: null },
  capitulos: { type: Array, default: () => [] }
})

const emit = defineEmits(['navigate'])
function onNavigate(id) {
  emit('navigate', id)
}
</script>