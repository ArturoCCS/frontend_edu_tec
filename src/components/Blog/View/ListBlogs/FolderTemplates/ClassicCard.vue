<template>
  <a :href="to || '#'" class="folder-card classic" :style="styleVars">
    <span class="folder-back"></span>
    <span class="folder-tab"></span>
    <span class="folder-front"></span>
    <span class="folder-gloss"></span>

    <span v-if="!skeleton" class="paper p1">
      <span class="paper-text"></span>
      <span class="paper-text short"></span>
      <span class="paper-text"></span>
    </span>
    <span v-if="!skeleton" class="paper p2">
      <span class="paper-text"></span>
      <span class="paper-text short"></span>
      <span class="paper-text"></span>
    </span>
    <span v-if="!skeleton" class="paper p3">
      <span class="paper-text"></span>
      <span class="paper-text short"></span>
      <span class="paper-text"></span>
    </span>
    
    <div class="content">
      <div class="top"><span class="chip" v-if="author">{{ author }}</span></div>
      <div class="body">
        <h4 class="title" :title="title">{{ title }}</h4>
        <p class="desc" :title="description">{{ description }}</p>
      </div>
      <div class="meta">
        <span class="date">{{ date }}</span>
        <i class="fa-solid fa-arrow-right arrow" aria-hidden="true"></i>
      </div>
    </div>
  </a>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  to: String,
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  author: { type: String, default: '' },
  date: { type: String, default: '' },
  colors: { type: Object, default: () => ({ from:'#1f3a5f', to:'#3b82f6', accent:'#cde6ff' }) },
  skeleton: { type: Boolean, default: false }
})
const styleVars = computed(() => ({
  '--from': props.colors.from,
  '--to': props.colors.to,
  '--accent': props.colors.accent || '#ffffff'
}))
</script>

<style scoped>
.folder-card { 
  position: relative; 
  display: flex; 
  min-height: 190px;
  top: 20px; 
  border-radius: 18px; 
  color: #eef2ff; 
  text-decoration: none; 
  isolation: isolate; 
  overflow: visible; 
}
.folder-back { position: absolute; inset: 0; border-radius: 0 20px 20px 20px; 
  background: var(--from); z-index: 0; }
.folder-tab {
  position: absolute;
  top: -29px;
  left: 0;
  width: clamp(240px, 30vw, 340px);
  background: var(--from);
  height: 40px;
  z-index: 5;
  clip-path: path('M 0 30 Q 0 12 28 12 L 90 12 Q 112 12 120 20 Q 130 30 150 30 L 180 30 V 40 H 0 V 30 Z');
}
.folder-front {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 66%;
  border-radius: 24px;
  background: radial-gradient(120% 90% at 10% -10%, rgba(255, 255, 255, .16), transparent 40%), linear-gradient(145deg, var(--from), var(--to));
  filter: brightness(1.08) saturate(.97);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .18), inset 0 -8px 24px rgba(0, 0, 0, .09);
  z-index: 2;
  opacity: 0.85;
}
.folder-gloss { 
  position: absolute;
  left: 5px;
  right: 5px;
  top: calc(36%);
  height: 118px;
  border-radius: 19px;
  background: rgb(74 58 58 / 20%);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 3;
  pointer-events: none;
  opacity: 0.9;
}

.paper { position: absolute; background: white; border-radius: 8px; z-index: 1; box-shadow: 0 10px 18px rgba(0,0,0,.25); }
.paper.p1 { left: 74px; top: 40px; width: 80px; height: 85px; transform: rotate(-2deg); opacity:.99 }
.paper.p2 { right: 74px; top: 48px; width: 80px; height: 85px; transform: rotate(2deg); opacity:.99 }
.paper.p3 { left: 134px; top: 30px; width: 80px; height: 85px; transform: rotate(6deg); opacity:.99 }
.paper-text {
  display: block;
  height: 6px;
  margin: 6px 5px;
  background: linear-gradient(90deg, #dcdee0 60%, #c8ced7 100%);
  border-radius: 3px;
  opacity: 0.45;
}
.paper-text.short {
  width: 60%;
}
.paper-text:not(.short) {
  width: 85%;
}
.content { position: relative; z-index: 5; display: flex; flex-direction: column; justify-content: flex-end; width: 100%; padding: 14px; }
.top .chip { background: rgba(2,6,23,.35); border: 1px solid rgba(255,255,255,.18); padding: 4px 8px; border-radius: 999px; font-size: 11px; color: #e2e8f0; backdrop-filter: blur(4px); }
.body { margin-top: 10px; }
.title { margin: 0 0 6px 0; font-size: 16px; line-height: 1.25; font-weight: 800; text-shadow: 0 1px 0 rgba(0,0,0,.35);
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.desc { margin:0; color: rgba(241,245,249,.92); font-size:12px; line-height:1.35; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.meta { display:flex; align-items:center; justify-content:space-between; border-top:1px solid rgba(255,255,255,.14); padding-top:10px; margin-top:10px; font-size:12px; color:#f1f5f9; }
.arrow { opacity:.9; transition: transform .15s; }
.folder-card:hover .arrow { transform: translateX(2px); }
</style>