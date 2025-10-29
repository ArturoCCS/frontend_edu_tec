<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal">
      <h3>Proponer nueva {{ label }}</h3>
      <form @submit.prevent="submit">
        <div class="field">
          <label class="label">Nombre</label>
          <input v-model="name" class="control" placeholder="Ej: Ingeniería Biomédica" />
        </div>
        <div class="field">
          <label class="label">Descripción (opcional)</label>
          <textarea v-model="description" class="control" rows="3" placeholder="¿Por qué debería agregarse?"></textarea>
        </div>
        <div class="actions">
          <button type="button" class="btn ghost" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="btn primary" :disabled="submitting || !name.trim()">Enviar</button>
        </div>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { api } from '@/lib/api'
import { computed, ref } from 'vue'

const props = defineProps({ type: { type: String, required: true } })
const emit = defineEmits(['close','submitted'])

const label = computed(() => props.type === 'career' ? 'carrera' : props.type === 'subject' ? 'materia' : 'tema')
const name = ref('')
const description = ref('')
const submitting = ref(false)
const error = ref(null)

function slugify(s) {
  return String(s).toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu,'')
    .replace(/[^a-z0-9\s-]/g,' ')
    .trim().replace(/\s+/g,'-').slice(0,120)
}

async function submit() {
  submitting.value = true; error.value = null
  try {
    await api.post('/api/catalog/suggest', {
      type: props.type,
      name: name.value.trim(),
      slug: slugify(name.value),
      description: description.value || ''
    })
    emit('submitted')
    emit('close')
  } catch (e) {
    error.value = e?.response?.data?.error || e?.message || 'No se pudo enviar la propuesta'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.28); display:grid; place-items:center; z-index:3000; }
.modal { width:min(520px, 94vw); background:#fff; border-radius:12px; padding:16px; box-shadow:0 12px 32px rgba(0,0,0,.18); }
.field { display:grid; gap:6px; margin-bottom:10px; }
.label { font-size:13px; font-weight:600; color:#1f2937; }
.control { padding:10px 12px; border:1.5px solid #cbd5e1; border-radius:10px; background:#fff; font-size: 14px; }
.actions { display:flex; justify-content:flex-end; gap:8px; margin-top:8px; }
.btn { border:none; border-radius:8px; padding:8px 12px; cursor:pointer; }
.btn.primary { background:#2563eb; color:#fff; }
.btn.ghost { background:#eef2ff; color:#1f2937; }
.error { color:#b91c1c; font-size:13px; margin-top:8px; }
</style>