<template>
  <div
    class="blog-portfolio-container dark-surface"
    ref="root"
    @pointerdown.capture="soundStore.tryResume()"
    @wheel.capture.passive="soundStore.tryResume()"
    @keydown.capture="soundStore.tryResume()"
  >
    <header class="header">
      <div class="title-wrap">
        <div class="title-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h3.9a2.5 2.5 0 0 1 1.77.73l.82.82H18.5A2.5 2.5 0 0 1 21 8v8.5A3.5 3.5 0 0 1 17.5 20h-11A3.5 3.5 0 0 1 3 16.5V6.5Z" fill="url(#g1)"/>
            <defs><linearGradient id="g1" x1="3" y1="4" x2="21" y2="20"><stop stop-color="#7C3AED" /><stop offset="1" stop-color="#06B6D4" /></linearGradient></defs>
          </svg>
        </div>
        <div>
          <h2 class="portfolio-title">Listado de Blogs</h2>
          <p class="portfolio-subtitle">Secciones personalizadas y dinámicas</p>
        </div>
      </div>

      <div class="toolbar">
        <input v-model="q" type="search" class="portfolio-search" placeholder="Buscar por título, tema, tag..." />
      </div>
    </header>

    <div class="sections">
      <RowSlider
        v-for="sec in sectionsStore.sections"
        :key="sec.key"
        :title="sec.title"
        :items="sec.items"
        :cell-width="'clamp(280px, 30vw, 340px)'"
        :step-factor="0.9"
        :min-step="320"
        :always-show-edges="false"
        :end-padding-right="'clamp(10px, 4vw, 30px)'"
        v-sfx:appear.sequence="{
          items: sec.items?.length || 10,
          totalMs: 360,
          startDelayMs: 70,
          groupMin: 1,
          groupMax: 3,
          jitterMs: 22,
          rateFrom: 1.00,
          rateTo: 1.14,
          volumeFrom: 0.60,
          volumeTo: 0.9
        }"
        v-sfx:tick.scroll="{ stepPx: 180, minGapMs: 70 }"
      >
        <template #card="{ item, index }">
          <div class="reveal" :style="{ '--d': revealDelay(sec.key, index) + 'ms' }">
            <TemplateSelector
              :template="templateFor(item)"
              :title="item.Titulo || item.title"
              :description="item.Descripcion || item.description"
              :author="item.Autor"
              :date="formatDate(item.Fecha_Creacion || item.createdAt)"
              :colors="colorFor(item.Titulo || item.title || item.ID_Blog || item.id || index)"
              :to="blogBaseUrl + (item.ID_Blog || item.id)"
            />
          </div>
        </template>
      </RowSlider>
    </div>
  </div>
</template>

<script setup>
import { useSectionsStore } from '@/stores/sectionsStore'
import { useSoundStore } from '@/stores/soundStore'
import { colorFor } from '@/utils/palette'
import { makePlacementPlan } from '@/utils/placementWave'
import { sfx as vSfx } from '@/utils/sfx_directive.js'
import { onMounted, ref, watch } from 'vue'
import TemplateSelector from './ListBlogs/FolderRenderer.vue'
import RowSlider from './ListBlogs/RowSlider.vue'

const blogBaseUrl = import.meta.env.VITE_BLOG_URL || '/blogs/'
const VITE_APP_URL_BACKEND = import.meta.env.VITE_APP_URL_BACKEND
const sectionsStore = useSectionsStore()
const soundStore = useSoundStore()

const q = ref('')

const plans = ref(new Map())
function buildPlans() {
  const m = new Map()
  for (const sec of sectionsStore.sections || []) {
    const plan = makePlacementPlan({
      itemsCount: sec.items?.length || 0,
      totalMs: 360,
      startDelayMs: 70,
      jitterMs: 22,
      groupMin: 1,
      groupMax: 3,
      accelK: 1.35
    })
    const delays = []
    let pos = 0
    plan.scheduleMs.forEach((ms, i) => {
      const g = plan.groupSizes[i]
      for (let k = 0; k < g && pos < (sec.items?.length || 0); k++) {
        delays[pos] = Math.max(0, Math.round(ms))
        pos++
      }
    })
    m.set(sec.key, delays)
  }
  plans.value = m
}
function revealDelay(secKey, index) {
  const d = plans.value.get(secKey)?.[index]
  return typeof d === 'number' ? d : 0
}

const TEMPLATES = ['classic', 'glass']
function hashStr(s) { s = String(s || ''); let h = 0; for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0 } return Math.abs(h) }
function pickTemplateFor(item) { const key = item?.ID_Blog || item?.id || item?.Titulo || item?.title ||  item?.id_usuario || JSON.stringify(item); return TEMPLATES[hashStr(key) % TEMPLATES.length] }
function templateFor(item) { return pickTemplateFor(item) }
function formatDate(d) { if (!d) return ''; const date = new Date(String(d).replace(' ', 'T')); return date.toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) }


async function fetchAuthorName(id_usuario) {
  const res = await fetch(`${VITE_APP_URL_BACKEND}/user/${id_usuario}`);
  if (!res.ok) return "Autor desconocido";
  const data = await res.json();
  return data.nombre || "Autor desconocido";
}

async function enrichAuthors() {
  for (const sec of sectionsStore.sections || []) {
    if (sec.items) {
      await Promise.all(
        sec.items.map(async (item) => {
          if (!item.Autor && item.id_usuario) {
            item.Autor = await fetchAuthorName(item.id_usuario)
          }
        })
      )
    }
  }
}

let t = 0
watch(q, (val) => {
  clearTimeout(t)
  t = setTimeout(() => {
    sectionsStore.setQuery(val)
    sectionsStore.fetchSections({ q: val })
  }, 250)
})
onMounted(async () => {
  await sectionsStore.fetchSections()
  await enrichAuthors()
  soundStore.ensureAudio()
  soundStore.loadSounds()
  soundStore.resumeOnFirstInteraction()
})

watch(
  () => sectionsStore.sections,
  async () => {
    buildPlans()
    await enrichAuthors()
  },
  { deep: true, immediate: true }
)
</script>

<style scoped>
.dark-surface { min-height: 100%; padding: 32px 10px 56px 40px; }
.header { display: grid; gap: 12px; margin-bottom: 14px; }
.title-wrap { display: flex; align-items: center; gap: 12px; }
.title-icon { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 10px; background: linear-gradient(160deg, rgba(124,58,237,.24), rgba(14,165,233,.18)); box-shadow: 0 6px 24px rgba(79,70,229,.16) inset, 0 1px 0 rgba(255,255,255,.06); }
.portfolio-title { margin: 0; font-size: 24px; font-weight: 700; }
.portfolio-subtitle { margin: 2px 0 0; color: #64748b; font-size: 13px; }
.toolbar { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.portfolio-search { width: min(520px, 100%); background: white; border: 1px solid #1f2937; border-radius: 12px; color: #0b1220; padding: 10px 12px; }

.sections { display: grid; gap: 28px; }

.reveal { animation: rIn .22s ease-out both; }
@keyframes rIn { from{opacity:0; transform: translateY(6px) scale(0.98);} to{opacity:1; transform:none;} }
</style>