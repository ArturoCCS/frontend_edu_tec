<template>
  <div class="quiz-root">
    <h2 class="title">{{ quiz.title }}</h2>
    <p v-if="quiz.instructions" class="muted">{{ quiz.instructions }}</p>
    <form @submit.prevent="onSubmit">
      <div v-for="(it, idx) in quiz.items" :key="it.id" class="q-block">
        <div class="q-head"><span class="q-num">{{ idx + 1 }}.</span><span class="q-text" v-text="it.question"/></div>
        <div class="q-options" v-if="it.kind !== 'boolean'">
          <label v-for="ch in (it.choices || [])" :key="ch.id" class="opt">
            <input :type="it.kind === 'multi' ? 'checkbox' : 'radio'" :name="`q-${it.id}`" :value="ch.id"
              :checked="isSelected(it.id, ch.id)" @change="toggleChoice(it, ch.id)" />
            <span class="opt-text">{{ ch.id }}) {{ ch.text }}</span>
          </label>
        </div>
        <div class="q-options" v-else>
          <label class="opt"><input type="radio" :name="`q-${it.id}`" value="true"
              :checked="isSelected(it.id, 'true')" @change="toggleChoice(it, 'true')" /><span class="opt-text">Verdadero</span></label>
          <label class="opt"><input type="radio" :name="`q-${it.id}`" value="false"
              :checked="isSelected(it.id, 'false')" @change="toggleChoice(it, 'false')" /><span class="opt-text">Falso</span></label>
        </div>
        <div v-if="showResults" class="feedback">
          <span class="badge" :class="resultFor(it.id).correct ? 'ok' : 'bad'">{{ resultFor(it.id).correct ? 'Correcto' : 'Incorrecto' }}</span>
          <span class="explain" v-if="it.explanation"> — {{ it.explanation }}</span>
          <div class="answer">Respuesta: {{ it.answer.join(', ') }}</div>
        </div>
      </div>
      <div class="actions">
        <button type="submit" class="btn primary" v-if="!showResults">Corregir</button>
        <button type="button" class="btn" v-else @click="reset">Reiniciar</button>
        <button type="button" class="btn ghost" @click="$emit('cancel')">Cerrar</button>
      </div>
      <div v-if="showResults" class="score">Puntaje: {{ score.correct }}/{{ score.total }} ({{ ((score.correct/score.total)*100).toFixed(0) }}%)</div>
    </form>
  </div>
</template>
<script setup lang="ts">
import type { Quiz, QuizItem } from '@/utils/aiSchemas';
import { computed, reactive, ref } from 'vue';
const props = defineProps<{ quiz: Quiz }>()
const emit = defineEmits<{ (e:'submitted',payload:{score:{correct:number;total:number},selections:Record<string,string[]>}):void;(e:'cancel'):void }>()
const selections = reactive<Record<string, string[]>>({})
const showResults = ref(false)
function toggleChoice(it: QuizItem, choiceId: string) {
  if (!selections[it.id]) selections[it.id] = []
  if (it.kind === 'multi') {
    const idx = selections[it.id].indexOf(choiceId)
    if (idx === -1) selections[it.id].push(choiceId); else selections[it.id].splice(idx, 1)
  } else { selections[it.id] = [choiceId] }
}
function isSelected(qid: string, choiceId: string) { return (selections[qid] || []).includes(choiceId) }
const score = computed(() => { let correct = 0; for (const it of props.quiz.items) {
  const sel = (selections[it.id] || []).slice().sort(); const ans = (it.answer || []).slice().sort()
  const ok = sel.length === ans.length && sel.every((v,i)=>v===ans[i]); if (ok) correct++ }
  return { correct, total: props.quiz.items.length } })
function resultFor(qid:string){ const it = props.quiz.items.find(x=>x.id===qid)!; const sel=(selections[qid]||[]).slice().sort(); const ans=(it.answer||[]).slice().sort(); return { correct: sel.length===ans.length && sel.every((v,i)=>v===ans[i]) } }
function onSubmit(){ showResults.value = true; emit('submitted', { score: score.value, selections }) }
function reset(){ for (const k of Object.keys(selections)) delete selections[k]; showResults.value = false }
</script>
<style scoped>
.quiz-root{padding:8px}.title{margin:0 0 6px}.muted{color:#6b7280;margin:0 0 12px}.q-block{border-top:1px solid #e5e7eb;padding:12px 0}
.q-head{font-weight:600;color:#111827;margin-bottom:8px}.q-num{color:#6b7280;margin-right:6px}.q-options{display:grid;gap:6px;margin:8px 0}
.opt{display:flex;gap:8px;align-items:center;cursor:pointer}.opt input{cursor:pointer}.opt-text{line-height:1.2}
.feedback{margin-top:6px;font-size:.93em}.badge{display:inline-block;padding:2px 8px;border-radius:999px;font-size:.82em}
.badge.ok{background:#DCFCE7;color:#065F46}.badge.bad{background:#FEE2E2;color:#991B1B}.answer{color:#374151;margin-top:2px}.explain{color:#6b7280}
.actions{display:flex;gap:8px;margin-top:12px}.btn{padding:6px 12px;border:1px solid #d1d5db;border-radius:8px;background:#fff;cursor:pointer}
.btn.primary{background:#111827;color:#fff;border-color:#111827}.btn.ghost{background:#f9fafb}.score{margin-top:10px;font-weight:600}
</style>