<template>
  <a :href="to || '#'" class="folder-card paper" :style="styleVars">
    <span class="sheet s1"></span>
    <span class="sheet s2"></span>

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
  colors: { type: Object, default: () => ({ from:'#fbbf24', to:'#f472b6', accent:'#0b1220' }) },
  skeleton: { type: Boolean, default: false }
})
const styleVars = computed(() => ({
  '--from': props.colors.from,
  '--to': props.colors.to,
  '--accent': props.colors.accent || '#0b1220'
}))
</script>

<style scoped>
.folder-card {
  position: relative; display: flex; min-height: 210px; border-radius: 16px; text-decoration: none;
  background: linear-gradient(180deg, rgba(255,255,255,.95), rgba(255,255,255,.86));
  box-shadow: 0 6px 14px rgba(0,0,0,.12);
  color:#0b1220;
  overflow:hidden;
}
.sheet { position:absolute; inset: 12px; border-radius: 12px; background:#fffef8; box-shadow: 0 6px 10px rgba(0,0,0,.08); }
.sheet.s1 { transform: rotate(-2.5deg); }
.sheet.s2 { transform: rotate(1.5deg); opacity:.92; }
.content { position: relative; z-index: 1; padding: 16px; display:flex; flex-direction:column; justify-content:flex-end; width:100%; backdrop-filter: blur(1px); }
.top .chip { background: rgba(0,0,0,.06); border: 1px solid rgba(0,0,0,.12); padding: 4px 8px; border-radius: 999px; font-size: 11px; color: #0b1220; }
.body { margin-top:10px; }
.title { margin:0 0 6px 0; font-size:16px; line-height:1.25; font-weight:800; }
.desc { margin:0; color:#0b1220; opacity:.8; font-size:12px; line-height:1.35; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.meta { display:flex; align-items:center; justify-content:space-between; border-top:1px solid rgba(0,0,0,.12); padding-top:10px; margin-top:10px; font-size:12px; color:#0b1220; }
.arrow { color:#0b1220; }

</style>