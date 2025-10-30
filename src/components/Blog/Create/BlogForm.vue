<template>
  <div class="blog-wizard-root">
    <div class="blog-wizard-main">
      
      <section v-if="step === 1" class="blog-wizard-form">
        <button class="wizard-next-btn" @click="step = 2">
          Siguiente <span style="margin-left:7px;"><svg width="19" height="19" viewBox="0 0 24 24"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </button>
        <form class="blog-form" @submit.prevent>
          <div class="inputForm">
            <input
              id="titulo"
              v-model="blog.titulo"
              class="input"
              type="text"
              maxlength="120"
              required
            />
            <div class="label-line" for="titulo">Título del blog</div>
          </div>

          <div class="inputForm">
            <textarea 
              v-model="blog.descripcion" 
              placeholder="Describe brevemente el blog" 
              class="input" 
              id="descripcion" 
              rows="3"></textarea>
            <div class="label-line" for="descripcion">Descripción</div>
          </div>

          <div class="inputForm">
            <select v-model="blog.tipo" @change="ajustarCapitulos" class="input" id="tipo">
              <option value="simple">Simple (1 capítulo)</option>
              <option value="documentacion">Multicapítulo</option>
            </select>
            <div class="label-line" for="tipo">Tipo de blog</div>
          </div>

          <div class="inputForm">
            <select v-model="blog.visibilidad" class="input" id="visibilidad">
              <option value="publico">Público</option>
              <option value="autenticado">Autenticado</option>
              <option value="restringido">Restringido</option>
            </select>
            <div class="label-line" for="visibilidad">Visibilidad</div>
          </div>

          <div class="inputInline">
            <label class="checkbox">
              <input type="checkbox" v-model="blog.publicado" />
              Publicado
            </label>
          </div>
          <p class="help-inline">Si lo desmarcas, se guarda como borrador y no aparece en listados ni recomendaciones.</p>

          <div class="group-block">
            <div class="group-label">Carreras</div>
            <div class="group-actions">
              <button type="button" class="link" @click="openSuggest('career')">Proponer nueva carrera</button>
            </div>
            <div v-if="catalogs.loading" class="muted">Cargando...</div>
            <div v-else class="chips-grid" role="listbox" aria-label="Carreras">
              <div v-for="c in catalogs.careers" :key="c.id_career" class="chip-wrapper">
                <label class="chip">
                  <input type="checkbox" :value="c.id_career" v-model="blog.careersSelected" />
                  <span class="chip-text">{{ c.nombre }}</span>
                </label>
                <div v-if="blog.careersSelected.includes(c.id_career)" class="mode-row">
                  <select v-model="blog.careerModes[c.id_career]" class="input small" aria-label="Modo de visibilidad en carrera">
                    <option value="recommended">Recomendado</option>
                    <option value="closed">Cerrado (solo estas carreras)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="group-block">
            <div class="group-label">Materias</div>
            <div class="group-actions">
              <button type="button" class="link" @click="openSuggest('subject')">Proponer nueva materia</button>
            </div>
            <div v-if="catalogs.loading" class="muted">Cargando...</div>
            <div v-else class="chips-grid" role="listbox" aria-label="Materias">
              <div v-for="s in catalogs.subjects" :key="s.id_subject" class="chip-wrapper">
                <label class="chip">
                  <input type="checkbox" :value="s.id_subject" v-model="blog.subjectsSelected" />
                  <span class="chip-text">{{ s.nombre }}</span>
                </label>
                <div v-if="blog.subjectsSelected.includes(s.id_subject)" class="mode-row">
                   <select v-model="blog.subjectModes[s.id_subject]" class="input small" aria-label="Modo en materia">
                    <option value="optional">Opcional</option>
                    <option value="recommended">Recomendado</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="group-block">
            <div class="group-label">Temas (catálogo)</div>
            <div class="group-actions">
              <button type="button" class="link" @click="openSuggest('topic')">Proponer nuevo tema</button>
            </div>
            <div v-if="catalogs.loading" class="muted">Cargando...</div>
            <div v-else class="chips-grid" role="listbox" aria-label="Temas">
              <label v-for="t in catalogs.topics" :key="t.id_topic" class="chip" tabindex="-1">
                <input type="checkbox" :value="t.id_topic" v-model="blog.topicsSelected" />
                <span class="chip-text">{{ t.nombre }}</span>
              </label>
            </div>
          </div>

          <!-- <div class="group-block">
            <div class="group-label">Tags libres (palabras clave)</div>
            <TagInput
              v-model="blog.freeTags"
              :suggestions="tagSuggestions"
              :max="8"
              placeholder="Escribe y Enter/Tab…"
            />
            <div class="muted tiny">Máximo 8. Se normalizan a minúsculas y sin acentos.</div>
          </div> -->
        </form>
      
      </section>

      <section v-else class="blog-wizard-content">
          <button class="wizard-back-btn" @click="step = 1">
            <span style="margin-right:7px;"><svg width="19" height="19" viewBox="0 0 24 24"><path d="M19 12H5M11 19l-7-7 7-7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            Volver
          </button>
        <div class="paper-sheet">
          <aside class="sidebar-nav">
            <draggable
              v-model="blog.capitulos"
              item-key="id"
              handle=".drag-handle"
              tag="ul"
              class="chapter-list-nav"
            >
              <template #item="{ element, index }">
                <li
                  class="chapter-btn"
                  :class="{ selected: capituloSeleccionado?.id === element.id }"
                  @click="seleccionarCapitulo(element)"
                >
                  <span class="drag-handle" title="Arrastrar">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <circle cx="5"  cy="5"  r="1.5" fill="#888"/>
                      <circle cx="5"  cy="10" r="1.5" fill="#888"/>
                      <circle cx="5"  cy="15" r="1.5" fill="#888"/>
                      <circle cx="12" cy="5"  r="1.5" fill="#888"/>
                      <circle cx="12" cy="10" r="1.5" fill="#888"/>
                      <circle cx="12" cy="15" r="1.5" fill="#888"/>
                    </svg>
                  </span>
                  <textarea
                    v-model="element.titulo"
                    @input="autoGrow($event)"
                    class="chapter-title-input"
                    rows="1"
                    :placeholder="'Título'"
                    @click.stop
                  ></textarea>
                  <button class="btn-delete-section" @click.stop="eliminarCapitulo(index)" title="Eliminar sección">
                    <svg class="icon-trash" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </li>
              </template>
            </draggable>

            <button class="chapter-btn" style="font-size: 0.9em; color: #006be6; background: #deeeff" @click="agregarCapitulo" :disabled="blog.tipo==='simple'&&blog.capitulos.length>=1">
              Agregar Capítulo
            </button>

            <v-btn @click="guardarBlog" class="text-none text-white mt-15" color="black" min-width="90" rounded :disabled="editorStore.creating">
              {{ editorStore.creating ? 'Guardando...' : 'Guardar' }}
            </v-btn>
          </aside>

          <main class="blog-main">
            <div v-if="capituloSeleccionado">
              <header class="editor-header">
                <div class="editor-subtitle">{{ capituloSeleccionado.titulo?.trim() || 'Capítulo' }}</div>
              </header>
              <section
                class="editor-group chapter"
                :aria-labelledby="`label-cap-${capituloSeleccionado.id}`"
                :class="{'editor-group--active': activeEditorGroupId === capituloSeleccionado.id}"
              >
                <div class="editor-surface">
                  <EditorJs
                    :key="`editor-${capituloSeleccionado.id}-${editorCounter}`"
                    :holder="`editor-capitulo-${capituloSeleccionado.id}`"
                    v-model="capituloSeleccionado.contenido"
                    class="editorjs"
                    :editorGroupId="capituloSeleccionado.id"
                    :activeEditorGroupId="activeEditorGroupId"
                    @set-active-group="setActiveEditorGroup"
                    @clear-active-group="clearActiveGroup"
                  />
                </div>
              </section>
              <section
                v-for="(sec) in capituloSeleccionado.secciones"
                :key="sec.id"
                class="editor-group section"
                :aria-labelledby="`label-sec-${capituloSeleccionado.id}-${sec.id}`"
                :class="{'editor-group--active': activeEditorGroupId === sec.id}"
              >
                <header class="editor-header">
                  <div class="editor-subtitle">{{ sec.titulo?.trim() || 'Sección' }}</div>
                </header>
                <div class="editor-surface">
                  <EditorJs
                    :key="`editor-sec-${capituloSeleccionado.id}-${sec.id}-${editorCounter}`"
                    :holder="`editor-seccion-${capituloSeleccionado.id}-${sec.id}`"
                    v-model="sec.data"
                    class="editorjs"
                    :editorGroupId="sec.id"
                    :activeEditorGroupId="activeEditorGroupId"
                    @set-active-group="setActiveEditorGroup"
                    @clear-active-group="clearActiveGroup"
                  />
                </div>
              </section>
            </div>
            <div v-else class="empty-center-msg">Selecciona un capítulo para editar</div>
          </main>

          <aside class="page-sidebar" v-if="capituloSeleccionado">
            <div class="sidebar-content">
              <h3>En este capítulo</h3>
              <div style="position: absolute; right: -10px; top: -10px;">
                <button class="Btn" @click="agregarSeccion(capituloSeleccionado)">
                  <svg class="svgIcon" viewBox="0 0 24 24" width="17" height="17" color="white">
                    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                  </svg>
                  <span class="tooltip">Agregar sección</span>
                </button>
              </div>
              <div class="sidebar-notes-container">
                <ul class="tab-notes-list">
                  <draggable
                    v-model="capituloSeleccionado.secciones"
                    item-key="id"
                    handle=".drag-handle"
                    class="section-list-nav"
                    tag="ul"
                  >
                    <template #item="{ element, index }">
                      <li :class="`tab-note tab-color-${index % 5}`">
                        <span class="drag-handle" title="Arrastrar">
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                            <circle cx="5"  cy="5"  r="1.5" fill="#888"/>
                            <circle cx="5"  cy="10" r="1.5" fill="#888"/>
                            <circle cx="5" cy="15" r="1.5" fill="#888"/>
                            <circle cx="12" cy="5" r="1.5" fill="#888"/>
                            <circle cx="12" cy="10" r="1.5" fill="#888"/>
                            <circle cx="12" cy="15" r="1.5" fill="#888"/>
                          </svg>
                        </span>
                        <textarea
                          v-model="element.titulo"
                          @input="autoGrow($event)"
                          class="chapter-title-input-seccion"
                          :placeholder="'Título'"
                          rows="1"
                          @click.stop
                        ></textarea>
                        <button class="btn-delete-section" @click.stop="eliminarSeccion(capituloSeleccionado, index)" title="Eliminar sección">
                          <svg class="icon-trash" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </li>
                    </template>
                  </draggable>
                </ul>
              </div>
              <hr>
            </div>
          </aside>
        </div>
      </section>
    </div>
    <SuggestTaxonModal
      v-if="showSuggest"
      :type="suggestType"
      @close="showSuggest=false"
      @submitted="onSuggested"
    />
  </div>
</template>
<script setup>
import { useUserStore } from '@/stores/userStore.js';
import { v4 as uuidv4 } from 'uuid';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import draggable from 'vuedraggable';
import EditorJs from './EditorJs.vue';

import { useBlogEditorStore } from '@/stores/blogEditorStore';
import { useCatalogsStore } from '@/stores/catalogsStore';
import SuggestTaxonModal from './modals/SuggestTaxonModal.vue';

const editorStore = useBlogEditorStore()
const catalogs = useCatalogsStore()

const step = ref(1)

const activeEditorGroupId = ref(null)
function setActiveEditorGroup(id) { activeEditorGroupId.value = id }
function clearActiveEditorGroup(id) { if (activeEditorGroupId.value === id) activeEditorGroupId.value = null }

function ensureEdjsObject(val) {
  if (!val) return { time: Date.now(), blocks: [] }
  if (typeof val === 'string') {
    try { const obj = JSON.parse(val); if (obj && typeof obj === 'object') return obj } catch {}
    return { time: Date.now(), blocks: [] }
  }
  return val
}

const blog = reactive({
  titulo: '',
  descripcion: '',
  tipo: 'simple',
  visibilidad: 'publico',
  publicado: true,
  capitulos: [],
  careersSelected: [],
  careerModes: {},
  subjectsSelected: [],
  subjectModes: {},
  topicsSelected: [],
  freeTags: []
})

watch(() => blog.careersSelected, (newSelection, oldSelection) => {
  const added = newSelection.filter(id => !oldSelection.includes(id))
  added.forEach(id => {
    if (!blog.careerModes[id]) blog.careerModes[id] = 'recommended'
  })
}, { deep: true })

watch(() => blog.subjectsSelected, (newSelection, oldSelection) => {
  const added = newSelection.filter(id => !oldSelection.includes(id))
  added.forEach(id => {
    if (!blog.subjectModes[id]) blog.subjectModes[id] = 'optional'
  })
}, { deep: true })


onMounted(() => { catalogs.fetchAll() })

const capituloSeleccionado = ref(null)
const editorCounter = ref(0)

function ajustarCapitulos(event) {
  if (event.target.value === 'simple' && blog.capitulos.length > 1) {
    alert('No puedes cambiar a modo Simple si tienes más de un capítulo agregado. El modo Simple solo permite un capítulo.')
    event.target.value = 'documentacion'
    blog.tipo = 'documentacion'
    return
  }
  if (blog.tipo === 'simple' && blog.capitulos.length > 1) {
    blog.capitulos.splice(1)
    if (capituloSeleccionado.value && blog.capitulos[0].id !== capituloSeleccionado.value.id) {
      seleccionarCapitulo(blog.capitulos[0])
    }
  }
}

function crearCapituloVacio() {
  return { id: uuidv4(), titulo: '', contenido: { time: Date.now(), blocks: [] }, secciones: [] }
}

function crearSeccionVacia() {
  return { id: uuidv4(), titulo: '', data: { time: Date.now(), blocks: [] } }
}

function agregarCapitulo() {
  if (blog.tipo === 'simple' && blog.capitulos.length >= 1) return
  const nuevo = crearCapituloVacio()
  blog.capitulos.push(nuevo)
  seleccionarCapitulo(nuevo)
  editorCounter.value++ 
}

function agregarSeccion(cap) {
  cap.secciones.push(crearSeccionVacia())
  editorCounter.value++
}

function eliminarCapitulo(idx) {
  if (capituloSeleccionado.value && blog.capitulos[idx].id === capituloSeleccionado.value.id) {
    capituloSeleccionado.value = null
    editorCounter.value++ 
  }
  blog.capitulos.splice(idx, 1)
  if (blog.capitulos.length > 0 && !capituloSeleccionado.value) {
    setTimeout(() => { seleccionarCapitulo(blog.capitulos[0]) }, 50)
  }
}

function seleccionarCapitulo(cap) {
  editorCounter.value++
  capituloSeleccionado.value = cap
  setActiveEditorGroup(cap.id)
}

function eliminarSeccion(cap, idx) {
  cap.secciones.splice(idx, 1)
  editorCounter.value++
}

function autoGrow(e) {
  const el = e.target
  el.style.height = "auto"
  el.style.height = (el.scrollHeight) + "px"
}
const careersPayload = computed(() => blog.careersSelected.map(id => ({ id, mode: blog.careerModes[id] || 'recommended' })))
const subjectsPayload = computed(() => blog.subjectsSelected.map(id => ({ id, mode: blog.subjectModes[id] || 'optional' })))
const topicsPayload   = computed(() => blog.topicsSelected.slice())
const freeTagsPayload = computed(() => blog.freeTags.slice())

const showSuggest = ref(false)
const suggestType = ref('career')
function openSuggest(type){ suggestType.value=type; showSuggest.value=true }
function onSuggested(){ catalogs.fetchAll() }

async function guardarBlog() {
  if (blog.capitulos.length === 0) {
    alert('Debes agregar al menos un capítulo')
    return
  }
  if (!blog.titulo.trim()) {
    alert('Debes agregar un título al blog')
    return
  }

  try {
    const id_usuario = useUserStore().user.id_usuario
    await editorStore.createBlogWithNodes({
      titulo: blog.titulo,
      descripcion: blog.descripcion,
      tipo: blog.tipo,
      id_usuario,
      capitulos: blog.capitulos,
      visibilidad: blog.visibilidad,
      publicado: blog.publicado,
      careers: careersPayload.value,
      subjects: subjectsPayload.value,
      topics: topicsPayload.value,
      tags: freeTagsPayload.value
    })

    step.value = 1
    blog.titulo = ''
    blog.descripcion = ''
    blog.tipo = 'simple'
    blog.visibilidad = 'publico'
    blog.publicado = true
    blog.capitulos = []
    blog.careersSelected = []
    blog.careerModes = {}
    blog.subjectsSelected = []
    blog.subjectModes = {}
    blog.topicsSelected = []
    blog.freeTags = []
    capituloSeleccionado.value = null
    editorCounter.value++
    alert('Blog guardado correctamente')
  } catch (error) {
    console.error('Error al guardar el blog:', error)
    alert('Error al guardar el blog')
  }
}
</script>

<style scoped>
.blog-wizard-root {
  display: flex;
  flex-direction: row;
  background: #f5f7fa;
}
.blog-wizard-sidebar {
  width: 72px;
  background: #f8fafd;
  border-right: 1.5px solid #e0e6ed;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 11px;
}
.blog-wizard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 0;
}
.blog-wizard-form{
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  padding: 36px 0 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
}
.blog-wizard-content {}
.blog-wizard-form .blog-form {
  width: 100%;
  max-width: 820px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 22px;
  background: #f7fafc;
  border-radius: 13px;
  box-shadow: 0 3px 21px rgba(43,56,81,0.08);
  padding: 28px 26px;
  font-size: 0.95em;
}
.input { padding: 10px 12px; font-size: 0.97em; }
.label-line { font-size: 12px; }

.wizard-title {
  margin-left: 38px;
  margin-bottom: 18px;
  font-size: 1.2em;
  font-weight: 700;
  color: #222b3a;
}

.wizard-next-btn, .wizard-back-btn {
  position: absolute;
  color: #134b8d;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.02em;
  padding: 10px 18px;
  transition: background 0.16s;
  cursor: pointer;
  display: flex;
  align-items: center;
  animation: peek-animation 2.5s infinite ease-in-out;
}

@keyframes peek-animation {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(0) translateX(8px); }
}

@media (max-width: 900px) {
  .blog-wizard-form .blog-form { padding: 21px 12px; max-width: 94vw; }
}
.editor-group--active .editor-surface {
  position: relative;
  z-index: 4;
  box-shadow: 0 0 0 1.5px #3377c4;
}

.inputInline { display:flex; align-items:center; gap:10px; }
.checkbox { display:inline-flex; gap:8px; align-items:center; font-size:13px; color:#0f172a; margin-top: 3em;}
.help-inline { margin: -8px 0 8px; color:#64748b; font-size: 12px; }

.group-block { position: relative; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 12px 10px; }
.group-label { position: absolute; top: -10px; left: 12px; background: #ffffff; padding: 0 8px; font-size: 12px; color: #475569; border-radius: 6px; }
.group-actions { display:flex; justify-content:flex-end; margin-bottom:6px; }
.link { border:none; background:none; color:#2563eb; cursor:pointer; padding:0; font-size:12px; }

.chips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 10px;
  grid-auto-rows: min-content;
}
.chip { display: inline-flex; align-items: center; gap: 8px; background: #eef2ff; border: 1px solid #c7d2fe; padding: 6px 10px; border-radius: 999px; font-size: 12px; width: 100%; position:relative; outline:0; box-sizing: border-box; }
.chip input { transform: translateY(1px); accent-color: #2563eb; }
.chip-text { font-size: 12px; color: #0b1220; }

.chip-wrapper { display: flex; flex-direction: column; gap: 8px; }

.chips-grid .chip input:focus,
.chips-grid .chip input:focus-visible { outline: none !important; box-shadow: none !important; }
.chips-grid .chip:focus-within { border-color: #93c5fd; box-shadow: 0 0 0 2px rgba(59,130,246,.18); }

.mode-row {     display: flex
;
    justify-content: flex-end;
    flex-direction: row-reverse;
    align-items: flex-end; }
.mode-row .input.small { width: 35%; right: 200px; }
.input.small { padding: 6px 8px; font-size: 12px; }


.group-block :deep(.tag-input) { width:100%; }
.group-block :deep(.tags) {
  width: 100%; display: flex; flex-wrap: wrap; gap: 6px;
  border: 1px solid #cbd5e1; border-radius: 10px; padding: 6px; background: #fff; box-sizing: border-box;
}
.group-block :deep(.tag) { font-size: 12px; }
.group-block :deep(.tags-input) { flex:1 1 180px; min-width:160px; border:0; outline:0; background:transparent; padding:6px 8px; color:#0b1220; font-size: 13px; }
.group-block :deep(.tag-input:focus-within .tags) { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,.15); }

.group-block .link:focus,
.group-block .link:focus-visible { outline: none; box-shadow: 0 0 0 2px rgba(59,130,246,.15); border-radius: 6px; }

.muted { color: #64748b; font-size: 12px; }
.tiny { font-size: 11px; }

.group-block input:focus, 
.group-block input:focus-visible,
.group-block select:focus, 
.group-block select:focus-visible,
.group-block label:focus,
.group-block label:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

.group-block .input:focus,
.group-block .input:focus-visible {
  outline: none !important;
  box-shadow: none !important;
  border-color: #cbd5e1 !important;
}

.chips-grid .chip:focus-within { border-color: #93c5fd; box-shadow: 0 0 0 2px rgba(59,130,246,.18); }

.chip-wrapper:focus-within .mode-row {
  border-radius: 10px;
  border: 1px solid #93c5fd; 
  box-shadow: 0 0 0 2px rgba(59,130,246,.12); 
  background:#f8fbff;
}
</style>