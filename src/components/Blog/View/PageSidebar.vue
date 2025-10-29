<template>
  <div class="sidebar-content">
    <h3>En este capítulo</h3>
    <div class="sidebar-notes-container">
      <ul class="tab-notes-list">
        <li v-for="(seccion, i) in secciones" :key="seccion.ID_Seccion" 
            :class="`tab-note tab-color-${i % 5}`">
          <span class="tab-note-title">{{ seccion.Titulo }}</span>
          <a :href="`#seccion-${seccion.ID_Seccion}`" class="tab-note-link"
            @click.prevent="scrollToSeccion(seccion.ID_Seccion)"></a>
        </li>
      </ul>
    </div>
    <hr />

  </div>
</template>
<script setup>
const props = defineProps({
  secciones: { type: Array, default: () => [] }
})

function scrollToSeccion(id) {
  const el = document.getElementById('seccion-' + id)
  if (el) {
    const yOffset = -60
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
    window.location.hash = 'seccion-' + id
  }
}
</script>