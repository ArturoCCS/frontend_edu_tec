<template>
  <div class="viewer-root">
    <template v-if="capitulo">
      <EditorJs
        v-if="capJson"
        :key="`viewer-capitulo-${capitulo.ID_Capitulo}`"
        :holder="`viewer-capitulo-${capitulo.ID_Capitulo}`"
        :modelValue="capJson"
        :readOnly="true"
        :autofocus="false"
        class="reader-surface"
      />

      <div
        v-for="seccion in (capitulo.secciones || [])"
        :key="seccion.ID_Seccion"
        :id="`seccion-${seccion.ID_Seccion}`"
        class="reader-surface"
      >
        <EditorJs
          v-if="secJson(seccion)"
          :key="`viewer-seccion-${seccion.ID_Seccion}`"
          :holder="`viewer-seccion-${seccion.ID_Seccion}`"
          :modelValue="secJson(seccion)"
          :readOnly="true"
          :autofocus="false"
        />
      </div>

      <ChapterPagination
        v-if="blog.Tipo === 'documentacion'"
        :capitulos="capitulos"
        :capituloActualId="capitulo.ID_Capitulo"
        @navigate="onNavigate"
      />
    </template>
    <p v-else class="text-gray-500">Selecciona un capítulo para ver su contenido.</p>
  </div>
</template>

<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import EditorJs from '../Create/EditorJs.vue'
import ChapterPagination from './ChapterPagination.vue'

const props = defineProps({
  blog: { type: Object, required: true },
  capitulo: { type: Object, default: null },
  capitulos: { type: Array, default: () => [] }
})

const autorNombre = ref('')

function parseEditorData(raw) {
  if (!raw) return null
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) } catch { return null }
  }
  if (typeof raw === 'object' && Array.isArray(raw.blocks)) return raw
  return null
}

const capJson = computed(() => parseEditorData(props.capitulo?.ContenidoJson ?? props.capitulo?.Contenido))
const secJson = (seccion) => parseEditorData(seccion?.ContenidoJson ?? seccion?.Contenido)

onMounted(async () => {
  if (props.blog?.id_usuario) {
    try {
      const res = await axios.get(`http://localhost:3000/user/${props.blog.id_usuario}`)
      autorNombre.value = res.data.name || res.data.nombre || 'Autor desconocido'
    } catch {
      autorNombre.value = 'Autor desconocido'
    }
  }
})

const emit = defineEmits(['navigate'])
function onNavigate(id) {
  emit('navigate', id)
}
</script>