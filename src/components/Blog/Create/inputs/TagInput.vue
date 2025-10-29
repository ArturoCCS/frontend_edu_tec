<template>
  <div class="tag-input">
    <div class="tags">
      <span v-for="(t,i) in internal" :key="t" class="tag">
        <span class="t">{{ t }}</span>
        <button type="button" class="x" @click="remove(i)" aria-label="Eliminar">×</button>
      </span>
      <input
        v-model="draft"
        :placeholder="placeholder"
        class="tags-input"
        @keydown="onKeydown"
        @blur="commit(true)"
        @input="onInput"
        :list="listId"
        autocomplete="off"
        autocapitalize="none"
        spellcheck="false"
      />
      <datalist :id="listId">
        <option v-for="s in filteredSuggestions" :key="s" :value="s"></option>
      </datalist>
    </div>
    <div class="hint" v-if="max">({{ internal.length }}/{{ max }})</div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  suggestions: { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Añade tags…' },
  max: { type: Number, default: 8 }
})
const emit = defineEmits(['update:modelValue'])

const draft = ref('')
const internal = ref([...props.modelValue])
const listId = `tag-suggestions-${Math.random().toString(36).slice(2,8)}`

watch(() => props.modelValue, (v) => { internal.value = [...(v || [])] }, { deep: true })
watch(internal, (v) => emit('update:modelValue', v), { deep: true })

const normalizedSet = computed(() => new Set(internal.value.map(n => normalize(n))))

const filteredSuggestions = computed(() => {
  const q = normalize(draft.value)
  const base = (props.suggestions || []).map(String)
  if (!q) return base.slice(0, 50)
  return base.filter(s => normalize(s).includes(q)).slice(0, 50)
})

function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function addTag(raw) {
  const v = normalize(raw)
  if (!v) return
  if (props.max && internal.value.length >= props.max) return
  if (normalizedSet.value.has(v)) return
  internal.value.push(v)
  draft.value = ''
}

function commit(fromBlur = false) {
  if (!draft.value && fromBlur) return
  if (!draft.value) return
  addTag(draft.value)
}

function remove(i) { internal.value.splice(i, 1) }

function onInput() {
  if (draft.value?.includes(',')) {
    const parts = draft.value.split(',').map(p => p.trim()).filter(Boolean)
    parts.forEach(p => addTag(p))
    draft.value = ''
  }
}

function onKeydown(e) {
  if (e.key === 'Enter' || e.key === 'Tab' || e.key === ',') {
    e.preventDefault()
    commit()
  }
}
</script>

<style scoped>
.tag-input { display: grid; gap: 6px; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag {
  display: inline-flex; align-items: center; gap: 6px;
  background: #eef2ff; color: #111827; border: 1px solid #c7d2fe;
  padding: 4px 8px; border-radius: 999px; font-size: 13px;
}
.tag .x { border: none; background: transparent; color: #475569; cursor: pointer; font-size: 14px; line-height: 1; }
.tags-input { flex: 1 1 180px; min-width: 160px; border: 0; outline: 0; background: transparent; padding: 6px 8px; color: #0b1220; }
.hint { color: #64748b; font-size: 12px; }
</style>