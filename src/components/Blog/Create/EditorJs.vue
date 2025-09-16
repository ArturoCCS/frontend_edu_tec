<script setup>
import EditorJS from '@editorjs/editorjs'
import { defineEmits, defineProps, onBeforeUnmount, onMounted, ref, toRaw, watch } from 'vue'

// Parte de EditorJS
import Code from '@editorjs/code'
import Embed from '@editorjs/embed'
import Header from '@editorjs/header'
import InlineCode from '@editorjs/inline-code'
import List from '@editorjs/list'
import Marker from '@editorjs/marker'
import Paragraph from '@editorjs/paragraph'
import Quote from '@editorjs/quote'
import Raw from '@editorjs/raw'
import Table from '@editorjs/table'
import Warning from '@editorjs/warning'

// Extras que no pertenecen a EditorJS
import BackgroundColorInlineTool from './editorjs-tools/BackgroundColorInlineTool.js'
import BackgroundTune from './editorjs-tools/BackgroundTune.js'
import InteractiveChecklist from './editorjs-tools/InteractiveChecklist.js'
import StrikethroughInlineTool from './editorjs-tools/StrikethroughInlineTool.js'
import TextColorInlineTool from './editorjs-tools/TextColorInlineTool.js'
import UnderlineInlineTool from './editorjs-tools/UnderlineInlineTool.js'
import YouTubeAutoPaste from './editorjs-tools/YouTubeAutoPaste.js'
import { migrateYouTubeParagraphs } from './utils/migrateYouTubeParagraphs.js'

const props = defineProps({
  modelValue: { type: [Object, String], required: true },
  holder: { type: String, default: 'editor-js-holder' },
  readOnly: { type: Boolean, default: false },
  autofocus: { type: Boolean, default: true },
  placeholder: { type: String, default: 'Escribe aquí…' }
})
const emit = defineEmits(['update:modelValue'])
const editor = ref(null)

function normalizeData(val) {
  if (!val) return { time: Date.now(), blocks: [] }
  if (typeof val === 'string') { try { return JSON.parse(val) } catch { return { time: Date.now(), blocks: [] } } }
  return toRaw(val)
}
function destroyEditor() { if (editor.value) { editor.value.destroy(); editor.value = null } }

const palette = [
  '#111827','#1f2937','#374151','#6b7280','#9ca3af','#d1d5db','#f3f4f6','#ffffff',
  '#ef4444','#f59e0b','#fbbf24','#10b981','#06b6d4','#3b82f6','#8b5cf6','#ec4899'
]

function buildTools() {
  return {
    paragraph: {
      class: Paragraph,
      inlineToolbar: ['bold','italic','underline','strikethrough','inlineCode','link','textColor','backgroundColor','marker'],
      tunes: ['background'],
      sanitize: { text: { u: {}, s: {}, strike: {}, span: { style: true }, font: { color: true } } }
    },
    header: {
      class: Header,
      inlineToolbar: ['link','underline','strikethrough','textColor'],
      tunes: ['background'],
      config: { levels: [1,2,3,4], defaultLevel: 2 },
      sanitize: { text: { u: {}, s: {}, strike: {}, span: { style: true }, font: { color: true } } }
    },
    list: { class: List, inlineToolbar: true, tunes: ['background'] },
    readerChecklist: { class: InteractiveChecklist, inlineToolbar: true, tunes: ['background'] },
    table: { class: Table, inlineToolbar: true, tunes: ['background'], config: { withHeadings: true } },
    quote: { class: Quote, inlineToolbar: true, tunes: ['background'], config: { quotePlaceholder: 'Escribe una cita', captionPlaceholder: 'Autor' } },
    code: Code,
    marker: Marker,
    warning: Warning,
    raw: Raw,
    embed: {
      class: Embed,
      tunes: ['background'],
      config: { services: { youtube: true, codepen: true, instagram: true, twitter: true } }
    },
    
    underline: UnderlineInlineTool,
    strikethrough: StrikethroughInlineTool,
    inlineCode: InlineCode,
    textColor: { class: TextColorInlineTool, config: { colors: palette } },
    backgroundColor: { class: BackgroundColorInlineTool, config: { colors: ['#fff59d','#fde68a','#bbf7d0','#bae6fd','#e9d5ff','#fecaca','#e5e7eb','#ffffff'] } },

    background: { class: BackgroundTune, config: { colors: ['transparent','#ffffff','#fef3c7','#e0f2fe','#dcfce7','#fee2e2','#eef2ff'] } },

    youtubeAuto: { class: YouTubeAutoPaste }
  }
}

function initEditor() {
  destroyEditor()
  const initialData = migrateYouTubeParagraphs(normalizeData(props.modelValue))

  editor.value = new EditorJS({
    holder: props.holder,
    tools: buildTools(),
    data: initialData,
    readOnly: props.readOnly,
    autofocus: props.readOnly ? false : props.autofocus,
    placeholder: props.placeholder || undefined,
    onChange: async () => {
      if (props.readOnly) return
      const data = await editor.value.save()
      emit('update:modelValue', data)
    }
  })
}


onMounted(() => {
  initEditor();
  setTimeout(() => {
    document.querySelectorAll('.ce-popover-item__title').forEach(el => {
      if (el.textContent.trim() === 'Checklist (lector)') {
        el.parentElement.setAttribute('title', 'Este check puede ser clickeado por el usuario');
      }
    });
  }, 100);
   setTimeout(() => {
    document.querySelectorAll('.ce-popover-item__title').forEach(el => {
      if (el.textContent.trim() === 'Checklist') {
        el.parentElement.setAttribute('title', 'Este check "No" puede ser clickeado por el usuario en lectura');
      }
    });
  }, 100);
});
onBeforeUnmount(destroyEditor)

watch(() => [props.readOnly], initEditor)
</script>

<template>
  <div :id="holder" :class="{ 'read-only': readOnly }"></div>
</template>

<style>

.read-only .ce-popover,
.read-only .ce-toolbar,
.read-only .ce-inline-toolbar,
.read-only .ce-settings,
.read-only .ce-toolbox {
  display: none !important;
}
.ce-block .embed-tool, .ce-block .cdx-embed {
  position: relative;
  width: 100%;
  max-width: 100%;
}

.ce-block .embed-tool iframe, .ce-block .cdx-embed iframe {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  border: 0;
  border-radius: 8px;
  background: #000;
}
.bg-tune__popover {
  display: flex;
  gap: 6px;
  padding: 8px;
  flex-wrap: wrap;
  background: #ffffff;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 8px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.12);
  z-index: 9999;
}

.bg-tune__swatch {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 1px solid rgba(0,0,0,0.08);
  cursor: pointer;
}
.bg-tune__swatch:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>