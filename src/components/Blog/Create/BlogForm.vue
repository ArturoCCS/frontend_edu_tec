<template>
  <div class="paper-sheet">
    <aside class="sidebar-nav">
      <form class="blog-form" @submit.prevent>
        <label for="titulo">Título del blog</label>
        <input
          id="titulo"
          v-model="blog.titulo"
          type="text"
          placeholder="Título del blog"
          maxlength="120"
          required
        />

        <label for="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          v-model="blog.descripcion"
          placeholder="Describe brevemente el blog"
          maxlength="300"
          rows="3"
        ></textarea>

        <label for="tipo">Tipo de blog</label>
        <select
          id="tipo"
          v-model="blog.tipo"
          @change="ajustarCapitulos"
        >
          <option value="simple">Simple (1 capítulo)</option>
          <option value="documentacion">Multicapítulo</option>
        </select>
      </form>

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
            :class="{ selected: capituloSeleccionado?.id===element.id }"
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
      <button class="Btn" @click="agregarCapitulo" :disabled="blog.tipo==='simple'&&blog.capitulos.length>=1">
        <svg class="svgIcon" viewBox="0 0 24 24" width="17" height="17" color="white">
          <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
          <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        </svg>
        <span class="tooltip">Agregar Capítulo</span>
      </button>

      <v-btn @click="guardarBlog" class="text-none text-white mx-11 mt-15" color="black" min-width="92" rounded>
        Guardar
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
        >
       

          <div class="editor-surface">
         
            <editor-js
              :key="`editor-${capituloSeleccionado.id}-${editorCounter}`"
              :holder="`editor-capitulo-${capituloSeleccionado.id}`"
              v-model="capituloSeleccionado.contenido"
              class="editorjs"
            />
          </div>
        </section>
         
        <section
          v-for="(sec) in capituloSeleccionado.secciones"
          :key="sec.id"
          class="editor-group section"
          :aria-labelledby="`label-sec-${capituloSeleccionado.id}-${sec.id}`"
        >
          <header class="editor-header">
            <div class="editor-subtitle">{{ sec.titulo?.trim() || 'Sección' }}</div>
          </header>

          <div class="editor-surface">
            <editor-js
              :key="`editor-sec-${capituloSeleccionado.id}-${sec.id}-${editorCounter}`"
              :holder="`editor-seccion-${capituloSeleccionado.id}-${sec.id}`"
              v-model="sec.data"
              class="editorjs"
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
                      <circle cx="5"  cy="15" r="1.5" fill="#888"/>
                      <circle cx="12" cy="5"  r="1.5" fill="#888"/>
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
      </div>
    </aside>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore.js';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { reactive, ref } from 'vue';
import draggable from 'vuedraggable';
import EditorJs from './EditorJs.vue';

function ensureEdjsObject(val) {
  if (!val) return { time: Date.now(), blocks: [] }
  if (typeof val === 'string') {
    try {
      const obj = JSON.parse(val)
      if (obj && typeof obj === 'object') return obj
    } catch {}
    return { time: Date.now(), blocks: [] }
  }
  return val
}

const blog = reactive({
  titulo: '',
  descripcion: '',
  tipo: 'simple',
  capitulos: [],
})

const capituloSeleccionado = ref(null)
const editorCounter = ref(0)

function crearCapituloVacio() {
  return { 
    id: uuidv4(), 
    titulo: '', 
    contenido: { 
      time: new Date().getTime(),
      blocks: [] 
    }, 
    secciones: [] 
  }
}

function crearSeccionVacia() {
  return { 
    id: uuidv4(), 
    titulo: '', 
    data: { 
      time: new Date().getTime(),
      blocks: [] 
    } 
  }
}

function agregarCapitulo() {
  if (blog.tipo === 'simple' && blog.capitulos.length >= 1) return
  const nuevo = crearCapituloVacio()
  blog.capitulos.push(nuevo)
  seleccionarCapitulo(nuevo)
}

function agregarSeccion(cap) {
  cap.secciones.push(crearSeccionVacia())
  editorCounter.value++
}

function eliminarCapitulo(idx) {
  if (capituloSeleccionado.value && blog.capitulos[idx].id === capituloSeleccionado.value.id) {
    capituloSeleccionado.value = null
  }
  blog.capitulos.splice(idx, 1)
  if (blog.capitulos.length > 0 && !capituloSeleccionado.value) {
    setTimeout(() => { seleccionarCapitulo(blog.capitulos[0]) }, 50)
  }
}

function seleccionarCapitulo(cap) {
  editorCounter.value++
  capituloSeleccionado.value = cap
}

function eliminarSeccion(cap, idx) {
  cap.secciones.splice(idx, 1)
  editorCounter.value++
}

function ajustarCapitulos() {
  if (blog.tipo === 'simple' && blog.capitulos.length > 1) {
    blog.capitulos.splice(1)
    if (capituloSeleccionado.value && blog.capitulos[0].id !== capituloSeleccionado.value.id) {
      seleccionarCapitulo(blog.capitulos[0])
    }
  }
}

function autoGrow(e) {
  const el = e.target
  el.style.height = "auto"
  el.style.height = (el.scrollHeight) + "px"
}

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
    const respBlog = await axios.post('http://localhost:3000/plataform/', {
      Titulo: blog.titulo,
      Descripcion: blog.descripcion,
      Tipo: blog.tipo,
      id_usuario
    })
    const ID_Blog = respBlog?.data?.ID_Blog
    if (!ID_Blog) {
      console.error('Respuesta inesperada al crear blog:', respBlog?.data)
      alert('No se pudo obtener el ID del blog')
      return
    }
    for (const [i, cap] of blog.capitulos.entries()) {
      const contenidoJSON = ensureEdjsObject(cap.contenido)
      const contenidoStr = JSON.stringify(contenidoJSON)

      const respCap = await axios.post(`http://localhost:3000/plataform/${ID_Blog}/capitulos`, {
        Titulo: cap.titulo,
        Contenido: contenidoStr,
        Orden: i + 1
      })

      const idCapitulo = respCap?.data?.ID_Capitulo
      if (!idCapitulo) {
        console.error('Respuesta inesperada al crear capítulo:', respCap?.data)
        alert('No se pudo obtener el ID de un capítulo')
        return
      }

      for (const [j, sec] of cap.secciones.entries()) {
        const secJSON = ensureEdjsObject(sec.data)
        const secStr = JSON.stringify(secJSON)

        await axios.post(`http://localhost:3000/plataform/capitulos/${idCapitulo}/secciones`, {
          Titulo: sec.titulo,
          Contenido: secStr,
          Orden: j + 1
        })
      }
    }
  } catch (error) {
    console.error('Error al guardar el blog:', error)
    alert('Error al guardar el blog')
  }
}
</script>
