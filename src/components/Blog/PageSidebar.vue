<template>
  <div class="sidebar-content">
    <h3>En esta página</h3>
    <div class="sidebar-notes-container">
      <ul class="tab-notes-list">
        <li v-for="(seccion, i) in secciones" :key="seccion.ID_Seccion" :class="`tab-note tab-color-${i % 5}`"
          :style="`top: ${i * 73}px;`">
          <span class="tab-note-title">{{ seccion.Titulo }}</span>
          <a :href="`#seccion-${seccion.ID_Seccion}`" class="tab-note-link"
            @click.prevent="scrollToSeccion(seccion.ID_Seccion)"></a>
        </li>
      </ul>
      <div class="notes-spacer" :style="`height: ${secciones.length * 80}px;`"></div>
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

<style scoped>
h3 {
  font-size: 1em;
  font-weight: 700;
  margin: 8px 15px;
  position: relative;
  z-index: 1;
}
hr {
  margin: 24px 0;
  border: none;
  border-top: 1px solid #e5e7eb;
}

</style>