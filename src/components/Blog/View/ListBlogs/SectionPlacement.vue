<template>
  <div ref="rootEl" class="section-wrap">
    <RowSlider
      :title="title"
      :items="items"
      :cell-width="'clamp(240px, 30vw, 340px)'"
      :step-factor="0.9"
      :min-step="320"
      :always-show-edges="false"
      :end-padding-right="'clamp(10px, 4vw, 30px)'"
    >
      <template #card="{ item, index }">
        <div class="card-reveal" :class="{ 'is-revealed': revealed[index] }">
          <div v-if="revealed[index]" class="card-content">
            <FolderRenderer
              :template="templateFor(item, index)"
              :title="item.title"
              :description="item.description"
              :author="autorNombres[item.authorId] || 'Autor desconocido'"
              :date="formatDate(item.createdAt)"
              :colors="colorFor(item.title || item.id || index)"
              :to="blogBaseUrl + item.id"
            />
          </div>
          <div v-else class="card-skeleton" />
        </div>
      </template>
    </RowSlider>
  </div>
</template>

<script setup>
import { useSoundStore } from '@/stores/soundStore'
import { colorFor } from '@/utils/palette'
import { makePlacementPlan } from '@/utils/placementWave'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import FolderRenderer from './FolderRenderer.vue'
import RowSlider from './RowSlider.vue'

const props = defineProps({
  title: { type: String, required: true },
  items: { type: Array, required: true },
  sectionKey: { type: String, required: true },
  autorNombres: { type: Object, required: true },
  blogBaseUrl: { type: String, required: true },
  waveOptions: {
    type: Object,
    default: () => ({
      totalMs: 360,
      startDelayMs: 70,
      groupMin: 1,
      groupMax: 3,
      jitterMs: 24,
      accelK: 1.35,
      rateFrom: 1.00,
      rateTo: 1.14,
      volumeFrom: 0.62,
      volumeTo: 0.88,
      sound: 'appear'
    })
  },
  folderVariant: { type: String, default: 'auto' }
})

const blogBaseUrl = props.blogBaseUrl

const TEMPLATES = ['classic', 'glass', 'neon', 'paper']
function hashStr(s) { s = String(s || ''); let h = 0; for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0 } return Math.abs(h) }
function pickTemplateFor(item) {
  const key = item?.id || item?.title || JSON.stringify(item)
  const idx = hashStr(key) % TEMPLATES.length
  return TEMPLATES[idx]
}
function templateFor(item) {
  return props.folderVariant === 'auto' ? pickTemplateFor(item) : props.folderVariant
}
function formatDate(d) {
  if (!d) return ''
  const date = new Date(String(d).replace(' ', 'T'))
  return date.toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
}

const revealed = ref([])
const rootEl = ref(null)
let timeouts = new Set()
let observer = null
let hasStarted = false

function clearTimers() {
  timeouts.forEach(id => clearTimeout(id))
  timeouts.clear()
}
function resetReveal() {
  clearTimers()
  revealed.value = Array.from({ length: props.items.length }, () => false)
  hasStarted = false
}
function startWave() {
  if (hasStarted) return
  hasStarted = true

  const plan = makePlacementPlan({
    itemsCount: props.items.length,
    groups: undefined,
    groupMin: props.waveOptions.groupMin,
    groupMax: props.waveOptions.groupMax,
    totalMs: props.waveOptions.totalMs,
    startDelayMs: props.waveOptions.startDelayMs,
    jitterMs: props.waveOptions.jitterMs,
    accelK: props.waveOptions.accelK
  })

  let pos = 0
  plan.scheduleMs.forEach((ms, i) => {
    const t = setTimeout(() => {
      const count = plan.groupSizes[i]
      for (let k = 0; k < count && pos < props.items.length; k++) {
        revealed.value[pos] = true
        pos++
      }
    }, Math.max(0, Math.round(ms)))
    timeouts.add(t)
  })

  const sound = useSoundStore()
  sound.playPlacementWave({
    sound: props.waveOptions.sound,
    items: props.items.length,
    groups: plan.scheduleMs.length,
    groupMin: props.waveOptions.groupMin,
    groupMax: props.waveOptions.groupMax,
    totalMs: props.waveOptions.totalMs,
    startDelayMs: props.waveOptions.startDelayMs,
    jitterMs: props.waveOptions.jitterMs,
    rateFrom: props.waveOptions.rateFrom,
    rateTo: props.waveOptions.rateTo,
    volumeFrom: props.waveOptions.volumeFrom,
    volumeTo: props.waveOptions.volumeTo
  })
}

function setupObserver() {
  if (!rootEl.value) return
  observer = new IntersectionObserver((entries, obs) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        startWave()
        obs.disconnect()
        observer = null
        break
      }
    }
  }, { root: null, threshold: 0.12, rootMargin: '120px' })
  observer.observe(rootEl.value)
}

onMounted(() => {
  resetReveal()
  setupObserver()
})

onBeforeUnmount(() => {
  clearTimers()
  if (observer) {
    observer.disconnect()
    observer = null
  }
})

watch(() => props.items, () => {
  resetReveal()
  if (!rootEl.value) return
  const rect = rootEl.value.getBoundingClientRect()
  const inView = rect.top < (window.innerHeight + 120) && rect.bottom > -120
  if (inView) startWave()
  else setupObserver()
}, { deep: true })
</script>

<style scoped>
.section-wrap {
  opacity: 0;
  transform: translateY(6px);
  animation: sectionIn .36s ease-out forwards;
}
@keyframes sectionIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.card-reveal { position: relative; width: 100%; height: 100%; }
.card-content {
  animation: cardIn .22s ease-out both;
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(6px) scale(0.98); filter: blur(0.4px); }
  to   { opacity: 1; transform: translateY(0)   scale(1);    filter: blur(0); }
}

.card-skeleton {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: linear-gradient(90deg,#0f172a, #111827 40%, #0f172a 80%);
  animation: skPulse 1.2s infinite ease;
  box-shadow: 0 1px 0 rgba(255,255,255,0.04) inset, 0 6px 24px rgba(0,0,0,0.16) inset;
}
@keyframes skPulse {
  0%{ filter:brightness(1) }
  50%{ filter:brightness(1.12) }
  100%{ filter:brightness(1) }
}
</style>