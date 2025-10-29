<template>
  <div class="chat-panel">
    <header class="chat-header">
      <div class="chat-title">
        <img class="bot-avatar" src="/petirrojo.jpg" alt="Asistente Petirrojo" />
        <div>
          <div class="title">Asistente Petirrojo</div>
          <div class="subtitle">
            Contexto: {{ blog?.Titulo || blog?.titulo || 'Blog' }}
            <template v-if="capitulo"> — Capítulo: {{ capitulo.Titulo || capitulo.titulo }}</template>
          </div>
        </div>
      </div>

      <div class="format-toggle">
        <label><input type="radio" value="interactive" v-model="outputMode" /> Interactivo</label>
        <label><input type="radio" value="markdown" v-model="outputMode" /> Markdown</label>
      </div>

      <button class="icon-btn" title="Cerrar" @click="$emit('close')">✖</button>
    </header>

    <div class="quick-actions">
      <button class="qa-btn" @click="useAction('preguntaCap')">Preguntar sobre este capítulo</button>
      <button class="qa-btn" @click="useAction('quiz')">Crear examen</button>
      <button class="qa-btn" @click="useAction('encuesta')">Crear encuesta</button>
      <button class="qa-btn" @click="useAction('flashcards')">Tarjetas de memorización</button>
      <button class="qa-btn" @click="useAction('resumen')">Resumen</button>
    </div>

    <div ref="scrollEl" class="chat-messages">
      <template v-for="(m, i) in messages" :key="i">
        <div v-if="m.role === 'assistant' && m.quiz" class="msg assistant">
          <div class="bubble interactive">
            <QuizPlayer :quiz="m.quiz!" @submitted="onQuizSubmitted" @cancel="noop" />
          </div>
        </div>
        <div v-else-if="m.role === 'assistant' && m.survey" class="msg assistant">
          <div class="bubble interactive">
            <SurveyForm :survey="m.survey!" @submitted="onSurveySubmitted" @cancel="noop" />
          </div>
        </div>
        <div v-else-if="m.role === 'assistant' && m.flashcards" class="msg assistant">
          <div class="bubble interactive">
            <Flashcards :flashcards="m.flashcards!" @cancel="noop" />
          </div>
        </div>

        <div v-else :class="['msg', m.role]">
          <div class="bubble" v-html="renderMarkdown(m.content || '')"></div>
        </div>
      </template>

      <div v-if="loading" class="msg assistant">
        <div class="bubble">Pensando…</div>
      </div>
    </div>

    <footer class="chat-input">
      <textarea v-model="input" :placeholder="placeholder" rows="1" @keydown.enter.exact.prevent="send" />
      <button class="send-btn" :disabled="!input.trim() || loading" @click="send">Enviar</button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import QuizPlayer from '@/components/Utils/QuizPlayer.vue';
import SurveyForm from '@/components/Utils/SurveyForm.vue';
import { chat as aiChat } from '@/services/ai';
import type { Flashcards as FlashcardsType, Quiz, Survey } from '@/utils/aiSchemas';
import { editorDataToMarkdown, safeParseEditorData } from '@/utils/editorJsToText';
import { extractJson, isFlashcards, isQuiz, isSurvey } from '@/utils/jsonExtract';
import Flashcards from '../Utils/Flashcards.vue';

import { computed, nextTick, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  blog: any
  capitulo: any | null
  capitulos: any[]
  logoUrl?: string
}>()

type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content?: string
  quiz?: Quiz
  survey?: Survey
  flashcards?: FlashcardsType
}

const messages = ref<ChatMessage[]>([
  {
    role: 'assistant',
    content:
      '¡Hola! Soy tu asistente. Puedo responder preguntas sobre el contenido, y crear exámenes, encuestas o tarjetas en modo interactivo o Markdown. ¿En qué te ayudo?'
  }
])
const input = ref('')
const loading = ref(false)
const scrollEl = ref<HTMLElement | null>(null)

const outputMode = ref<'interactive' | 'markdown'>('interactive')
const pendingFormat = ref<'quiz-json' | 'survey-json' | 'flashcards-json' | 'markdown' | null>(null)

const placeholder = computed(() =>
  props.capitulo?.Titulo
    ? `Escribe tu pregunta sobre "${props.capitulo.Titulo}" o pide un recurso…`
    : 'Escribe tu pregunta o pide un recurso (examen, encuesta, tarjetas, resumen)…'
)

const blogMeta = computed(() => ({
  id: props.blog?.ID_Blog || props.blog?.id || props.blog?.id_blog || null,
  titulo: props.blog?.Titulo || props.blog?.titulo || 'Blog',
  tipo: props.blog?.Tipo || props.blog?.tipo || 'simple'
}))

function toTextFromCapitulo(cap: any): string {
  if (!cap) return ''
  const capJson = safeParseEditorData(cap.ContenidoJson ?? cap.Contenido)
  const parts: string[] = []
  if (cap.Titulo) parts.push(`# ${cap.Titulo}`)
  if (cap.Subtitulo) parts.push(`_${cap.Subtitulo}_`)
  if (capJson) parts.push(editorDataToMarkdown(capJson))
  for (const sec of cap.secciones || []) {
    const secJson = safeParseEditorData(sec.ContenidoJson ?? sec.Contenido)
    parts.push(`\n## ${sec.Titulo || sec.titulo || 'Sección'}\n`)
    if (secJson) parts.push(editorDataToMarkdown(secJson))
  }
  return parts.join('\n\n')
}
const selectedChapterText = computed(() => toTextFromCapitulo(props.capitulo))
const allChaptersText = computed(() => (props.capitulos || []).map(toTextFromCapitulo).join('\n\n---\n\n'))

async function scrollToBottom() {
  await nextTick()
  scrollEl.value && (scrollEl.value.scrollTop = scrollEl.value.scrollHeight)
}
watch(messages, scrollToBottom, { deep: true })
onMounted(scrollToBottom)

function renderMarkdown(md: string) {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const lines = (md || '').split('\n').map(l => {
    if (/^######\s+/.test(l)) return `<h6>${esc(l.replace(/^######\s+/, ''))}</h6>`
    if (/^#####\s+/.test(l)) return `<h5>${esc(l.replace(/^#####\s+/, ''))}</h5>`
    if (/^####\s+/.test(l)) return `<h4>${esc(l.replace(/^####\s+/, ''))}</h4>`
    if (/^###\s+/.test(l)) return `<h3>${esc(l.replace(/^###\s+/, ''))}</h3>`
    if (/^##\s+/.test(l)) return `<h2>${esc(l.replace(/^##\s+/, ''))}</h2>`
    if (/^#\s+/.test(l)) return `<h1>${esc(l.replace(/^#\s+/, ''))}</h1>`
    if (/^\s*-\s+/.test(l)) return `<li>${esc(l.replace(/^\s*-\s+/, ''))}</li>`
    return `<p>${esc(l)}</p>`
  })
  return lines.join('\n').replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
}

function useAction(kind: 'preguntaCap' | 'quiz' | 'encuesta' | 'flashcards' | 'resumen') {
  pendingFormat.value = null
  switch (kind) {
    case 'preguntaCap':
      input.value = 'Explica los puntos clave de este capítulo y su relación con conceptos anteriores.'
      pendingFormat.value = 'markdown'
      break
    case 'quiz':
      if (outputMode.value === 'interactive') {
        input.value = 'Genera un examen interactivo de 6 preguntas (mezcla selección múltiple y verdadero/falso) sobre el capítulo actual.'
        pendingFormat.value = 'quiz-json'
      } else {
        input.value = 'Crea un examen de 6 preguntas (mezcla selección múltiple y verdadero/falso) en Markdown y agrega la hoja de respuestas al final.'
        pendingFormat.value = 'markdown'
      }
      break
    case 'encuesta':
      if (outputMode.value === 'interactive') {
        input.value = 'Diseña una encuesta interactiva de 6 ítems para medir la comprensión del tema (Likert 1–5, opción múltiple y una abierta).'
        pendingFormat.value = 'survey-json'
      } else {
        input.value = 'Diseña una encuesta de 6 ítems en Markdown (Likert 1–5, opción múltiple y una abierta).'
        pendingFormat.value = 'markdown'
      }
      break
    case 'flashcards':
      if (outputMode.value === 'interactive') {
        input.value = 'Genera 12 tarjetas de memorización interactivas (pregunta | respuesta) con los conceptos más importantes.'
        pendingFormat.value = 'flashcards-json'
      } else {
        input.value = 'Genera 12 tarjetas de memorización en Markdown (pregunta | respuesta).'
        pendingFormat.value = 'markdown'
      }
      break
    case 'resumen':
      input.value = 'Haz un resumen estructurado (máx. 200 palabras) con viñetas y subtítulos.'
      pendingFormat.value = 'markdown'
      break
  }
}

async function send() {
  if (!input.value.trim() || loading.value) return
  const userMsg: ChatMessage = { role: 'user', content: input.value.trim() }
  messages.value.push(userMsg)
  input.value = ''
  loading.value = true

  try {
    const payload: any = {
      messages: messages.value.map(m => ({ role: m.role, content: m.content || '' })),
      context: { blogMeta: blogMeta.value, selectedChapterText: selectedChapterText.value, allChaptersText: allChaptersText.value },
      language: 'es'
    }
    if (pendingFormat.value && pendingFormat.value !== 'markdown') {
      payload.responseFormat = pendingFormat.value
    }

    const response = await aiChat(payload)
    const assistantText = response?.reply || 'No pude generar una respuesta.'

    const obj = extractJson(assistantText)
    if (obj && isQuiz(obj)) {
      messages.value.push({ role: 'assistant', quiz: obj })
    } else if (obj && isSurvey(obj)) {
      messages.value.push({ role: 'assistant', survey: obj })
    } else if (obj && isFlashcards(obj)) {
      messages.value.push({ role: 'assistant', flashcards: obj })
    } else if ((assistantText.trim().startsWith('{') || assistantText.includes('"type": "quiz"')) && assistantText.length > 0) {

      messages.value.push({
        role: 'assistant',
        content: 'El examen parece haber sido truncado. Prueba con menos preguntas (por ejemplo, 6) o vuelve a intentar.'
      })
    } else {
      messages.value.push({ role: 'assistant', content: assistantText })
    }
  } catch (e: any) {
    messages.value.push({
      role: 'assistant',
      content: 'Ocurrió un error al contactar el asistente. Verifica que el backend /ai/chat esté en ejecución.'
    })
  } finally {
    loading.value = false
  }
}

function onQuizSubmitted(payload: any) {
  messages.value.push({ role: 'assistant', content: `Resultados del examen: ${payload.score.correct}/${payload.score.total} correctas.` })
}
function onSurveySubmitted(_payload: any) {
  messages.value.push({ role: 'assistant', content: 'Gracias por completar la encuesta.' })
}
function noop() {}
</script>

<style scoped>
.chat-panel{background:var(--secondary,#fff);border:1px solid #dfe3e6;border-radius:12px;box-shadow:0 12px 28px rgba(0,0,0,.15);display:flex;flex-direction:column;height:100%;overflow:hidden}
.chat-header{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid #eceff1;background:#f8fafc}
.chat-title{display:flex;gap:10px;align-items:center}
.bot-avatar{width:40px;height:40px;border-radius:6px;object-fit:cover;border:1px solid #e5e7eb;background:#fff}
.title{font-weight:700;color:#1f2937}.subtitle{font-size:12px;color:#6b7280}.icon-btn{border:none;background:transparent;cursor:pointer;font-size:18px}
.format-toggle{display:flex;gap:10px;align-items:center;margin-right:auto;margin-left:16px;color:#374151;font-size:12px}
.quick-actions{display:flex;gap:8px;flex-wrap:wrap;padding:8px 12px;border-bottom:1px solid #f0f2f4;background:#fcfcfd}
.qa-btn{border:1px solid #d9dee3;background:#fff;padding:6px 10px;border-radius:8px;cursor:pointer;font-size:12px}.qa-btn:hover{background:#f3f4f6}
.chat-messages{flex:1;overflow:auto;padding:12px;background:#fff}
.msg{display:flex;margin:8px 0}.msg.user{justify-content:flex-end}.msg.assistant{justify-content:flex-start}
.bubble{max-width:85%;padding:10px 12px;border-radius:10px;line-height:1.35;white-space:pre-wrap}.msg.user .bubble{background:#2563eb;color:#fff;border-bottom-right-radius:4px}
.msg.assistant .bubble{background:#f3f4f6;color:#111827;border-bottom-left-radius:4px}.bubble.interactive{padding:0;background:transparent}
.chat-input{display:flex;gap:8px;padding:10px;border-top:1px solid #eceff1;background:#fafbfc}
.chat-input textarea{flex:1;resize:none;border-radius:8px;border:1px solid #d0d7de;padding:10px;font-size:14px;min-height:42px}
.send-btn{background:#111827;color:#fff;border:none;border-radius:8px;padding:0 14px;cursor:pointer}.send-btn:disabled{opacity:.6;cursor:not-allowed}
</style>