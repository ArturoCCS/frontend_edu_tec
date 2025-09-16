<template>
  <div class="chapter-block noselect">
    <editor-js
      :holder="`editor-capitulo-${capitulo.id}`"
      v-model="capitulo.contenido"
      class="editorjs"
      draggable="false"
    />
    
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import EditorJs from './EditorJs.vue';
defineProps(['capitulo'])
defineEmits(['eliminar', 'agregar-seccion', 'eliminar-seccion'])

function onDragStart(evt) {
  const ghost = document.createElement('div');
  ghost.style.width = '100px';
  ghost.style.height = '40px';
  ghost.style.background = 'rgba(90,90,90,0.1)';
  ghost.style.borderRadius = '8px';
  ghost.innerText = '';
  document.body.appendChild(ghost);
  evt.item._dragGhost = ghost;
  evt.dataTransfer.setDragImage(ghost, 50, 20);
}
function onDragEnd(evt) {
  if (evt.item._dragGhost) {
    document.body.removeChild(evt.item._dragGhost);
    evt.item._dragGhost = null;
  }
}

onMounted(() => {
  setTimeout(() => {
    document.querySelectorAll('.editorjs').forEach(el => {
      el.addEventListener('drop', e => e.preventDefault());
    });
  }, 500);
});
</script>

<style scoped>

</style>