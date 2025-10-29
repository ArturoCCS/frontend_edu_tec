<template>
  <div class="survey-root">
    <h2 class="title">{{ survey.title }}</h2>
    <p v-if="survey.instructions" class="muted">{{ survey.instructions }}</p>
    <form @submit.prevent="submit">
      <div v-for="(it, idx) in survey.items" :key="it.id" class="q-block">
        <div class="q-head"><span class="q-num">{{ idx + 1 }}.</span><span class="q-text">{{ it.question }}</span></div>
        <div v-if="it.kind === 'likert'" class="likert">
          <label v-for="n in range(it.scale.min, it.scale.max)" :key="n" class="likert-opt">
            <input type="radio" :name="`s-${it.id}`" :value="n" v-model="answers[it.id]" /><span>{{ n }}</span>
          </label>
          <div class="likert-labels" v-if="it.scale.labels"><span>{{ it.scale.labels[String(it.scale.min)] }}</span><span>{{ it.scale.labels[String(it.scale.max)] }}</span></div>
        </div>
        <div v-else-if="it.kind === 'single'" class="opts">
          <label v-for="op in it.options" :key="op.id" class="opt">
            <input type="radio" :name="`s-${it.id}`" :value="op.id" v-model="answers[it.id]" /><span>{{ op.text }}</span>
          </label>
          <label v-if="it.allowOther" class="opt">
            <input type="radio" :name="`s-${it.id}`" value="other" v-model="answers[it.id]" />
            <input type="text" v-model="others[it.id]" placeholder="Otro..." class="other-input" />
          </label>
        </div>
        <div v-else-if="it.kind === 'multi'" class="opts">
          <label v-for="op in it.options" :key="op.id" class="opt">
            <input type="checkbox" :value="op.id" v-model="multi[it.id]" /><span>{{ op.text }}</span>
          </label>
        </div>
        <div v-else-if="it.kind === 'open'"><textarea class="open" :placeholder="it.placeholder || 'Escribe tu respuesta...'" :maxlength="it.maxLength || 1000" v-model="open[it.id]" /></div>
      </div>
      <div class="actions"><button class="btn primary" type="submit">Enviar</button><button class="btn" type="button" @click="$emit('cancel')">Cerrar</button></div>
    </form>
  </div>
</template>
<script setup lang="ts">
import type { Survey } from '@/utils/aiSchemas';
import { reactive } from 'vue';
const props = defineProps<{ survey: Survey }>()
const emit = defineEmits<{ (e:'submitted',payload:any):void; (e:'cancel'):void }>()
const answers = reactive<Record<string, string | number>>({})
const others = reactive<Record<string, string>>({})
const multi = reactive<Record<string, string[]>>({})
const open = reactive<Record<string, string>>({})
function range(min:number,max:number){return Array.from({length:max-min+1},(_,i)=>i+min)}
function submit(){ emit('submitted', { answers, others, multi, open }) }
</script>
<style scoped>
.survey-root{padding:8px}.title{margin:0 0 6px}.muted{color:#6b7280;margin:0 0 12px}.q-block{border-top:1px solid #e5e7eb;padding:12px 0}
.q-head{font-weight:600;color:#111827;margin-bottom:8px}.q-num{color:#6b7280;margin-right:6px}.opts{display:grid;gap:6px}.opt{display:flex;gap:8px;align-items:center}
.other-input{margin-left:6px;padding:4px 6px}.open{width:100%;min-height:80px;padding:8px}.likert{display:flex;gap:10px;align-items:center}
.likert-opt{display:flex;gap:6px;align-items:center}.likert-labels{display:flex;justify-content:space-between;color:#6b7280;font-size:12px;margin-top:6px}
.actions{display:flex;gap:8px;margin-top:12px}.btn{padding:6px 12px;border:1px solid #d1d5db;border-radius:8px;background:#fff;cursor:pointer}
.btn.primary{background:#111827;color:#fff;border-color:#111827}
</style>