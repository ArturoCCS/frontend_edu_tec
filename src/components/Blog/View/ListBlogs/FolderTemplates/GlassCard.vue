<template>
  <a :href="to || '#'" class="folder-card glass" :style="styleVars">
    <span class="folder-back"></span>
    <span class="folder-front"></span>
    
    <span class="folder-tab"></span>


    <span v-if="!skeleton" class="paper p1">
      <span class="paper-text"></span>
      <span class="paper-text short"></span>
      <span class="paper-text"></span>
    </span>

    <span class="folder-tab2"></span>

    <div class="content">
      <div class="top">
        <span class="chip" v-if="author">{{ author }}</span>
      </div>
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
.folder-card { position: relative; display: flex; min-height: 210px; border-radius: 18px; color: #f8fafc; text-decoration: none; isolation: isolate; overflow: hidden; }
.folder-back {
  position: absolute; inset: 0; border-radius: 20px;
  top: 19px;
  background:var(--to) ;
    border: 1px solid rgba(255,255,255,.28);
  backdrop-filter: blur(10px) saturate(1.1);
}
.fo-tab{
  position: absolute;
  top: 47px;
  left: 0;
  width: clamp(240px, 30vw, 340px);
  background: var(--from);
  height: 40px;
  z-index: 1;

clip-path: path('M 0 30 Q 0 12 28 12 L 90 12 Q 112 12 120 20 Q 130 30 150 30 L 180 30 V 40 H 0 V 30 Z');

}

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

.paper { position: absolute; background: white; border-radius: 8px; z-index: 0; box-shadow: 0 10px 18px rgba(0,0,0,.25); }
.paper.p1 {  top: 40px; width: 90%; height: 85px; opacity:.99; margin: auto 15px; }
.folder-tab {
  position: absolute;
  top: -9px;
  left:  clamp(10px, 5vw, 75px);
  width: 100%;

  background: var(--to);
  height: 40px;
  z-index: 5;

clip-path: path('M 0 30 Q 20 27 30 20 Q 40 10 60 10 L 140 10 Q 160 10 170 20 Q 180 30 200 30 V 30 H 0 V 30 Z');


}

.folder-tab2 {
  position: absolute;
  top: 64px;
  right:  clamp(10px, 5vw, 75px);
  width: 100%;

  background: white;
  height: 40px;
  z-index: 5;

  rotate: 180deg;
clip-path: path('M 0 30 Q 20 27 30 20 Q 40 10 60 10 L 140 10 Q 160 10 170 20 Q 180 30 200 30 V 30 H 0 V 30 Z');


}
.folder-front {
  position: absolute; left: 0; right: 0; bottom: 0; height: 64%; border-radius: 18px;
  z-index: 4;
  background:var(--from);
   filter: saturate(1.05);
}
.content { position: relative; z-index: 5; display: flex; flex-direction: column; justify-content: flex-end; width: 100%; padding: 14px; }
.top .chip { background: rgba(255,255,255,.18); border: 1px solid rgba(255,255,255,.35); padding: 4px 8px; border-radius: 999px; font-size: 11px; color:#f8fafc; }
.body { margin-top: 10px; }
.title { margin: 0 0 6px 0; font-size: 16px; line-height: 1.25; font-weight: 800; text-shadow: 0 1px 0 rgba(0,0,0,.25);
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.desc { margin:0; color: rgba(241,245,249,.95); font-size:12px; line-height:1.35; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.meta { display:flex; align-items:center; justify-content:space-between; border-top:1px solid rgba(255,255,255,.25); padding-top:10px; margin-top:10px; font-size:12px; color:#f1f5f9; }
.arrow { opacity:.9; transition: transform .15s; }
.folder-card:hover .arrow { transform: translateX(2px); }

</style>