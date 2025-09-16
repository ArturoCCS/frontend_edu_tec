<template>
  <div class="blog-portfolio-container">
    <div v-if="loading">
      <div class="skeleton-title" style="margin-bottom: 24px; width: 36%; height: 36px;"></div>
      <div class="skeleton-input" style="margin-bottom: 24px; width: 340px; height: 38px;"></div>
    </div>
    <div v-else>
      <h2 class="portfolio-title">Listado de Blogs</h2>
      <input
        v-model="search"
        type="search"
        class="portfolio-search"
        placeholder="Buscar blog por título o descripción..."
      />
    </div>

    <div v-if="loading" class="portfolio-grid">
      <div v-for="n in perPage" :key="n" class="portfolio-card skeleton-card">
        <div class="portfolio-tab skeleton-tab"></div>
        <div class="portfolio-card-body">
          <div class="skeleton-title"></div>
          <div class="skeleton-desc"></div>
          <div class="skeleton-link"></div>
        </div>
      </div>
    </div>

    <div v-else class="portfolio-grid">
      <a
        v-for="blog in paginatedBlogs"
        :key="blog.ID_Blog"
        class="portfolio-card"
        :href="`${blogBaseUrl}${blog.ID_Blog}`"
        style="text-decoration:none; color:inherit;"
      >
        <div class="portfolio-card-body">
          <h3 class="portfolio-card-title">{{ blog.Titulo }}</h3>
          <p class="portfolio-card-desc">{{ blog.Descripcion }}</p>
          <p class="portfolio-card-desc">
            <span v-if="autorNombres[blog.id_usuario]">
              Autor: {{ autorNombres[blog.id_usuario] }}
            </span>
            <span v-else>
              Autor desconocido
            </span>
          </p>
          <p class="portfolio-card-desc">{{ formateaFecha(blog.Fecha_Creacion) }}</p>
          <i class="fa-solid fa-arrow-right portfolio-card-arrow"></i>
        </div>
      </a>
    </div>

    <div v-if="!loading && totalPages > 1" class="portfolio-pagination">
      <button :disabled="page === 1" @click="page--">&lt;</button>
      <span>Página {{ page }} de {{ totalPages }}</span>
      <button :disabled="page === totalPages" @click="page++">&gt;</button>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { computed, onMounted, ref, watch } from 'vue'

const blogBaseUrl = import.meta.env.VITE_BLOG_URL

const blogs = ref([])
const loading = ref(true)

const page = ref(1)
const perPage = 8
const search = ref("")

const autorNombres = ref({})

function normalizaTexto(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

const filteredBlogs = computed(() => {
  if (!search.value.trim()) return blogs.value
  const query = normalizaTexto(search.value)
  return blogs.value.filter(blog => {
    return (
      normalizaTexto(blog.Titulo ?? "").includes(query) ||
      normalizaTexto(blog.Descripcion ?? "").includes(query)
    )
  })
})

const paginatedBlogs = computed(() => {
  const start = (page.value - 1) * perPage
  const end = start + perPage
  return filteredBlogs.value.slice(start, end)
})
const totalPages = computed(() => Math.max(1, Math.ceil(filteredBlogs.value.length / perPage)))

watch(search, () => { page.value = 1 })

function formateaFecha(fechaStr) {
  if (!fechaStr) return "";
  const fecha = new Date(fechaStr.replace(' ', 'T'));
  return fecha.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await axios.get('http://localhost:3000/plataform/')
    blogs.value = res.data

    const idsAutores = [...new Set(res.data.map(blog => blog.id_usuario))]
    const idsValidos = idsAutores.filter(id => id !== undefined && id !== null)

    const nombresPromises = idsValidos.map(async id => {
      try {
        const res = await axios.get(`http://localhost:3000/user/${id}`)
        autorNombres.value[id] = res.data.name || res.data.nombre || res.data.user?.name || 'Autor desconocido'
      } catch (error) {
        autorNombres.value[id] = 'Autor desconocido'
      }
    })
    await Promise.all(nombresPromises)
    loading.value = false
  } catch (error) {
    console.error(error)
    loading.value = false
  }
})
</script>