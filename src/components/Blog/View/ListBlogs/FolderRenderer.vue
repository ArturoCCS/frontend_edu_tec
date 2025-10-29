<template>
  <component :is="Comp" v-bind="forwardProps" />
</template>

<script setup>
import { computed } from 'vue'
import ClassicCard from './FolderTemplates/ClassicCard.vue'
import GlassCard from './FolderTemplates/GlassCard.vue'

const props = defineProps({
  template: { type: String, default: 'classic' },
  to: String,
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  author: { type: String, default: '' },
  date: { type: String, default: '' },
  colors: { type: Object, default: () => ({ from:'#1f3a5f', to:'#3b82f6', accent:'#cde6ff' }) },
  skeleton: { type: Boolean, default: false }
})

const registry = {
  classic: ClassicCard,
  glass: GlassCard
}

const Comp = computed(() => registry[props.template] || ClassicCard)
const forwardProps = computed(() => ({
  to: props.to,
  title: props.title,
  description: props.description,
  author: props.author,
  date: props.date,
  colors: props.colors,
  skeleton: props.skeleton
}))

</script>