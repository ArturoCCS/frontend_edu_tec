<template>
  <div class="cards-root">
    <h2 class="title">{{ flashcards.title || 'Tarjetas de Memorización' }}</h2>
    <div class="deck">
      <div v-for="(c, i) in flashcards.cards" :key="i" class="card" @click="toggle(i)">
        <div class="face" v-if="!shown[i]">Q: {{ c.q }}</div>
        <div class="face answer" v-else>A: {{ c.a }}</div>
      </div>
    </div>
    <div class="actions"><button class="btn" @click="$emit('cancel')">Cerrar</button></div>
  </div>
</template>
<script setup lang="ts">
import type { Flashcards } from '@/utils/aiSchemas';
import { reactive } from 'vue';
const props = defineProps<{ flashcards: Flashcards }>()
const shown = reactive<Record<number, boolean>>({})
function toggle(i:number){ shown[i] = !shown[i] }
</script>
<style scoped>
.cards-root{padding:8px}.title{margin:0 0 8px}.deck{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px}
.card{border:1px solid #e5e7eb;border-radius:10px;padding:14px;cursor:pointer;min-height:100px;display:grid;place-items:center;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.06)}
.face{font-weight:600;color:#111827;text-align:center}.face.answer{color:#2563eb}.actions{margin-top:10px}.btn{padding:6px 12px;border:1px solid #d1d5db;border-radius:8px;background:#fff;cursor:pointer}
</style>