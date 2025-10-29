<template>
  <a :href="to || '#'" class="folder-card neon" :style="styleVars">
    <span class="glow"></span>
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
  colors: { type: Object, default: () => ({ from:'#8b5cf6', to:'#22d3ee', accent:'#a5f3fc' }) },
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
  position: relative; display: flex; min-height: 210px;
  padding: 14px; border-radius: 16px; text-decoration: none; color:#f8fafc; isolation:isolate;
  background: radial-gradient(120% 80% at 10% -10%, rgba(255,255,255,.06), transparent 40%), #0a0f1c;
  outline: 2px solid color-mix(in srgb, var(--to) 55%, transparent);
}
.glow {
  position: absolute; inset: -6px; border-radius: 18px; z-index: -1;
  background: radial-gradient(60% 60% at 20% 0%, color-mix(in srgb, var(--to) 40%, transparent), transparent 60%),
              radial-gradient(60% 60% at 80% 100%, color-mix(in srgb, var(--from) 35%, transparent), transparent 60%);
  filter: blur(12px);
}
.content { display:flex; flex-direction:column; justify-content:flex-end; width:100%; }
.top .chip { background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.25); padding:4px 8px; border-radius:999px; font-size:11px; }
.body { margin-top:10px; }
.title { margin:0 0 6px 0; font-size:16px; line-height:1.25; font-weight:800; }
.desc { margin:0; color: rgba(241,245,249,.9); font-size:12px; line-height:1.35; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.meta { display:flex; align-items:center; justify-content:space-between; border-top:1px solid rgba(255,255,255,.16); padding-top:10px; margin-top:10px; font-size:12px; color:#e2e8f0; }
.arrow { opacity:.95; filter: drop-shadow(0 0 6px color-mix(in srgb, var(--accent) 80%, transparent)); }

</style>