<template>
  <div class="chatbot-root">
    <transition name="fade">
      <div v-if="open" class="chatbot-panel-wrapper">
        <ChatPanel
          :blog="blog"
          :capitulo="capitulo"
          :capitulos="capitulos"
          :logo-url="logoUrl"
          @close="open = false"
        />
      </div>
    </transition>

    <button
      class="chat-fab"
      :title="open ? 'Cerrar asistente' : 'Abrir asistente'"
      @click="open = !open"
    >
      <template v-if="!open">
        <img
          class="fab-avatar"
          src="/petirrojo.jpg"
          alt="Abrir asistente"
        />
      </template>
      <span v-else>✖</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import ChatPanel from './ChatPanel.vue';

const props = defineProps<{
  blog: any | null
  capitulos: any[]
  capitulo: any | null
  logoUrl?: string
}>()

const open = ref(false)


watch(() => props.capitulo?.ID_Capitulo, () => {
  // open.value = false
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s }
.fade-enter-from, .fade-leave-to { opacity: 0 }

.chatbot-panel-wrapper {
  position: fixed;
  bottom: 94px;
  right: 24px;
  width: min(680px, 90vw);
  height: min(70vh, 720px);
  z-index: 9999;
}

.chat-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 999px;
  border: none;
  background: #111827;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.fab-avatar {
  width: 48px;
  height: 48px;
  border-radius: 6px;
  object-fit: cover;
}
</style>