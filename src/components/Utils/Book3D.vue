<template>
  <div
    class="book-3d"
    :style="sceneStyle"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
    aria-label="Libro 3D"
    role="img"
  >
    <div class="book" ref="bookEl" :style="bookStyle">
      <div class="face cover front" :style="frontCoverStyle">
        <div class="cover-content" :style="{ color: $vuetify.theme.themes.light.colors.secondary }">
          <slot name="cover">
            <div class="default-cover">
            </div>
          </slot>
        </div>
      </div>

      <div class="face cover back" :style="backCoverStyle"></div>

      <div class="face pages-front"></div>
      <div class="face pages-back"></div>

      <div class="face spine" :style="{ background: spineColor }"></div>

      <div class="face fore-edge"></div>

      <div class="face top-edge"></div>
      <div class="face bottom-edge"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  width: { type: [Number, String], default: 240 },
  height: { type: [Number, String], default: 320 },
  thickness: { type: [Number, String], default: 40 },
  coverColor: { type: String, default: '#2c3e50' },
  backCoverColor: { type: String, default: '#2c3e50' },
  spineColor: { type: String, default: '#1f2a35' },
  pagesColor: { type: String, default: '#f5f1e6' },
  edgeColor: { type: String, default: '#e7e2d6' },
  coverImage: { type: String, default: '' },
  backCoverImage: { type: String, default: '' },
  title: { type: String, default: 'Mi Libro' },
  author: { type: String, default: '' },
  hoverOpen: { type: Boolean, default: true },
  interactiveTilt: { type: Boolean, default: true },
  perspective: { type: [Number, String], default: 1200 },
  initialTiltY: { type: Number, default: -18 },
  minTiltX: { type: Number, default: -12 },
  maxTiltX: { type: Number, default: 12 },
  minTiltY: { type: Number, default: -24 },
  maxTiltY: { type: Number, default: 10 },
})

const bookEl = ref(null)
const rx = ref(0)
const ry = ref(0)

const px = (v) => (typeof v === 'number' ? `${v}px` : v)
const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

ry.value = clamp(props.initialTiltY, props.minTiltY, props.maxTiltY)

const sceneStyle = computed(() => ({
  '--book-w': px(props.width),
  '--book-h': px(props.height),
  '--book-t': px(props.thickness),
  '--border-r': px(props.borderRadius ?? 8),
  perspective: px(props.perspective)
}))

const bookStyle = computed(() => ({
  '--rx': `${rx.value}deg`,
  '--ry': `${ry.value}deg`
}))

const frontCoverStyle = computed(() => ({
  backgroundColor: props.coverColor,
  backgroundImage: props.coverImage ? `url('${props.coverImage}')` : 'none',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}))

const backCoverStyle = computed(() => ({
  backgroundColor: props.backCoverColor,
  backgroundImage: props.backCoverImage ? `url('${props.backCoverImage}')` : 'none',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}))

function onMouseMove(e) {
  if (!props.interactiveTilt || !bookEl.value) return
  const rect = bookEl.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width
  const y = (e.clientY - rect.top) / rect.height

  const ryRaw = (x - 0.5) * 2 * Math.max(Math.abs(props.minTiltY), Math.abs(props.maxTiltY))
  const rxRaw = (0.5 - y) * 2 * Math.max(Math.abs(props.minTiltX), Math.abs(props.maxTiltX))

  ry.value = clamp(ryRaw, props.minTiltY, props.maxTiltY)
  rx.value = clamp(rxRaw, props.minTiltX, props.maxTiltX)
}

function onMouseLeave() {
  if (!props.interactiveTilt) return
  rx.value = 0
  ry.value = clamp(props.initialTiltY, props.minTiltY, props.maxTiltY)
}
</script>

<style scoped>
.book-3d {
  --book-w: 240px;
  --book-h: 320px;
  --book-t: 40px;
  --w2: calc(var(--book-w) / 2);
  --h2: calc(var(--book-h) / 2);
  --t2: calc(var(--book-t) / 2);
  --open-angle: 0deg;
  --rx: 0deg;
  --ry: -18deg;
  --eps: 0.6px;
  --shadow: rgba(0, 0, 0, 0.25);
  --shadow-soft: rgba(0, 0, 0, 0.15);

  display: inline-block;
  width: var(--book-w);
  height: var(--book-h);
  position: relative;
  perspective: 1200px;
  perspective-origin: 50% 50%;
  user-select: none;
}

.book {
  position: relative;
  width: var(--book-w);
  height: var(--book-h);
  transform-style: preserve-3d;
  transform: rotateX(var(--rx)) rotateY(var(--ry));
  transition: transform 260ms cubic-bezier(.2,.8,.2,1);
  will-change: transform;
}

.face {
  position: absolute;
  left: 0;
  top: 0;
  backface-visibility: hidden;
  border-radius: var(--border-r);
}

.cover.front {
  width: var(--book-w);
  height: var(--book-h);
  transform-origin: left center;
  transform: translateZ(var(--t2)) rotateY(var(--open-angle));
  box-shadow: 3px 3px 7px 5px rgb(185, 188, 193), inset 0px 0px 0px 0px rgb(255 255 255 / 5%);
  overflow: hidden;
}

.cover.back {
  width: var(--book-w);
  height: var(--book-h);
  transform-origin: left center;
  transform: rotateY(180deg) translateZ(var(--t2));
  box-shadow:
    0 10px 25px var(--shadow-soft),
    inset 0 0 0 1px rgba(255,255,255,0.05);
}

.pages-front,
.pages-back {
  width: var(--book-w);
  height: var(--book-h);
  border-radius: calc(var(--border-r) - 1px);
  background: var(--pages-color, #f5f1e6);
  box-shadow:
    inset 0 0 0 1px rgba(0,0,0,0.05),
    inset 0 30px 40px rgba(0,0,0,0.08),
    inset 0 -20px 30px rgba(0,0,0,0.05);
  pointer-events: none;
}

.pages-front {
  transform: translateZ(calc(var(--t2) - var(--eps)));
}

.pages-back {
  transform: rotateY(180deg) translateZ(calc(var(--t2) - var(--eps)));
}

.spine {
  width: var(--book-t);
  height: var(--book-h);
  transform: rotateY(-90deg) translateZ(var(--w2));
  border-radius: var(--border-r);
  box-shadow: inset -2px 0 6px rgba(0,0,0,0.25);
}

.fore-edge {
  width: var(--book-t);
  height: var(--book-h);
  transform: rotateY(90deg) translateZ(var(--w2));
  border-radius: var(--border-r);
  background:
    linear-gradient(90deg, rgba(0,0,0,0.06), rgba(255,255,255,0.03)),
    repeating-linear-gradient(
      to bottom,
      var(--edge-color, #e7e2d6) 0,
      var(--edge-color, #e7e2d6) 2px,
      var(--pages-color, #f5f1e6) 2px,
      var(--pages-color, #f5f1e6) 6px
    );
}

.top-edge,
.bottom-edge {
  width: var(--book-w);
  height: var(--book-t);
  border-radius: var(--border-r);
  background:
    linear-gradient(180deg, rgba(0,0,0,0.05), rgba(255,255,255,0.05)),
    repeating-linear-gradient(
      to right,
      var(--edge-color, #e7e2d6) 0,
      var(--edge-color, #e7e2d6) 2px,
      var(--pages-color, #f5f1e6) 2px,
      var(--pages-color, #f5f1e6) 6px
    );
}

.top-edge {
  transform: rotateX(90deg) translateZ(calc(var(--h2) - var(--eps)));
}

.bottom-edge {
  transform: rotateX(-90deg) translateZ(calc(var(--h2) - var(--eps)));
}

.cover-content {
  position: absolute;
  inset: 0;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  text-shadow: 0 2px 8px rgba(0,0,0,0.35);
  background: linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(177, 177, 177, 0.35));
}

.default-cover .title {
  font-weight: 800;
  font-size: 1.4rem;
  line-height: 1.2;
}

.default-cover .author {
  opacity: 0.85;
  margin-top: 6px;
  font-size: 0.95rem;
}

.book-3d.is-hover-open:hover {
  --open-angle: -150deg;
}

.book-3d {
  --pages-color: v-bind('pagesColor');
  --edge-color: v-bind('edgeColor');
}
</style>