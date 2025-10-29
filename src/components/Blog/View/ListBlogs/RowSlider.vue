<template>
  <section class="row-slider">
    <header class="row-header" v-if="title">
      <h3 class="row-title">{{ title }}</h3>
    </header>

    <div
      class="viewport"
      ref="viewport"
      @keydown="onKeydown"
      role="region"
      :aria-label="title || 'Carrusel'"
      tabindex="0"
    >
      <button
        class="side-nav left"
        v-show="!atStart"
        :disabled="atStart"
        aria-label="Desplazar a la izquierda"
        @pointerdown.stop
        @click.stop.prevent="scrollByStep(-1)"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>

      <div
        class="track"
        ref="track"
        :class="{ dragging: isDragging }"
        :style="{ gap: gapCss, scrollSnapType: snapTypeCss, '--end-pad': endPadCss }"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @pointerleave="onPointerUp"
        @scroll.passive="onScroll"
      >
        <div
          v-for="(item, index) in items"
          :key="item?.id ?? index"
          class="cell"
          :style="{ width: cellWidth }"
          :class="{ skeleton: isSkeleton(item) }"
          :aria-label="title ? `${title} - elemento ${index + 1}` : `Elemento ${index + 1}`"
          role="group"
        >
          <slot name="card" :item="item" :index="index">
            <div class="card-skeleton"></div>
          </slot>
        </div>
      </div>

      <button
        class="side-nav right"
        v-show="!atEnd"
        :disabled="atEnd"
        aria-label="Desplazar a la derecha"
        @pointerdown.stop
        @click.stop.prevent="scrollByStep(1)"
      >
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
</svg>
      </button>

      <div v-if="!alwaysShowEdges" class="edge left" :class="{ hide: atStart }"></div>
      <div v-if="!alwaysShowEdges" class="edge right" :class="{ hide: atEnd }"></div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  items: { type: Array, default: () => [] },
  cellWidth: { type: String, default: 'clamp(240px, 28vw, 320px)' },
  gap: { type: [Number, String], default: 14 },
  stepFactor: { type: Number, default: 0.9 },
  minStep: { type: Number, default: 320 },
  alwaysShowEdges: { type: Boolean, default: false },
  snapAlign: { type: String, default: 'start' },
  endPaddingRight: { type: [Number, String], default: 0 }
})

const viewport = ref(null)
const track = ref(null)

const gapCss = computed(() => (typeof props.gap === 'number' ? `${props.gap}px` : props.gap))
const snapTypeCss = computed(() => 'x mandatory')
const endPadCss = computed(() =>
  typeof props.endPaddingRight === 'number' ? `${props.endPaddingRight}px` : props.endPaddingRight
)

const atStart = ref(true)
const atEnd = ref(false)

let raf = 0
function schedule(fn) { cancelAnimationFrame(raf); raf = requestAnimationFrame(fn) }

function updateEdgeState() {
  const el = track.value
  if (!el) return
  const EPS = 2
  const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth)
  const sl = Math.max(0, Math.min(el.scrollLeft, maxScroll))
  const canScroll = maxScroll > EPS
  atStart.value = !canScroll || sl <= EPS
  atEnd.value = !canScroll || (maxScroll - sl) <= EPS
}

function onScroll() { schedule(updateEdgeState) }

let scrollEndFallback = null
function onScrollEnd() {
  updateEdgeState()
  if (scrollEndFallback) { clearTimeout(scrollEndFallback); scrollEndFallback = null }
}

const DRAG_THRESHOLD = 8
let pointerActive = false
let isDragging = ref(false)
let startX = 0
let startScrollLeft = 0
let capturedId = null

function onPointerDown(e) {
  if (!(e.pointerType === 'mouse' || e.pointerType === 'touch' || e.pointerType === 'pen')) return
  pointerActive = true
  isDragging.value = false
  capturedId = null
  startX = e.clientX
  startScrollLeft = track.value.scrollLeft
}

function onPointerMove(e) {
  if (!pointerActive) return
  const dx = e.clientX - startX
  if (!isDragging.value && Math.abs(dx) > DRAG_THRESHOLD) {
    isDragging.value = true
    capturedId = e.pointerId
    track.value.setPointerCapture?.(capturedId)
    track.value.style.scrollBehavior = 'auto'
  }
  if (isDragging.value) {
    track.value.scrollLeft = startScrollLeft - dx
  }
}

function onPointerUp(e) {
  if (!pointerActive) return
  pointerActive = false
  if (capturedId != null) {
    track.value.releasePointerCapture?.(capturedId)
    capturedId = null
  }
  track.value.style.scrollBehavior = ''
  isDragging.value = false
  schedule(updateEdgeState)
}

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)) }

function measureStep() {
  const el = track.value
  if (!el) return props.minStep
  const viewportW = el.clientWidth
  let step = Math.floor(viewportW * props.stepFactor)
  step = clamp(step, props.minStep, Math.max(props.minStep, el.clientWidth))
  return step
}

function scrollByStep(dir = 1) {
  const el = track.value
  if (!el) return
  const step = measureStep()
  const target = clamp(el.scrollLeft + dir * step, 0, el.scrollWidth - el.clientWidth)
  el.scrollTo({ left: target, behavior: 'smooth' })
  if ('onscrollend' in el) {
  } else {
    if (scrollEndFallback) clearTimeout(scrollEndFallback)
    scrollEndFallback = setTimeout(onScrollEnd, 350)
  }
}

function onKeydown(e) {
  if (e.key === 'ArrowLeft') { e.preventDefault(); if (!atStart.value) scrollByStep(-1) }
  if (e.key === 'ArrowRight') { e.preventDefault(); if (!atEnd.value) scrollByStep(1) }
}

function isSkeleton(item) {
  return !item || (Object.keys(item).length === 0 && item.constructor === Object)
}

let resizeObs, mutObs
onMounted(async () => {
  await nextTick()
  track.value.scrollLeft = 0
  updateEdgeState()

  resizeObs = new ResizeObserver(updateEdgeState)
  if (track.value) resizeObs.observe(track.value)
  if (viewport.value) resizeObs.observe(viewport.value)

  mutObs = new MutationObserver(() => schedule(updateEdgeState))
  if (track.value) {
    mutObs.observe(track.value, { childList: true, subtree: true, attributes: true })
  }

  track.value.addEventListener?.('scrollend', onScrollEnd, { passive: true })
  setTimeout(updateEdgeState, 100)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  resizeObs?.disconnect?.()
  mutObs?.disconnect?.()
  track.value?.removeEventListener?.('scrollend', onScrollEnd)
  if (scrollEndFallback) clearTimeout(scrollEndFallback)
})

watch(() => props.items?.length, async () => {
  await nextTick()
  updateEdgeState()
})
</script>

<style scoped>
.row-slider { display: grid; gap: 10px; }
.row-header { display: flex; align-items: center; justify-content: space-between; }
.row-title { margin: 0; font-size: 18px; font-weight: 700; }

.viewport { position: relative; overflow: hidden; border-radius: 12px; }

.track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  align-items: stretch;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 8px 0 12px 2px;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  cursor: grab;
  user-select: none;
  min-height: 220px;
  -webkit-user-select: none;
}
.track.dragging { cursor: grabbing; }
.track::-webkit-scrollbar { display: none; }

.cell { scroll-snap-align: var(--snap-align, start); scroll-snap-stop: always; }

.track > .cell:last-child { margin-right: var(--end-pad, 0px); }

.cell.skeleton .card-skeleton {
  width: 100%;
  height: 180px;
  border-radius: 12px;
  background: linear-gradient(90deg, #acb3c4, #acb3c4 40%, #acb3c4 80%);
  animation: pulse 1.6s infinite ease;
}

.side-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  width: 44px;
  height: 56px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: rgba(65, 66, 74, 0.276);
  border: 1px solid rgba(174, 195, 224, 0.9);
  color: #c1c1f7;
  cursor: pointer;
  transition: transform 0.12s ease, background-color 0.12s ease, opacity 0.2s ease;
  backdrop-filter: blur(20px);
}
.side-nav.left { left: 0; }
.side-nav.right { right: 0; }
.side-nav:hover { transform: translateY(-50%) scale(1.05);  }
.side-nav:focus-visible { outline: 2px solid #60a5fa; outline-offset: 2px; }
.side-nav[disabled] { opacity: .35; cursor: default; }

@media (hover: hover) {
  .viewport .side-nav {
    opacity: 0;
    pointer-events: none;
  }
  .viewport:hover .side-nav,
  .viewport:focus-within .side-nav,
  .side-nav:focus-visible {
    opacity: 1;
    pointer-events: auto;
  }
}

.edge {
  pointer-events: none;
  position: absolute;
  top: 0; bottom: 0;
  width: 36px;
  transition: opacity 0.2s ease;
  z-index: 1;
}
.edge.left { left: 0; background: linear-gradient(90deg, rgba(92, 107, 145, 0.233), rgba(13, 18, 32, 0)); }
.edge.right { right: 0; background: linear-gradient(270deg, rgba(92, 107, 145, 0.233), rgba(7, 67, 234, 0)); }
.edge.hide { opacity: 0; }

@keyframes pulse {
  0% { filter: brightness(1); }
  50% { filter: brightness(1.15); }
  100% { filter: brightness(1); }
}
</style>